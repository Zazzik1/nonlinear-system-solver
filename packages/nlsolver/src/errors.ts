export type EvaluationErrorCode =
    'UNDEFINED_VARIABLE' | 'UNKNOWN_OPERATOR' | 'EXPECTED_EXPRESSION';
export class EvaluationError extends Error {
    code: EvaluationErrorCode;
    // line: number;
    // column: number;
    constructor(
        message: string,
        {
            code,
            // line,
            // column,
        }: {
            code: EvaluationErrorCode;
            // line: number;
            // column: number
        },
    ) {
        super(message);
        this.name = 'EvaluationError';
        this.code = code;
        // this.line = line;
        // this.column = column;
    }
}

export type ParseErrorCode =
    | 'MISSING_LEFT_HAND_SIDE'
    | 'MISSING_RIGHT_HAND_SIDE'
    | 'UNEXPECTED_TOKEN'
    | 'EXPECTED_CLOSING_PAREN';
export class ParseError extends Error {
    code: ParseErrorCode;
    line: number;
    column: number;
    constructor(
        message: string,
        {
            code,
            line,
            column,
        }: { code: ParseErrorCode; line: number; column: number },
    ) {
        super(message);
        this.name = 'ParseError';
        this.code = code;
        this.line = line;
        this.column = column;
    }
}
