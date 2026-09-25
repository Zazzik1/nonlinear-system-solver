import { Token, TokenType } from './lexer';
import { Equation, Expression, ExprKind, parse } from './parser';

const {
    EOF,
    EOL,
    NUMERIC_LITERAL,
    UNARY_OPERATOR,
    BINARY_OPERATOR,
    IDENTIFIER,
    PAREN_OPEN,
    PAREN_CLOSE,
    ASSIGN_OP,
} = TokenType;

function token(type: TokenType, value: string): Token {
    return {
        type,
        value,
        start: 0,
        end: 0,
        line: 0,
        column: 0,
    };
}

describe('parse', () => {
    test('EOF', () => {
        expect(parse([token(EOF, '')] satisfies Token[])).toEqual([]);
    });
    test('123.456 EOF', () => {
        expect(
            parse([
                token(NUMERIC_LITERAL, '123.456'),
                token(EOF, ''),
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
                token(UNARY_OPERATOR, 'ln'),
                token(NUMERIC_LITERAL, '2'),
                token(EOF, ''),
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
                token(UNARY_OPERATOR, 'cos'),
                token(UNARY_OPERATOR, 'cos'),
                token(IDENTIFIER, 'x'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '123'),
                token(EOL, ';'),
                token(NUMERIC_LITERAL, '321.1'),
                token(EOL, ';'),
                token(NUMERIC_LITERAL, '44'),
                token(EOL, ';'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '12.34'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '56.78'),
                token(EOF, ''),
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
                token(IDENTIFIER, 'a'),
                token(BINARY_OPERATOR, '/'),
                token(IDENTIFIER, 'b'),
                token(EOF, ''),
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
                token(UNARY_OPERATOR, 'ln'),
                token(IDENTIFIER, 'x'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '1'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '3'),
                token(BINARY_OPERATOR, '*'),
                token(NUMERIC_LITERAL, '4'),
                token(EOF, ''),
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
    test('2 * 3 + 4 EOF', () => {
        expect(
            parse([
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '*'),
                token(NUMERIC_LITERAL, '3'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '4'),
                token(EOF, ''),
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
    test('x ^ 2 + 2 x - 1 EOF', () => {
        expect(
            parse([
                token(IDENTIFIER, 'x'),
                token(BINARY_OPERATOR, '^'),
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '2'),
                token(IDENTIFIER, 'x'),
                token(BINARY_OPERATOR, '-'),
                token(NUMERIC_LITERAL, '1'),
                token(EOF, ''),
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '-',
                left: {
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
                },
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 1,
                },
            },
        ] satisfies Expression[]);
    });
    test('ln 2 - ln 3 EOF', () => {
        expect(
            parse([
                token(UNARY_OPERATOR, 'ln'),
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '-'),
                token(UNARY_OPERATOR, 'ln'),
                token(NUMERIC_LITERAL, '3'),
                token(EOF, ''),
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
                token(PAREN_OPEN, '('),
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '3'),
                token(PAREN_CLOSE, ')'),
                token(BINARY_OPERATOR, '*'),
                token(NUMERIC_LITERAL, '4'),
                token(EOF, ''),
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
                token(IDENTIFIER, 'x'),
                token(PAREN_OPEN, '('),
                token(IDENTIFIER, 'y'),
                token(BINARY_OPERATOR, '-'),
                token(NUMERIC_LITERAL, '1'),
                token(PAREN_CLOSE, ')'),
                token(EOF, ''),
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
                token(UNARY_OPERATOR, 'ln'),
                token(PAREN_OPEN, '('),
                token(IDENTIFIER, 'x'),
                token(BINARY_OPERATOR, '-'),
                token(NUMERIC_LITERAL, '1'),
                token(PAREN_CLOSE, ')'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '1'),
                token(BINARY_OPERATOR, '+'),
                token(PAREN_OPEN, '('),
                token(NUMERIC_LITERAL, '2'),
                token(PAREN_CLOSE, ')'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '3'),
                token(EOF, ''),
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
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
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 3,
                },
            },
        ] satisfies Expression[]);
    });
    test('1 + ( 2 + 3 ) + 4 EOF', () => {
        expect(
            parse([
                token(NUMERIC_LITERAL, '1'),
                token(BINARY_OPERATOR, '+'),
                token(PAREN_OPEN, '('),
                token(NUMERIC_LITERAL, '2'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '3'),
                token(PAREN_CLOSE, ')'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '4'),
                token(EOF, ''),
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
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
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 4,
                },
            },
        ] satisfies Expression[]);
    });
    test('1 + ( ( 2 ) ) + 3 EOF', () => {
        expect(
            parse([
                token(NUMERIC_LITERAL, '1'),
                token(BINARY_OPERATOR, '+'),
                token(PAREN_OPEN, '('),
                token(PAREN_OPEN, '('),
                token(NUMERIC_LITERAL, '2'),
                token(PAREN_CLOSE, ')'),
                token(PAREN_CLOSE, ')'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '3'),
                token(EOF, ''),
            ] satisfies Token[]),
        ).toEqual([
            {
                kind: ExprKind.BINARY_EXPRESSION,
                operator: '+',
                left: {
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
                right: {
                    kind: ExprKind.NUMERIC_LITERAL,
                    value: 3,
                },
            },
        ] satisfies Expression[]);
    });
    test('( 1 ) + 2 EOF', () => {
        expect(
            parse([
                token(PAREN_OPEN, '('),
                token(NUMERIC_LITERAL, '1'),
                token(PAREN_CLOSE, ')'),
                token(BINARY_OPERATOR, '+'),
                token(NUMERIC_LITERAL, '2'),
                token(EOF, ''),
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
                token(UNARY_OPERATOR, 'ln'),
                token(IDENTIFIER, 'x'),
                token(BINARY_OPERATOR, '-'),
                token(NUMERIC_LITERAL, '1'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '2'),
                token(IDENTIFIER, 'x'),
                token(EOF, ''),
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
                token(IDENTIFIER, 'kitty'),
                token(ASSIGN_OP, '='),
                token(UNARY_OPERATOR, 'ln'),
                token(PAREN_OPEN, '('),
                token(IDENTIFIER, 'meow'),
                token(PAREN_CLOSE, ')'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '1'),
                token(ASSIGN_OP, '='),
                token(NUMERIC_LITERAL, '2'),
                token(EOF, ''),
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
                token(NUMERIC_LITERAL, '1'),
                token(ASSIGN_OP, '='),
                token(EOL, ';'),
                token(ASSIGN_OP, '='),
                token(NUMERIC_LITERAL, '1'),
                token(EOL, ';'),
                token(ASSIGN_OP, '='),
                token(EOF, ';'),
            ] satisfies Token[]),
        ).toEqual([undefined, undefined, undefined]);
    });
    test('x = - 1 EOF', () => {
        expect(
            parse([
                token(IDENTIFIER, 'x'),
                token(ASSIGN_OP, '='),
                token(UNARY_OPERATOR, '-'),
                token(NUMERIC_LITERAL, '1'),
                token(EOF, ''),
            ] satisfies Token[]),
        ).toEqual([
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
        ]);
    });
});
