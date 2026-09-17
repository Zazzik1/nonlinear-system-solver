import { createVariables, evaluate, Variables } from './eval';
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
            expect(() =>
                evaluate([
                    {
                        kind: ExprKind.IDENTIFIER,
                        value: name,
                    },
                ] satisfies Expression[]),
            ).toThrow(`Variable "${name}" is not defined`);
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
