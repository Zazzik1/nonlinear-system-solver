import { Token, tokenize, TokenType } from './lexer';

describe('tokenize', () => {
    test('e^x', () => {
        expect(tokenize('e^x')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'e',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('e^-x', () => {
        expect(tokenize('e^-x')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'e',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('kitty123^-2', () => {
        expect(tokenize('kitty123^-2')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'kitty123',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '^',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('2ln(3)', () => {
        expect(tokenize('2ln(3)')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
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
                type: TokenType.NUMERIC_LITERAL,
                value: '3',
            },
            {
                type: TokenType.PAREN_CLOSE,
                value: ')',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('cat*sin(x)', () => {
        expect(tokenize('cat*sin(x)')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'cat',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',
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
                type: TokenType.PAREN_CLOSE,
                value: ')',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('ln2', () => {
        expect(tokenize('ln2')).toEqual([
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
        ] satisfies Token[]);
    });
    test('ln(2)', () => {
        expect(tokenize('ln(2)')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',
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
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('lnx', () => {
        expect(tokenize('lnx')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'ln',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('aaaaaaaaaasin', () => {
        expect(tokenize('aaaaaaaaaasin')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'aaaaaaaaaasin',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('sinaaaaaaaasin', () => {
        expect(tokenize('sinaaaaaaaasin')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'aaaaaaaasin',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('2sinx*cosx', () => {
        expect(tokenize('2sinx*cosx')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'x',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',
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
        ] satisfies Token[]);
    });
    test('2sinxcosx', () => {
        expect(tokenize('2sinxcosx')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'sin',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'xcosx', // it must be like that
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('coscoscosx', () => {
        expect(tokenize('coscoscosx')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: 'cos',
            },
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
        ] satisfies Token[]);
    });
    test('-x+y', () => {
        expect(tokenize('-x+y')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
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
                type: TokenType.IDENTIFIER,
                value: 'y',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] as Token[]);
    });
    test('-1-(-1)', () => {
        expect(tokenize('-1-(-1)')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.PAREN_OPEN,
                value: '(',
            },
            {
                type: TokenType.UNARY_OPERATOR,
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
        ] satisfies Token[]);
    });
    test('1 2 3', () => {
        expect(tokenize('1 2 3')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '1',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '3',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    // TODO: fix it later, it would be better to not merge 3 identifiers into one:
    test('a b c + 1', () => {
        expect(tokenize('a b c + 1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'a',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'b',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'c',
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
        ] satisfies Token[]);
    });
    test('-1; -2, -3\n-4;    -5', () => {
        expect(tokenize('-1; -2, -3\n-4;    -5')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
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
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '2',
            },
            {
                type: TokenType.EOL,
                value: ',',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '3',
            },
            {
                type: TokenType.EOL,
                value: '\n',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '4',
            },
            {
                type: TokenType.EOL,
                value: ';',
            },
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '5',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('12.34+45.6711', () => {
        expect(tokenize('12.34+45.6711')).toEqual([
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
                value: '45.6711',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('.4', () => {
        expect(tokenize('.4')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '.4',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('-.4', () => {
        expect(tokenize('-.4')).toEqual([
            {
                type: TokenType.UNARY_OPERATOR,
                value: '-',
            },
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '.4',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('4.a * a.4', () => {
        // seems good, it's similar to "4sinx -> 4.sinx" (4a -> 4.a)
        expect(tokenize('4.a * a.4')).toEqual([
            {
                type: TokenType.NUMERIC_LITERAL,
                value: '4.',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'a',
            },
            {
                type: TokenType.BINARY_OPERATOR,
                value: '*',
            },
            {
                type: TokenType.IDENTIFIER,
                value: 'a.4',
            },
            {
                type: TokenType.EOF,
                value: '',
            },
        ] satisfies Token[]);
    });
    test('k$tty123_@       -1', () => {
        expect(tokenize('k$tty123_@       -1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'k$tty123_@',
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
        ] satisfies Token[]);
    });
    test('k$tty123_@   ;   -1', () => {
        expect(tokenize('k$tty123_@   ;   -1')).toEqual([
            {
                type: TokenType.IDENTIFIER,
                value: 'k$tty123_@',
            },
            {
                type: TokenType.EOL,
                value: ';',
            },
            {
                type: TokenType.UNARY_OPERATOR,
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
        ] satisfies Token[]);
    });
});
