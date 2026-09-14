import { createVariables, evaluate, Variables } from './eval';
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
});
