import { evaluate, Variables } from './eval';
import { Expression, ExprKind } from './parser';

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
                { x: 1 } satisfies Variables,
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
                { a: 123, b: 321 } satisfies Variables,
            ),
        ).toEqual([444]);
    });
});
