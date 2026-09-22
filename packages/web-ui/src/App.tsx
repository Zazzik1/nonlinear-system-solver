import {
    createVariables,
    evaluate,
    GLOBALS,
    parse,
    tokenize,
} from '@zazzik/nlsolver';
import { useEffect, useRef, useState } from 'react';
import { FaGithub, FaNpm } from 'react-icons/fa';
import { DEFAULT_DATA } from './constants';

function App() {
    const [data, setData] = useState(
        localStorage.getItem('data') ?? DEFAULT_DATA,
    );
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const lines = data.split('\n');
    let emptyLines = 0;
    let error: unknown = null;
    let tokens;
    let program;
    let results: ReturnType<typeof evaluate> | null = null;
    const variables = createVariables(GLOBALS);
    try {
        tokens = tokenize(data);
        program = parse(tokens);
        results = evaluate(program, variables);
    } catch (err) {
        error = err;
        console.warn(err);
    }
    useEffect(() => {
        setTimeout(() => {
            const el = textAreaRef.current;
            if (el) {
                el.focus();
                const length = el.value.length;
                el.setSelectionRange(length, length);
            }
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('data', data);
    }, [data]);
    return (
        <div className="main">
            <textarea
                rows={Math.max(lines.length, 8)}
                value={data}
                onChange={(e) => setData(e.target.value)}
                ref={textAreaRef}
                placeholder="Enter expression, e.g. 2ln3"
                style={{ zIndex: 1, backgroundColor: 'transparent' }}
            >
                asd
            </textarea>
            <div className="results">
                {lines.map((line, idx) => {
                    if (line === '') {
                        emptyLines++;
                        return <div key={idx}>&nbsp;</div>;
                    }
                    const result = (results || []).at(idx - emptyLines);
                    if (result == null) return <div key={idx}>&nbsp;</div>;
                    return <div key={idx}>= {result}</div>;
                })}
            </div>
            {error ? (
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-bg-primary)',
                        padding: 'var(--padding)',
                    }}
                >
                    {error.toString()}
                </div>
            ) : null}
            <div
                style={{
                    width: '100%',
                    borderTop: '1px solid var(--color-border-muted)',
                    borderBottom: '1px solid var(--color-border-muted)',
                }}
            >
                <div className="header-box">Variables</div>
                <div
                    style={{
                        display: 'flex',
                        gap: 'var(--padding-sm)',
                        flexWrap: 'wrap',
                        padding: 'var(--padding)',
                        overflowX: 'hidden',
                    }}
                >
                    {[...variables.keys()].map((v) => (
                        <button
                            key={v}
                            onClick={() => {
                                setData((old) =>
                                    old === '' ? v : `${old}${v}`,
                                );
                                textAreaRef.current?.focus();
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexGrow: 1,
                }}
            >
                <div
                    style={{
                        minWidth: '30ch',
                        width: 'max-content',
                        flexGrow: 1,
                    }}
                >
                    <div className="header-box">Lexer</div>
                    <div className="tokens">
                        {(tokens || []).map((token, idx) => (
                            <div key={idx} className="token">
                                <div>{token.type}</div>
                                <div>
                                    {JSON.stringify(token.value).slice(1, -1)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    style={{
                        borderLeft: '1px solid var(--color-border-muted)',
                        flexGrow: 1,
                        overflow: 'hidden',
                    }}
                >
                    <div className="header-box">Parser</div>
                    <pre
                        style={{
                            padding: 'var(--padding)',
                            margin: 0,
                        }}
                    >
                        {JSON.stringify(program, null, 2)}
                    </pre>
                </div>
            </div>
            <div className="footer">
                <div>
                    <button
                        onClick={() => {
                            setData('');
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('data');
                            setData(DEFAULT_DATA);
                        }}
                    >
                        Example
                    </button>
                </div>
                <div>
                    <span>{__COMMIT_HASH__}</span>
                    <a
                        href="https://www.npmjs.com/package/@zazzik/nlsolver"
                        target="_blank"
                        style={{
                            transform: 'translateY(2px)',
                        }}
                    >
                        <FaNpm size={22} />
                    </a>
                    <a
                        href="https://github.com/Zazzik1/nonlinear-system-solver"
                        target="_blank"
                        style={{
                            transform: 'translateY(2px)',
                        }}
                    >
                        <FaGithub size={22} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
