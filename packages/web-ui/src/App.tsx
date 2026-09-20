import {
    createVariables,
    evaluate,
    GLOBALS,
    parse,
    tokenize,
} from '@zazzik/nlsolver';
import { useRef, useState } from 'react';

const DEFAULT_DATA = `meow = 3ln2
x=meow # this is a comment
sinx/x
y = 2PHI - sqrt(5)
y`;

function App() {
    const [data, setData] = useState(DEFAULT_DATA);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    let error: unknown = null;
    let tokens;
    let program;
    let results;
    const variables = createVariables(GLOBALS);
    try {
        tokens = tokenize(data);
        program = parse(tokens);
        results = evaluate(program, variables);
    } catch (err) {
        error = err;
        console.warn(err);
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                minHeight: '100vh',
            }}
        >
            <textarea
                rows={12}
                value={data}
                onChange={(e) => setData(e.target.value)}
                ref={textAreaRef}
            >
                asd
            </textarea>
            {error ? (
                <div
                    style={{
                        width: '100%',
                        borderTop: '1px solid var(--color-accent)',
                        padding: '8px',
                        boxSizing: 'border-box',
                    }}
                >
                    {error.toString()}
                </div>
            ) : (
                <>
                    <div
                        style={{
                            width: '100%',
                            borderTop: '1px solid var(--color-accent)',
                            boxSizing: 'border-box',
                            padding: '16px 8px',
                        }}
                    >
                        <span
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 'bold',
                            }}
                        >
                            -- Variables --
                        </span>
                        <br />
                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {[...variables.keys()].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => {
                                        setData((old) =>
                                            old === ''
                                                ? v
                                                : old.at(-1) === '\n'
                                                  ? `${old}${v}`
                                                  : `${old}\n${v}`,
                                        );
                                        textAreaRef.current?.focus();
                                    }}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <br />
                        <span
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 'bold',
                            }}
                        >
                            -- Results --
                        </span>
                        <br />
                        {JSON.stringify(results, null, 2)}
                    </div>
                    <div
                        style={{
                            borderTop: '1px solid var(--color-accent)',
                            display: 'flex',
                            width: '100%',
                            flexGrow: 1,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',

                                boxSizing: 'border-box',
                                padding: '16px 8px',
                            }}
                        >
                            <span
                                style={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 'bold',
                                }}
                            >
                                -- Lexer --
                            </span>
                            <pre>
                                <pre>{JSON.stringify(tokens, null, 2)}</pre>
                            </pre>
                        </div>
                        <div
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderLeft: '1px solid var(--color-secondary)',
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '16px 8px',
                            }}
                        >
                            <span
                                style={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 'bold',
                                }}
                            >
                                -- Parser --
                            </span>
                            <pre>{JSON.stringify(program, null, 2)}</pre>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
