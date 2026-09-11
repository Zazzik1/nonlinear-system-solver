import readline from 'readline';
import { tokenize } from './lexer';

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
        const tokens = tokenize(input);
        console.log(tokens);
    }
}

main();
