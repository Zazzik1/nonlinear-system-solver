import { Variables } from './eval';
import { tokenize } from './lexer';
import { Expression, parseExpr } from './parser';

export const GLOBALS = {
    PI: Math.PI,
    e: Math.E,
    PHI: parseExpr(tokenize('(1 + (5^(1/2))) / 2')),
} as const satisfies Variables;
