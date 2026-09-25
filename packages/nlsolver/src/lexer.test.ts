import { Token, tokenize, TokenType } from './lexer';

describe('tokenize', () => {
    test('e^x', () => {
        expect(tokenize('e^x')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'e',
                column: 1,
                line: 1,
                start: 0,
                end: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',
                column: 2,
                line: 1,
                start: 1,
                end: 2,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',
                column: 3,
                line: 1,
                start: 2,
                end: 3,
            },
            {
                type: TokenType.EOF,
                value: '',
                column: 4,
                line: 1,
                start: 3,
                end: 3,
            },
        ] satisfies Token[]);
    });
    test('e^-x', () => {
        expect(tokenize('e^-x')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'e',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',

                start: 1,
                end: 2,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 4,
                end: 4,
                line: 1,
                column: 5,
            },
        ] satisfies Token[]);
    });
    test('kitty123^-2', () => {
        expect(tokenize('kitty123^-2')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'kitty123',

                start: 0,
                end: 8,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',

                start: 8,
                end: 9,
                line: 1,
                column: 9,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 9,
                end: 10,
                line: 1,
                column: 10,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 10,
                end: 11,
                line: 1,
                column: 11,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 11,
                end: 11,
                line: 1,
                column: 12,
            },
        ] satisfies Token[]);
    });
    test('2ln(3)', () => {
        expect(tokenize('2ln(3)')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',

                start: 1,
                end: 3,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.PAREN_OPEN,
                value: '(',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '3',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.PAREN_CLOSE,
                value: ')',

                start: 5,
                end: 6,
                line: 1,
                column: 6,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 6,
                end: 6,
                line: 1,
                column: 7,
            },
        ] satisfies Token[]);
    });
    test('cat*sin(x)', () => {
        expect(tokenize('cat*sin(x)')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'cat',

                start: 0,
                end: 3,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',

                start: 4,
                end: 7,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.PAREN_OPEN,
                value: '(',

                start: 7,
                end: 8,
                line: 1,
                column: 8,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 8,
                end: 9,
                line: 1,
                column: 9,
            },
            {
                type: TokenType.PAREN_CLOSE,
                value: ')',

                start: 9,
                end: 10,
                line: 1,
                column: 10,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 10,
                end: 10,
                line: 1,
                column: 11,
            },
        ] satisfies Token[]);
    });
    test('ln2', () => {
        expect(tokenize('ln2')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',

                start: 0,
                end: 2,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 3,
                end: 3,
                line: 1,
                column: 4,
            },
        ] satisfies Token[]);
    });
    test('ln(2)', () => {
        expect(tokenize('ln(2)')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',

                start: 0,
                end: 2,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.PAREN_OPEN,
                value: '(',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.PAREN_CLOSE,
                value: ')',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 5,
                end: 5,
                line: 1,
                column: 6,
            },
        ] satisfies Token[]);
    });
    test('lnx', () => {
        expect(tokenize('lnx')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',

                start: 0,
                end: 2,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 3,
                end: 3,
                line: 1,
                column: 4,
            },
        ] satisfies Token[]);
    });
    test('aaaaaaaaaasin', () => {
        expect(tokenize('aaaaaaaaaasin')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'aaaaaaaaaasin',

                start: 0,
                end: 13,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 13,
                end: 13,
                line: 1,
                column: 14,
            },
        ] satisfies Token[]);
    });
    test('sinaaaaaaaasin', () => {
        expect(tokenize('sinaaaaaaaasin')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',

                start: 0,
                end: 3,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'aaaaaaaasin',

                start: 3,
                end: 14,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 14,
                end: 14,
                line: 1,
                column: 15,
            },
        ] satisfies Token[]);
    });
    test('2sinx*cosx', () => {
        expect(tokenize('2sinx*cosx')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',

                start: 1,
                end: 4,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',

                start: 5,
                end: 6,
                line: 1,
                column: 6,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'cos',

                start: 6,
                end: 9,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 9,
                end: 10,
                line: 1,
                column: 10,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 10,
                end: 10,
                line: 1,
                column: 11,
            },
        ] satisfies Token[]);
    });
    test('2sinxcosx', () => {
        expect(tokenize('2sinxcosx')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',

                start: 1,
                end: 4,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'xcosx', // it must be like that

                start: 4,
                end: 9,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 9,
                end: 9,
                line: 1,
                column: 10,
            },
        ] satisfies Token[]);
    });
    test('coscoscosx', () => {
        expect(tokenize('coscoscosx')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'cos',

                start: 0,
                end: 3,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'cos',

                start: 3,
                end: 6,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'cos',

                start: 6,
                end: 9,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 9,
                end: 10,
                line: 1,
                column: 10,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 10,
                end: 10,
                line: 1,
                column: 11,
            },
        ] satisfies Token[]);
    });
    test('-x+y', () => {
        expect(tokenize('-x+y')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 1,
                end: 2,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '+',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'y',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 4,
                end: 4,
                line: 1,
                column: 5,
            },
        ] as Token[]);
    });
    test('-1-(-1)', () => {
        expect(tokenize('-1-(-1)')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 1,
                end: 2,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '-',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.PAREN_OPEN,
                value: '(',

                start: 3,
                end: 4,
                line: 1,
                column: 4,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 5,
                end: 6,
                line: 1,
                column: 6,
            },
            {
                type: TokenType.PAREN_CLOSE,
                value: ')',

                start: 6,
                end: 7,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 7,
                end: 7,
                line: 1,
                column: 8,
            },
        ] satisfies Token[]);
    });
    test('1 2 3', () => {
        expect(tokenize('1 2 3')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '3',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 5,
                end: 5,
                line: 1,
                column: 6,
            },
        ] satisfies Token[]);
    });
    test('a b c + 1', () => {
        expect(tokenize('a b c + 1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'a',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'b',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'c',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '+',

                start: 6,
                end: 7,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 8,
                end: 9,
                line: 1,
                column: 9,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 9,
                end: 9,
                line: 1,
                column: 10,
            },
        ] satisfies Token[]);
    });
    test('-1; -2, -3\n-4;    -5', () => {
        expect(tokenize('-1; -2, -3\n-4;    -5')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 1,
                end: 2,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.EOL,
                value: ';',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 4,
                end: 5,
                line: 2,
                column: 2,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 5,
                end: 6,
                line: 2,
                column: 3,
            },
            {
                type: TokenType.EOL,
                value: ',',

                start: 6,
                end: 7,
                line: 2,
                column: 4,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 8,
                end: 9,
                line: 3,
                column: 2,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '3',

                start: 9,
                end: 10,
                line: 3,
                column: 3,
            },
            {
                type: TokenType.EOL,
                value: '\n',

                start: 10,
                end: 11,
                line: 3,
                column: 4,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 11,
                end: 12,
                line: 4,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '4',

                start: 12,
                end: 13,
                line: 4,
                column: 2,
            },
            {
                type: TokenType.EOL,
                value: ';',

                start: 13,
                end: 14,
                line: 4,
                column: 3,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 18,
                end: 19,
                line: 5,
                column: 5,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '5',

                start: 19,
                end: 20,
                line: 5,
                column: 6,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 20,
                end: 20,
                line: 5,
                column: 7,
            },
        ] satisfies Token[]);
    });
    test('12.34+45.6711', () => {
        expect(tokenize('12.34+45.6711')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '12.34',

                start: 0,
                end: 5,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '+',

                start: 5,
                end: 6,
                line: 1,
                column: 6,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '45.6711',

                start: 6,
                end: 13,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 13,
                end: 13,
                line: 1,
                column: 14,
            },
        ] satisfies Token[]);
    });
    test('.4', () => {
        expect(tokenize('.4')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '.4',

                start: 0,
                end: 2,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 2,
                end: 2,
                line: 1,
                column: 3,
            },
        ] satisfies Token[]);
    });
    test('-.4', () => {
        expect(tokenize('-.4')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '.4',

                start: 1,
                end: 3,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 3,
                end: 3,
                line: 1,
                column: 4,
            },
        ] satisfies Token[]);
    });
    test('4.a * a.4', () => {
        // seems good, it's similar to "4sinx -> 4.sinx" (4a -> 4.a)
        expect(tokenize('4.a * a.4')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '4.',

                start: 0,
                end: 2,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'a',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'a.4',

                start: 6,
                end: 9,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 9,
                end: 9,
                line: 1,
                column: 10,
            },
        ] satisfies Token[]);
    });
    test('k$tty123_@       -1', () => {
        expect(tokenize('k$tty123_@       -1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'k$tty123_@',

                start: 0,
                end: 10,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '-',

                start: 17,
                end: 18,
                line: 1,
                column: 18,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 18,
                end: 19,
                line: 1,
                column: 19,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 19,
                end: 19,
                line: 1,
                column: 20,
            },
        ] satisfies Token[]);
    });
    test('k$tty123_@   ;   -1', () => {
        expect(tokenize('k$tty123_@   ;   -1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'k$tty123_@',

                start: 0,
                end: 10,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.EOL,
                value: ';',

                start: 13,
                end: 14,
                line: 1,
                column: 14,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 17,
                end: 18,
                line: 2,
                column: 4,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 18,
                end: 19,
                line: 2,
                column: 5,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 19,
                end: 19,
                line: 2,
                column: 6,
            },
        ] satisfies Token[]);
    });
    test('1 + 2 # + 3 ; 4 ; 5 #meow', () => {
        expect(tokenize('1 + 2 # + 3 ; 4 ; 5 #meow')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '+',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.COMMENT,
                value: ' + 3 ',

                start: 6,
                end: 12,
                line: 1,
                column: 7,
            },
            {
                type: TokenType.EOL,
                value: ';',

                start: 12,
                end: 13,
                line: 1,
                column: 13,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '4',

                start: 14,
                end: 15,
                line: 2,
                column: 2,
            },
            {
                type: TokenType.EOL,
                value: ';',

                start: 16,
                end: 17,
                line: 2,
                column: 4,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '5',

                start: 18,
                end: 19,
                line: 3,
                column: 2,
            },
            {
                type: TokenType.COMMENT,
                value: 'meow',

                start: 20,
                end: 25,
                line: 3,
                column: 4,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 25,
                end: 25,
                line: 3,
                column: 9,
            },
        ] satisfies Token[]);
    });
    test('1###2', () => {
        expect(tokenize('1###2')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.COMMENT,
                value: '##2',

                start: 1,
                end: 5,
                line: 1,
                column: 2,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 5,
                end: 5,
                line: 1,
                column: 6,
            },
        ] satisfies Token[]);
    });
    test('x = 1', () => {
        expect(tokenize('x = 1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.ASSIGN_OP,
                value: '=',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 5,
                end: 5,
                line: 1,
                column: 6,
            },
        ] satisfies Token[]);
    });
    test('x = -1', () => {
        expect(tokenize('x = -1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'x',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.ASSIGN_OP,
                value: '=',

                start: 2,
                end: 3,
                line: 1,
                column: 3,
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',

                start: 4,
                end: 5,
                line: 1,
                column: 5,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 5,
                end: 6,
                line: 1,
                column: 6,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 6,
                end: 6,
                line: 1,
                column: 7,
            },
        ] satisfies Token[]);
    });
    test(';', () => {
        expect(tokenize(';')).toEqual([
            {
                type: TokenType.EOL,
                value: ';',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 1,
                end: 1,
                line: 2,
                column: 1,
            },
        ] satisfies Token[]);
    });
    test(';1', () => {
        expect(tokenize(';1')).toEqual([
            {
                type: TokenType.EOL,
                value: ';',

                start: 0,
                end: 1,
                line: 1,
                column: 1,
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',

                start: 1,
                end: 2,
                line: 2,
                column: 1,
            },
            {
                type: TokenType.EOF,
                value: '',

                start: 2,
                end: 2,
                line: 2,
                column: 2,
            },
        ] satisfies Token[]);
    });
});
