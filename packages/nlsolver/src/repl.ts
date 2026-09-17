#!/usr/bin/env node
import readline from 'readline';
import { tokenize } from './lexer';
import { parse } from './parser';
import { createVariables, evaluate } from './eval';
import { GLOBALS } from './constants';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const prompt = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

async function main() {
    console.log('REPL');
    const variables = createVariables(GLOBALS);
    while (true) {
        const input = await prompt('> ');
        try {
            const tokens = tokenize(input);
            console.log('-- Lexer --');
            console.log(tokens);
            console.log('-- Parser --');
            const program = parse(tokens);
            console.log(JSON.stringify(program, null, 2));
            const evalResults = evaluate(program, variables);
            console.log('-- Variables --');
            console.log([...variables.keys()]);
            console.log('-- Eval --');
            console.log(evalResults);
        } catch (error) {
            console.error(error);
        }
    }
}

main();
