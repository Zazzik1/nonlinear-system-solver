import { EvaluationError } from './errors';
import {
    calculateDerivative,
    createVariables,
    evaluate,
    getVariableNames,
    getVariableNamesInAGroup,
} from './eval';
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
                createVariables({ x: { value: 1 } }),
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
                createVariables({ a: { value: 123 }, b: { value: 321 } }),
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
        expect(variables.get('x')?.value).toEqual({
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
        expect(variables.get('x')?.value).toEqual({
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
            calculateDerivative(
                expression,
                'x',
                x,
                createVariables({ a: { value: a } }),
            ),
        ).toBeCloseTo(a * 2 * x, 4);
    });
    test('d/da (a*x^2) at a=3, env x=4', () => {
        const a = 3;
        const x = 4;
        expect(
            calculateDerivative(
                expression,
                'a',
                a,
                createVariables({ x: { value: x } }),
            ),
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
                createVariables({
                    a: { value: a },
                    x: { value: x },
                }),
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
                    createVariables({ e: { value: Math.E, constant: true } }),
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

describe('getVariableNames', () => {
    test('sin(x) -> [x]', () => {
        expect(
            getVariableNames({
                kind: ExprKind.UNARY_EXPRESSION,
                operator: 'sin',
                argument: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'x',
                },
            }),
        ).toEqual(['x']);
    });
    test('sin(x), env x=1 -> [x]', () => {
        expect(
            getVariableNames(
                {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'sin',
                    argument: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                },
                createVariables({ x: { value: 1 } }),
            ),
        ).toEqual(['x']);
    });
    test('sin(sin(sin(x))) -> [x]', () => {
        expect(
            getVariableNames({
                kind: ExprKind.UNARY_EXPRESSION,
                operator: 'sin',
                argument: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'sin',
                    argument: {
                        kind: ExprKind.UNARY_EXPRESSION,
                        operator: 'sin',
                        argument: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'x',
                        },
                    },
                },
            }),
        ).toEqual(['x']);
    });
    test('2ab -> [a, b]', () => {
        expect(
            getVariableNames({
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '*',
                left: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '*',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                    right: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'a',
                    },
                },
                right: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'b',
                },
            }),
        ).toEqual(['a', 'b']);
    });
    test('x*x*x -> [x]', () => {
        expect(
            getVariableNames({
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '*',
                left: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '*',
                    left: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                    right: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                },
                right: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'x',
                },
            }),
        ).toEqual(['x']);
    });
    test('y=sin(x) -> [y, x]', () => {
        expect(
            getVariableNames({
                kind: ExprKind.EQUATION,
                left: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'y',
                },
                right: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'sin',
                    argument: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                },
            }),
        ).toEqual(['y', 'x']);
    });
    test('e^x -> [x] (excludes constants)', () => {
        expect(
            getVariableNames(
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
                },
                createVariables({ e: { value: Math.E, constant: true } }),
            ),
        ).toEqual(['x']);
    });
});
describe('getVariableNamesInAGroup', () => {
    test('a; b; c=b; d; d -> [a, b, c, d]', () => {
        expect(
            getVariableNamesInAGroup([
                { kind: ExprKind.IDENTIFIER, value: 'a' },
                { kind: ExprKind.IDENTIFIER, value: 'b' },
                {
                    kind: ExprKind.EQUATION,
                    left: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'c',
                    },
                    right: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'b',
                    },
                },
                { kind: ExprKind.IDENTIFIER, value: 'd' },
                { kind: ExprKind.IDENTIFIER, value: 'd' },
            ]),
        ).toEqual(['a', 'b', 'c', 'd']);
    });
});
