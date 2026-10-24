import { Variable } from './eval';
import { tokenize } from './lexer';
import { parseExpr } from './parser';

export const GLOBALS = {
    PI: {
        value: Math.PI,
        constant: true,
    },
    e: {
        value: Math.E,
        constant: true,
    },
    PHI: {
        value:
            parseExpr(tokenize('(1 + (5^(1/2))) / 2')) ||
            (1 + Math.pow(5, 1 / 2)) / 2,
        constant: true,
    },
} as const satisfies Record<string, Variable>;
