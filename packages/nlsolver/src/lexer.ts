export enum TokenType {
    NUMBER_LITERAL = 'NUMBER_LITERAL',
    UNARY_OPERATOR = 'UNARY_OPERATOR',
    BINARY_OPERATOR = 'BINARY_OPERATOR',
    EOL = 'EOL',
    EOF = 'EOF',
    PAREN_OPEN = 'PAREN_OPEN',
    PAREN_CLOSE = 'PAREN_CLOSE',
    IDENTIFIER = 'IDENTIFIER',
}

export type Token = {
    type: TokenType;
    value: string;
    // todo (?): include line and column
};

function isNumber(n?: string): boolean {
    if (n == null) return false;
    return /^[\d.]+$/.test(n);
}

// e.g. variables, constants
function isIdentifier(value: string, next?: string): boolean {
    if (value === ' ') return false;
    // todo: reduce redundancy:
    return (
        !isNumber(value) &&
        (next == null ||
            next === '(' ||
            next === ')' ||
            next === '+' ||
            next === '-' ||
            next === '*' ||
            next === '/' ||
            next === '%' ||
            next === '^')
    );
}

export function tokenize(data: string): Token[] {
    const tokens: Token[] = [];
    let value = '';

    for (let i = 0; i < data.length; i++) {
        let current = data[i];
        let next = data[i + 1];
        value = `${value}${current}`;
        let type: TokenType | null = null;
        switch (current) {
            case ';':
            case ',':
            case '\n':
                type = TokenType.EOL;
                break;
            case '+':
            case '*':
            case '/':
            case '%':
            case '^':
                type = TokenType.BINARY_OPERATOR;
                break;
            case '-':
                const lastTokenType = tokens.at(-1)?.type;
                if (
                    lastTokenType === TokenType.BINARY_OPERATOR ||
                    lastTokenType === TokenType.PAREN_OPEN ||
                    lastTokenType === TokenType.EOL ||
                    tokens.length === 0
                ) {
                    type = TokenType.UNARY_OPERATOR;
                    break;
                } else {
                    type = TokenType.BINARY_OPERATOR;
                    break;
                }
            case '(':
                type = TokenType.PAREN_OPEN;
                break;
            case ')':
                type = TokenType.PAREN_CLOSE;
                break;
            default:
                break;
        }
        if (type == null) {
            switch (value) {
                case 'ln':
                case 'sin':
                case 'cos':
                case 'tan':
                    type = TokenType.UNARY_OPERATOR;
                    break;
                default:
                    break;
            }
        }
        if (type == null) {
            if (isNumber(value) && !isNumber(next) && next !== '.') {
                type = TokenType.NUMBER_LITERAL;
                if ([...value].filter((n) => n === '.').length > 1) {
                    throw new Error(
                        `Invalid numeric literal "${value}" at position ${i - (value.length - 1)}`,
                    );
                }
            } else if (isIdentifier(value, next)) {
                type = TokenType.IDENTIFIER;
            }
        }
        if (current === ' ') {
            value = value.slice(0, -1);
        }
        // console.log('DEBUG', { current, value, type });
        if (!type) continue;

        tokens.push({
            type,
            value,
        } satisfies Token);
        value = '';
    }
    tokens.push({
        type: TokenType.EOF,
        value: '',
    } satisfies Token);
    return tokens;
}

export default {};
