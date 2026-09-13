import { Token, TokenType } from './lexer';

export enum ExprKind {
    UNARY_EXPRESSION = 'UNARY_EXPRESSION',
    BINARY_EXPRESSION = 'BINARY_EXPRESSION',
    NUMERIC_LITERAL = 'NUMERIC_LITERAL',
    IDENTIFIER = 'IDENTIFIER',
}
export type Expression =
    | {
          kind: ExprKind.UNARY_EXPRESSION;
          operator: string;
          argument?: Expression;
      }
    | {
          kind: ExprKind.BINARY_EXPRESSION;
          operator: string;
          left?: Expression;
          right?: Expression;
      }
    | {
          kind: ExprKind.NUMERIC_LITERAL;
          value: number;
      }
    | {
          kind: ExprKind.IDENTIFIER;
          value: string;
      };

function splitTokensByLines(tokens: Token[]): Token[][] {
    const result: Token[][] = [[]];

    let j = 0;
    for (let i = 0; i < tokens.length; i++) {
        result[j].push(tokens[i]);
        if (tokens[i].type === TokenType.EOL) {
            j++;
            result.push([]);
        }
    }

    return result;
}

function parseBinary(tokens: Token[]): Expression | undefined {
    const left = parseUnary(tokens);
    if (!left) return undefined;

    const operatorToken = tokens.at(0);

    if (operatorToken?.type !== TokenType.BINARY_OPERATOR) {
        return left;
    }

    tokens.shift();

    const right = parseBinary(tokens);
    if (!right) return undefined;

    return {
        kind: ExprKind.BINARY_EXPRESSION,
        operator: operatorToken.value,
        left,
        right,
    };
}

// TODO: handle proper order of operations (also handle parens):
// function parseAdditive(tokens: Token[]): Expression | undefined {}
// function parseMultiplicative(tokens: Token[]): Expression | undefined {}
// function parsePower(tokens: Token[]): Expression | undefined {}
// function parseParens(tokens: Token[]): Expression | undefined {}

// TODO: handle implicit multiplication:
// 2x => 2*x        NUMERIC_LITERAL IDENTIFIER -> NUMERIC_LITERAL BINARY_OPERATOR(*) IDENTIFIER
// 2(...REST) -> 2*(...REST),   NUMERIC_LITERAL PAREN_OPEN ...REST -> NUMERIC_LITERAL BINARY_OPERATOR(*) parseParens(...REST)
// x(y) -> x*(y),   IDENTIFIER PAREN_OPEN IDENTIFIER -> NUMERIC_LITERAL BINARY_OPERATOR(*) parseParens(...REST)
// 2lnx -> 2*lnx    NUMERIC_LITERAL UNARY_OPERATOR ...REST -> NUMERIC_LITERAL BINARY_OPERATOR(*) UNARY_OPERATOR ...REST

function parseUnary(tokens: Token[]): Expression | undefined {
    const operatorToken = tokens.at(0);
    if (!operatorToken) return undefined;
    if (operatorToken.type !== TokenType.UNARY_OPERATOR) {
        return parsePrimary(tokens);
    }

    tokens.shift();

    const argument = parseBinary(tokens);
    if (!argument) return undefined;

    return {
        kind: ExprKind.UNARY_EXPRESSION,
        operator: operatorToken.value,
        argument,
    };
}

function parsePrimary(tokens: Token[]): Expression | undefined {
    const token = tokens.shift();
    if (!token) return undefined;

    if (token.type === TokenType.NUMERIC_LITERAL) {
        return {
            kind: ExprKind.NUMERIC_LITERAL,
            value: +token.value,
        };
    }
    if (token.type === TokenType.IDENTIFIER) {
        return {
            kind: ExprKind.IDENTIFIER,
            value: token.value,
        };
    }
}

function parseExpr(tokens: Token[]): Expression | undefined {
    return parseBinary(tokens);
}

export function parse(tokens: Token[]): Expression[] {
    const expressions: Expression[] = [];

    for (const sp of splitTokensByLines(tokens)) {
        const expr = parseExpr(sp);
        if (expr) expressions.push(expr);
    }

    return expressions;
}
