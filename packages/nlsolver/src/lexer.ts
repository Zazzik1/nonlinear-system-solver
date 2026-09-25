export enum TokenType {
    NUMERIC_LITERAL = 'NUMERIC_LITERAL',
    UNARY_OPERATOR = 'UNARY_OPERATOR',
    BINARY_OPERATOR = 'BINARY_OPERATOR',
    EOL = 'EOL',
    EOF = 'EOF',
    PAREN_OPEN = 'PAREN_OPEN',
    PAREN_CLOSE = 'PAREN_CLOSE',
    IDENTIFIER = 'IDENTIFIER',
    ASSIGN_OP = 'ASSIGN_OP',
    COMMENT = 'COMMENT',
}

export type Token = {
    type: TokenType;
    value: string;

    // 0-based
    start: number;
    end: number;

    // 1-based
    line: number;
    column: number;
};

function isNumber(n?: string): boolean {
    if (n == null) return false;
    return /^[\d.]+$/.test(n);
}

// e.g. variables, constants
function isIdentifier(value: string, next?: string): boolean {
    if (value.includes(' ')) return false;
    if (isNumber(value)) return false;
    // todo: reduce redundancy:
    return (
        next == null ||
        next === '(' ||
        next === ')' ||
        next === '+' ||
        next === '-' ||
        next === '*' ||
        next === '/' ||
        next === '%' ||
        next === '^' ||
        next === ' ' ||
        next === '\n' ||
        next === ';' ||
        next === ',' ||
        next === '=' ||
        next === '#'
    );
}

export function tokenize(data: string): Token[] {
    const tokens: Token[] = [];
    let value = '';
    let end = 0;
    let line = 1;
    let column = 0;
    let incrementLine = false;

    for (let i = 0; i < data.length; i++) {
        end = i;
        column++;
        let current = data[i];
        let next = data[i + 1];
        value = `${value}${current}`;
        let type: TokenType | null = null;
        switch (current) {
            case '=':
                type = TokenType.ASSIGN_OP;
                break;
            case ';':
            case ',':
            case '\n':
                type = TokenType.EOL;
                if (current === '\n') {
                    incrementLine = true;
                }
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
                    lastTokenType === TokenType.ASSIGN_OP ||
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
            case '#':
                value = '';
                let j = 0;
                for (; i < data.length; i++) {
                    current = data[i];
                    j++;
                    if (
                        current === ';' ||
                        current === ',' ||
                        current === '\n'
                    ) {
                        i--;
                        break;
                    } else if (j > 1) {
                        value = `${value}${current}`;
                        column++;
                    }
                }
                end = i - 1;
                column--;
                type = TokenType.COMMENT;
            default:
                break;
        }
        if (type == null) {
            switch (value) {
                case 'ln':
                case 'asin':
                case 'acos':
                case 'atan':
                case 'sin':
                case 'cos':
                case 'tan':
                case 'sqrt':
                case 'sign':
                    type = TokenType.UNARY_OPERATOR;
                    break;
                default:
                    break;
            }
        }
        if (type == null) {
            if (
                isNumber(value) &&
                !isNumber(`${value}${next}`) &&
                next !== '.'
            ) {
                type = TokenType.NUMERIC_LITERAL;
                if ([...value].filter((n) => n === '.').length > 1) {
                    throw new Error(
                        `Invalid numeric literal "${value}" at position ${i - (value.length - 1)}`,
                    );
                }
            } else if (isIdentifier(value, next)) {
                type = TokenType.IDENTIFIER;
            }
        } else {
            end = i;
        }
        if (current === ' ') {
            value = value.slice(0, -1);
        }
        if (!type) continue;

        let start = end - value.length + 1;
        if (type === TokenType.COMMENT) {
            const commentEnd = i >= data.length ? i : i + 1;

            start = commentEnd - value.length - 1;
            end = commentEnd - 1;
        }
        tokens.push({
            type,
            value,
            start,
            end: end + 1,
            line,
            column: column - value.length + 1,
        } satisfies Token);
        value = '';
        if (incrementLine) {
            line++;
            column = 0;
            incrementLine = false;
        }
        if (type === TokenType.EOL && value === '\n') {
            column = 0;
        }
        if (type === TokenType.COMMENT) {
            column++;
        }
    }
    const prevToken = tokens.at(-1);
    tokens.push({
        type: TokenType.EOF,
        value: '',
        start: end + 1,
        end: end + 1,
        line,
        column:
            prevToken?.type === TokenType.EOL && prevToken?.value === '\n'
                ? 1
                : column + 1,
    } satisfies Token);
    return tokens;
}

export default {};
