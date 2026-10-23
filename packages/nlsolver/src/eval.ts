import { EvaluationError } from './errors';
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
            throw new EvaluationError(
                `Variable "${expr.value}" is not defined`,
                {
                    code: 'UNDEFINED_VARIABLE',
                    // TODO: store this information during parsing or store references to related tokens:
                    // line: 0,
                    // column: 0,
                },
            );
        }
        if (typeof variable === 'number') return variable;
        return evalExpression(variable, variables);
    }
    if (expr.kind === ExprKind.BINARY_EXPRESSION) {
        if (expr.left == null || expr.right == null) {
            throw new EvaluationError('Expected an expression', {
                code: 'EXPECTED_EXPRESSION',
            });
        }
        const a = evalExpression(expr.left, variables);
        const b = evalExpression(expr.right, variables);
        if (a == null || b == null) {
            throw new EvaluationError('Expected an expression', {
                code: 'EXPECTED_EXPRESSION',
            });
        }
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
                throw new EvaluationError(
                    `Unknown operator '${expr.operator}'`,
                    {
                        code: 'UNKNOWN_OPERATOR',
                    },
                );
        }
    }
    if (expr.kind === ExprKind.UNARY_EXPRESSION) {
        if (expr.argument == null) {
            throw new EvaluationError('Expected an expression', {
                code: 'EXPECTED_EXPRESSION',
            });
        }
        const argument = evalExpression(expr.argument, variables);
        if (argument == null) {
            throw new EvaluationError('Expected an expression', {
                code: 'EXPECTED_EXPRESSION',
            });
        }
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
                throw new EvaluationError(
                    `Unknown operator '${expr.operator}'`,
                    { code: 'UNKNOWN_OPERATOR' },
                );
        }
    }
    return undefined;
}

// TODO
// e.g. pV=nRT -> solve for V -> V=nRT/p -> returns { left: Identifier V, right: Expression nRT/p }
// exact interface still TBD
// it can take variables as parameter and detect what variable is not defined and solve for this variable (if only 1 is missing), otherwise return undefined
function solve(equation: Equation, solveFor?: string): Equation {
    throw new Error(
        'not implemented yet, only direct assignment is supported, e.g. x=ln2',
    );
}

/**
 * Calculates the derivative of an expression at a given point
 * @param expression - the expression to differentiate
 * @param variable - the variable to differentiate with respect to
 * @param point - the point at which to calculate the derivative
 * @param variables - a map of all varaibles defined in the environment
 */
export function calculateDerivative(
    expression: Expression,
    variable: string,
    point: number,
    variables: Variables = new Map(),
    { dx }: { dx: number } = { dx: 0.000001 },
) {
    const x1 = point;
    const x2 = point + dx;

    const variablesAtX1 = new Map(variables);
    variablesAtX1.set(variable, x1);
    const variablesAtX2 = new Map(variables);
    variablesAtX2.set(variable, x2);

    const y1 = evalExpression(expression, variablesAtX1);
    const y2 = evalExpression(expression, variablesAtX2);

    if (y1 == null || y2 == null) {
        throw new Error('failed to calculate derivative');
    }

    const dy = y2 - y1;

    return dy / dx;
}

/**
 * Returns names of variables referenced in expression or equation
 * without expanding their definitions.
 * @param expression - the expression or equation to extract variable names from
 */
export function getVariableNames(expression: Expression | Equation): string[] {
    switch (expression.kind) {
        case ExprKind.IDENTIFIER:
            return [expression.value]; // do not expand the value based on `variables` map!
        case ExprKind.UNARY_EXPRESSION:
            if (expression.argument == null) {
                return [];
            }
            return getVariableNames(expression.argument);
        case ExprKind.BINARY_EXPRESSION:
        case ExprKind.EQUATION:
            if (expression.left != null && expression.right != null) {
                return [
                    ...new Set([
                        ...getVariableNames(expression.left),
                        ...getVariableNames(expression.right),
                    ]),
                ];
            } else if (expression.left != null && expression.right == null) {
                return getVariableNames(expression.left);
            } else if (expression.left == null && expression.right != null) {
                return getVariableNames(expression.right);
            }
        case ExprKind.NUMERIC_LITERAL:
            return [];
        default:
            throw new Error('Unexpected expression kind');
    }
}

/**
 * Returns the names of all variables referenced in a group of expressions and equations.
 * @param program - the array of expressions and equations to extract variable names from
 */
export function getVariableNamesInAGroup(
    program: (Expression | Equation)[],
): string[] {
    const names: string[] = [];
    for (const row of program) {
        names.push(...getVariableNames(row));
    }
    return [...new Set(names)];
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
