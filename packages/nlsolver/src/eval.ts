import { Expression, ExprKind } from './parser';

export function evalExpression(
    expr: Expression,
    variables: Record<string, number>,
): number | undefined {
    if (expr.kind === ExprKind.NUMERIC_LITERAL) return expr.value;
    if (expr.kind === ExprKind.IDENTIFIER) {
        if (variables[expr.value] == null)
            throw new Error(`Variable "${expr.value}" is not defined`);
        return variables[expr.value];
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
            case 'ln':
                return Math.log(argument);
            case 'sin':
                return Math.sin(argument);
            case 'cos':
                return Math.cos(argument);
            case 'tan':
                return Math.tan(argument);
        }
    }
    return undefined;
}

export function evaluate(
    expressions: Expression[],
    variables: Record<string, number>,
): (number | undefined)[] {
    const results: (number | undefined)[] = [];

    for (const expression of expressions) {
        results.push(evalExpression(expression, variables));
    }

    return results;
}
