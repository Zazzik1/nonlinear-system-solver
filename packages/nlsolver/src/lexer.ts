export enum TokenType {
    NUMBER_LITERAL,
    UNARY_OPERATOR,
    BINARY_OPERATOR,
    EOL,
    EOF,
    PAREN_OPEN,
    PAREN_CLOSE,
}

type Token = {
    type: TokenType;
    value: string;
    line: number;
    column: number;
};

export function tokenize(data: string): Token[] {
    return []; // TODO
}

export default {};
