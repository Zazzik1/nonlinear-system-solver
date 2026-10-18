import { EvaluationError } from './errors';
import { calculateDerivative, createVariables, evaluate } from './eval';
import { Equation, Expression, ExprKind } from './parser';

describe('evaluate', () => {
    test('lnx + 1, x=1 -> 1', () => {
        expect(
            evaluate(
                [
                    {
                        kind: ExprKind.BINARY_EXPRESSION,
                        operator: '+',
                        left: {
                            kind: ExprKind.UNARY_EXPRESSION,
                            operator: 'ln',
                            argument: {
                                kind: ExprKind.IDENTIFIER,
                                value: 'x',
                            },
                        },
                        right: {
                            kind: ExprKind.NUMERIC_LITERAL,
                            value: 1,
                        },
                    },
                ] satisfies Expression[],
                createVariables({ x: 1 }),
            ),
        ).toEqual([1]);
    });
    test('a + b, a=123, b=321 -> 444', () => {
        expect(
            evaluate(
                [
                    {
                        kind: ExprKind.BINARY_EXPRESSION,
                        operator: '+',
                        left: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'a',
                        },
                        right: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'b',
                        },
                    },
                ] satisfies Expression[],
                createVariables({ a: 123, b: 321 }),
            ),
        ).toEqual([444]);
    });
    test('__proto__, toString, constructor -> must be undefined', () => {
        for (const name of ['__proto__', 'toString', 'constructor']) {
            try {
                evaluate([
                    {
                        kind: ExprKind.IDENTIFIER,
                        value: name,
                    },
                ] satisfies Expression[]);
                throw new Error('Expected evaluate() to throw');
            } catch (error) {
                expect(error).toBeInstanceOf(EvaluationError);
                expect(error).toMatchObject({
                    message: `Variable "${name}" is not defined`,
                    code: 'UNDEFINED_VARIABLE',
                    // line: 1,
                    // column: 1,
                });
            }
        }
    });
    test('x = ln2 -> undefined, sets variable x to Expression', () => {
        const variables = new Map();
        expect(variables.get('x')).toBe(undefined);
        expect(
            evaluate(
                [
                    {
                        kind: ExprKind.EQUATION,
                        left: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'x',
                        },
                        right: {
                            kind: ExprKind.UNARY_EXPRESSION,
                            operator: 'ln',
                            argument: {
                                kind: ExprKind.NUMERIC_LITERAL,
                                value: 2,
                            },
                        },
                    },
                ],
                variables,
            ),
        ).toEqual([undefined]);
        expect(variables.get('x')).toEqual({
            kind: ExprKind.UNARY_EXPRESSION,
            operator: 'ln',
            argument: {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 2,
            },
        });
    });
    // TODO
    test.skip('111, 1 - v = 4, 333 -> 111, undefined (sets variable v to Expression), 333', () => {
        const variables = new Map();
        expect(variables.get('v')).toBe(undefined);
        expect(
            evaluate(
                [
                    {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 111,
                    },
                    {
                        kind: ExprKind.EQUATION,
                        left: {
                            kind: ExprKind.BINARY_EXPRESSION,
                            operator: '-',
                            left: {
                                kind: ExprKind.NUMERIC_LITERAL,
                                value: 1,
                            },
                            right: {
                                kind: ExprKind.IDENTIFIER,
                                value: 'v',
                            },
                        },
                        right: {
                            kind: ExprKind.NUMERIC_LITERAL,
                            value: 4,
                        },
                    },
                    {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 333,
                    },
                ],
                variables,
            ),
        ).toEqual([111, undefined, 333]);
        expect(variables.get('v')).toEqual({
            kind: ExprKind.NUMERIC_LITERAL,
            value: -3,
        } satisfies Expression);
    });
    test('111; x = -1; 333', () => {
        const variables = new Map();
        expect(variables.get('x')).toBe(undefined);
        expect(
            evaluate(
                [
                    {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 111,
                    },
                    {
                        kind: ExprKind.EQUATION,
                        left: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'x',
                        },
                        right: {
                            kind: ExprKind.UNARY_EXPRESSION,
                            operator: '-',
                            argument: {
                                kind: ExprKind.NUMERIC_LITERAL,
                                value: 1,
                            },
                        },
                    } satisfies Equation,
                    {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 333,
                    },
                ],
                variables,
            ),
        ).toEqual([111, undefined, 333]);
        expect(variables.get('x')).toEqual({
            kind: ExprKind.UNARY_EXPRESSION,
            operator: '-',
            argument: {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 1,
            },
        } satisfies Expression);
    });
});

describe('calculateDerivative', () => {
    const expression: Expression = {
        kind: ExprKind.BINARY_EXPRESSION,
        operator: '*',
        left: {
            kind: ExprKind.IDENTIFIER,
            value: 'a',
        },
        right: {
            kind: ExprKind.BINARY_EXPRESSION,
            operator: '^',
            left: {
                kind: ExprKind.IDENTIFIER,
                value: 'x',
            },
            right: {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 2,
            },
        },
    };
    test('d/dx (a*x^2) at x=3, env a=12', () => {
        const a = 12;
        const x = 3;
        expect(
            calculateDerivative(expression, 'x', x, new Map([['a', a]])),
        ).toBeCloseTo(a * 2 * x, 4);
    });
    test('d/da (a*x^2) at a=3, env x=4', () => {
        const a = 3;
        const x = 4;
        expect(
            calculateDerivative(expression, 'a', a, new Map([['x', x]])),
        ).toBeCloseTo(x * x, 4);
    });
    test('d/dz (a*x^2) at z=3, env x=2, a=4', () => {
        const z = 3;
        const x = 2;
        const a = 4;
        expect(
            calculateDerivative(
                expression,
                'z',
                z,
                new Map([
                    ['a', a],
                    ['x', x],
                ]),
            ),
        ).toBeCloseTo(0, 4);
    });
    test.each([[0], [1], [3], [-1]])(
        'd/dx (e^x) at x=%s, env e=Math.E',
        (x: number) => {
            expect(
                calculateDerivative(
                    {
                        kind: ExprKind.BINARY_EXPRESSION,
                        operator: '^',
                        left: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'e',
                        },
                        right: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'x',
                        },
                    } satisfies Expression,
                    'x',
                    x,
                    new Map([['e', Math.E]]),
                ),
            ).toBeCloseTo(Math.exp(x), 4);
        },
    );
    test('d/dx (sinx) at x=2', () => {
        const x = 2;
        expect(
            calculateDerivative(
                {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'sin',
                    argument: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                } satisfies Expression,
                'x',
                x,
            ),
        ).toBeCloseTo(Math.cos(x), 4);
    });
});
