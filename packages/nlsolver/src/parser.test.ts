import { Token, TokenType } from './lexer';
import { Equation, Expression, ExprKind, parse } from './parser';

describe('parse', () => {
    test('EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([]);
    });
    test('123.456 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '123.456',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 123.456,
            },
        ] satisfies Expression[]);
    });
    test('ln 2 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.UNARY_EXPRESSION,
                operator: 'ln',
                argument: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 2,
                },
            },
        ] satisfies Expression[]);
    });
    test('cos cos x EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'cos',
                },
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'cos',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.UNARY_EXPRESSION,
                operator: 'cos',
                argument: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'cos',
                    argument: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('123 EOL 321 EOL 44 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '123',
                },
                {
                    type: TokenType.EOL,
                    value: ';',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '321.1',
                },
                {
                    type: TokenType.EOL,
                    value: ';',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '44',
                },
                {
                    type: TokenType.EOL,
                    value: ';',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 123,
            },
            {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 321.1,
            },
            {
                kind: ExprKind.NUMERIC_LITERAL,
                value: 44,
            },
        ] satisfies Expression[]);
    });
    test('12.34 + 56.78 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '12.34',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '56.78',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 12.34,
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 56.78,
                },
            },
        ] satisfies Expression[]);
    });
    test('a / b EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.IDENTIFIER,
                    value: 'a',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '/',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'b',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '/',
                left: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'a',
                },
                right: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'b',
                },
            },
        ] satisfies Expression[]);
    });
    test('ln x + 1 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
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
        ] satisfies Expression[]);
    });
    test('2 + 3 * 4 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '*',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '4',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 2,
                },
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '*',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 4,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    // todo
    test.skip('2 * 3 + 4 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '*',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '4',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '*',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 4,
                },
            },
        ] satisfies Expression[]);
    });
    // todo
    test.skip('x ^ 2 + 2 x - 1 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '^',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '-',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
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
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '-',
                    left: {
                        kind: ExprKind.BINARY_EXPRESSION,
                        operator: '*',
                        left: {
                            kind: ExprKind.NUMERIC_LITERAL,
                            value: 2,
                        },
                        right: {
                            kind: ExprKind.IDENTIFIER,
                            value: 'x',
                        },
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 1,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('ln 2 - ln 3 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '-',
                },
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '-',
                left: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'ln',
                    argument: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                },
                right: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'ln',
                    argument: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('( 2 + 3 ) * 4 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '*',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '4',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '*',
                left: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '+',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 4,
                },
            },
        ] satisfies Expression[]);
    });
    test('x ( y - 1 ) EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'y',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '-',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '*',
                left: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'x',
                },
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '-',
                    left: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'y',
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 1,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('ln ( x - 1 ) EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '-',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.UNARY_EXPRESSION,
                operator: 'ln',
                argument: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '-',
                    left: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'x',
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 1,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('1 + ( 2 ) + 3 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '+',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('1 + ( 2 + 3 ) + 4 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '4',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '+',
                    left: {
                        kind: ExprKind.BINARY_EXPRESSION,
                        operator: '+',
                        left: {
                            kind: ExprKind.NUMERIC_LITERAL,
                            value: 2,
                        },
                        right: {
                            kind: ExprKind.NUMERIC_LITERAL,
                            value: 3,
                        },
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 4,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('1 + ( ( 2 ) ) + 3 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '3',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
                right: {
                    kind: ExprKind.BINARY_EXPRESSION,
                    operator: '+',
                    left: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 2,
                    },
                    right: {
                        kind: ExprKind.NUMERIC_LITERAL,
                        value: 3,
                    },
                },
            },
        ] satisfies Expression[]);
    });
    test('( 1 ) + 2 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '+',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 2,
                },
            },
        ] satisfies Expression[]);
    });
    test('ln x - 1 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.BINARY_OPERATOR,
                    value: '-',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '-',
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
        ] satisfies Expression[]);
    });
    test('2 x EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'x',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '*',
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 2,
                },
                right: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'x',
                },
            },
        ] satisfies Expression[]);
    });
    test('kitty = ln ( meow ) EOF', () => {
        // does not throw "variable 'meow' is not defined"
        expect(
            parse([
                {
                    type: TokenType.IDENTIFIER,
                    value: 'kitty',
                },
                {
                    type: TokenType.ASSIGN_OP,
                    value: '=',
                },
                {
                    type: TokenType.UNARY_OPERATOR,
                    value: 'ln',
                },
                {
                    type: TokenType.PAREN_OPEN,
                    value: '(',
                },
                {
                    type: TokenType.IDENTIFIER,
                    value: 'meow',
                },
                {
                    type: TokenType.PAREN_CLOSE,
                    value: ')',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.EQUATION,
                left: {
                    kind: ExprKind.IDENTIFIER,
                    value: 'kitty',
                },
                right: {
                    kind: ExprKind.UNARY_EXPRESSION,
                    operator: 'ln',
                    argument: {
                        kind: ExprKind.IDENTIFIER,
                        value: 'meow',
                    },
                },
            } satisfies Equation,
        ]);
    });
    test('1 = 2 EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.ASSIGN_OP,
                    value: '=',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '2',
                },
                {
                    type: TokenType.EOF,
                    value: '',
                },
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.EQUATION,
                left: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 2,
                },
            } satisfies Equation,
        ]);
    });
    test('1 = ; = 1 ; = EOF', () => {
        expect(
            parse([
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.ASSIGN_OP,
                    value: '=',
                },
                {
                    type: TokenType.EOL,
                    value: ';',
                },
                {
                    type: TokenType.ASSIGN_OP,
                    value: '=',
                },
                {
                    type: TokenType.NUMERIC_LITERAL,
                    value: '1',
                },
                {
                    type: TokenType.EOL,
                    value: ';',
                },
                {
                    type: TokenType.ASSIGN_OP,
                    value: '=',
                },
                {
                    type: TokenType.EOF,
                    value: ';',
                },
            ] satisfies Token[]),
        ).toEqual([undefined, undefined, undefined]);
    });
});
