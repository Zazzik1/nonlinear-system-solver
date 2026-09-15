import { TokenType } from './lexer';
import { Equation, Expression, ExprKind } from './parser';

export type Variable = number | Expression | undefined;
export type Variables = Map<string, Variable>;

export function createVariables(
    variables?: Record<string, Variable>,
): Variables {
    if (!variables) return new Map();
    return new Map(Object.entries(variables));
}

export function evalExpression(
    expr: Expression,
    variables: Variables = new Map(),
): number | undefined {
    if (expr.kind === ExprKind.NUMERIC_LITERAL) return expr.value;
    if (expr.kind === ExprKind.IDENTIFIER) {
        const variable = variables.get(expr.value);
        if (variable == null) {
            throw new Error(`Variable "${expr.value}" is not defined`);
        }
        if (typeof variable === 'number') return variable;
        return evalExpression(variable, variables);
    }
    if (expr.kind === ExprKind.BINARY_EXPRESSION) {
        if (expr.left == null || expr.right == null) {
            throw new Error('Eval error');
        }
        const a = evalExpression(expr.left, variables);
        const b = evalExpression(expr.right, variables);
        if (a == null || b == null) throw new Error('Eval error');
        switch (expr.operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            case '^':
                return Math.pow(a, b);
            case '%':
                return a % b;
            default:
                throw new Error(
                    `eval error: unknown operator "${expr.operator}"`,
                );
        }
    }
    if (expr.kind === ExprKind.UNARY_EXPRESSION) {
        if (expr.argument == null) throw new Error(`Eval error`);
        const argument = evalExpression(expr.argument, variables);
        if (argument == null) throw new Error('Eval error');
        switch (expr.operator) {
            case '-':
                return -argument;
            case 'ln':
                return Math.log(argument);
            case 'asin':
                return Math.asin(argument);
            case 'acos':
                return Math.acos(argument);
            case 'atan':
                return Math.atan(argument);
            case 'sin':
                return Math.sin(argument);
            case 'cos':
                return Math.cos(argument);
            case 'tan':
                return Math.tan(argument);
            case 'sqrt':
                return Math.sqrt(argument);
            case 'sign':
                return Math.sign(argument);
            default:
                throw new Error(
                    `eval error: unknown operator "${expr.operator}"`,
                );
        }
    }
    return undefined;
}

// TODO
// e.g. pV=nRT -> solve for V -> V=nRT/p -> returns { left: Identifier V, right: Expression nRT/p }
// exact interface still TBD
function solve(equation: Equation, solveFor?: string): Equation {
    throw new Error(
        'not implemented yet, only direct assignment is supported, e.g. x=ln2',
    );
}

function evalEquation(
    equation: Equation,
    variables: Variables = new Map(),
): number | undefined {
    const { left, right } = equation;
    if (!left || !right) return;

    if (left.kind === ExprKind.IDENTIFIER) {
        variables.set(left.value, right);
        return;
    }

    const result = solve(equation);
    return evalEquation(result, variables);
}

export function evaluate(
    program: (Expression | Equation)[],
    variables: Variables = new Map(),
): (number | undefined)[] {
    const results: (number | undefined)[] = [];

    for (const row of program) {
        if (row.kind === ExprKind.EQUATION) {
            results.push(evalEquation(row, variables));
        } else {
            results.push(evalExpression(row, variables));
        }
    }

    return results;
}
