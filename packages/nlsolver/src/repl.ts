import readline from 'readline';
import { tokenize } from './lexer';
import { parse } from './parser';
import { evaluate } from './eval';
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
    while (true) {
        const input = await prompt('> ');
        try {
            const tokens = tokenize(input);
            console.log('-- Lexer --');
            console.log(tokens);
            console.log('-- Parser --');
            const program = parse(tokens);
            console.log(JSON.stringify(program, null, 2));
            console.log('-- Eval --');
            console.log(evaluate(program, GLOBALS));
        } catch (error) {
            console.error(error);
        }
    }
}

main();
