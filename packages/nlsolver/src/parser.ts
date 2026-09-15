import { Token, TokenType } from './lexer';

export enum ExprKind {
    EQUATION = 'EQUATION',
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

export type Equation = {
    kind: ExprKind.EQUATION;
    left?: Expression;
    right?: Expression;
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

    let operatorToken = tokens.at(0);

    if (operatorToken?.type === TokenType.NUMERIC_LITERAL) {
        throw new Error(`Unexpected token "${operatorToken.value}"`);
    }

    const isImplicitMultiplication =
        operatorToken?.type === TokenType.IDENTIFIER || // 2 x
        operatorToken?.type === TokenType.UNARY_OPERATOR || // 2 ln x
        operatorToken?.type === TokenType.PAREN_OPEN; // 2 (x)

    if (operatorToken?.type !== TokenType.BINARY_OPERATOR) {
        if (isImplicitMultiplication) {
            operatorToken = {
                type: TokenType.BINARY_OPERATOR,
                value: '*',
            };
        } else {
            return left;
        }
    }

    if (!isImplicitMultiplication) tokens.shift();

    const right = parseBinary(tokens);
    if (!right) return undefined;

    return {
        kind: ExprKind.BINARY_EXPRESSION,
        operator: operatorToken.value,
        left,
        right,
    };
}

// TODO: handle proper order of operations:
// function parseAdditive(tokens: Token[]): Expression | undefined {}
// function parseMultiplicative(tokens: Token[]): Expression | undefined {}
// function parsePower(tokens: Token[]): Expression | undefined {}

// TODO: add option to declare variables when the second token in a line is "=", e.g. x=2, y=ln3, z=sinx

function parseUnary(tokens: Token[]): Expression | undefined {
    const operatorToken = tokens.at(0);
    if (!operatorToken) return undefined;
    if (operatorToken.type !== TokenType.UNARY_OPERATOR) {
        return parsePrimary(tokens);
    }

    tokens.shift();

    const argument = parseUnary(tokens);
    if (!argument) return undefined;

    return {
        kind: ExprKind.UNARY_EXPRESSION,
        operator: operatorToken.value,
        argument,
    };
}

function parsePrimary(tokens: Token[]): Expression | undefined {
    let token = tokens.shift();
    if (!token) return undefined;
    if (token.type === TokenType.PAREN_OPEN) {
        const contents = parseBinary(tokens);
        const parenCloseToken = tokens.shift();
        if (parenCloseToken?.type !== TokenType.PAREN_CLOSE) {
            throw new Error('Missing token: )');
        }
        return contents;
    }
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

export function parseExpr(tokens: Token[]): Expression | undefined {
    return parseBinary(tokens);
}

export function parseEquation(
    tokens: Token[],
): Expression | Equation | undefined {
    const eqToken = tokens.find((t) => t.type === TokenType.ASSIGN_OP);
    if (!eqToken) return parseExpr(tokens);

    const eqTokenIdx = tokens.indexOf(eqToken);
    const left = parseBinary(tokens.slice(0, eqTokenIdx));
    const right = parseBinary(tokens.slice(eqTokenIdx + 1, -1));
    if (!left || !right) return;
    return {
        kind: ExprKind.EQUATION,
        left,
        right,
    };
}

export function parse(tokens: Token[]): (Expression | Equation)[] {
    const results: (Expression | Equation)[] = [];

    for (const sp of splitTokensByLines(tokens)) {
        const expr = parseEquation(sp);
        if (expr) results.push(expr);
    }

    return results;
}
