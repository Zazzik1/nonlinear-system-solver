import {
    createVariables,
    evaluate,
    GLOBALS,
    parse,
    tokenize,
    type Token,
} from '@zazzik/nlsolver';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBars, FaGithub, FaNpm } from 'react-icons/fa';
import { DEFAULT_DATA } from './constants';

function App() {
    const [data, setData] = useState(
        localStorage.getItem('data') ?? DEFAULT_DATA,
    );
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [hoveredToken, setHoveredToken] = useState<Token | null>(null);
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

    const handleToggleSettings = useCallback(() => {
        setIsSettingsMenuOpen((old) => !old);
    }, []);
    const handleClear = useCallback(() => {
        setData('');
    }, []);
    const handleSetExampleData = useCallback(() => {
        localStorage.removeItem('data');
        setData(DEFAULT_DATA);
    }, []);
    return (
        <>
            <div className="header-box page-header">
                <div></div>
                <div
                    style={{
                        fontSize: 'var(--font-size-xl)',
                        color: 'var(--color-text)',
                        fontFamily: 'initial',
                    }}
                >
                    nlsolver
                </div>
                <button
                    className="icon-button settings-menu-trigger"
                    onClick={handleToggleSettings}
                >
                    <FaBars size={20} />
                    {isSettingsMenuOpen && (
                        <div className="settings-menu">
                            <button
                                style={{
                                    padding: 'var(--padding) var(--padding-lg)',
                                }}
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                            <button
                                style={{
                                    padding: 'var(--padding) var(--padding-lg)',
                                }}
                                onClick={handleSetExampleData}
                            >
                                Load example
                            </button>
                        </div>
                    )}
                </button>
            </div>
            <div className="spacer"></div>
            <div className="main-container">
                <div className="main">
                    <div style={{ position: 'relative' }}>
                        <textarea
                            rows={Math.max(lines.length, 8)}
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            ref={textAreaRef}
                            placeholder="Enter expression, e.g. 2ln3"
                            style={{
                                zIndex: 1,
                                backgroundColor: 'transparent',
                                position: 'relative',
                                lineHeight: '24px',
                            }}
                        ></textarea>
                        {hoveredToken != null && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `calc(var(--padding-lg) + ${(hoveredToken.column - 1) * 9.6 - 1}px)`,
                                    top: `calc(var(--padding) + ${(hoveredToken.line - 1) * 24 + 1}px)`,
                                    width: `${(hoveredToken.end - hoveredToken.start) * 9.6 + 3}px`,
                                    height: `24px`,
                                    zIndex: 2,
                                    border: '1px solid var(--color-primary)',

                                    fontFamily: 'monospace',
                                }}
                            ></div>
                        )}
                        <div className="results">
                            {lines.map((line, idx) => {
                                if (line === '') {
                                    emptyLines++;
                                    return <div key={idx}>&nbsp;</div>;
                                }
                                const result = (results || []).at(
                                    idx - emptyLines,
                                );
                                if (result == null)
                                    return <div key={idx}>&nbsp;</div>;
                                return <div key={idx}>= {result}</div>;
                            })}
                        </div>
                    </div>
                    {error ? (
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-bg-primary)',
                                padding: 'var(--padding) var(--padding-lg)',
                            }}
                        >
                            {error.toString()}
                        </div>
                    ) : null}
                    <div
                        style={{
                            width: '100%',
                        }}
                    >
                        <div className="header-box">Variables</div>
                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--padding-sm)',
                                flexWrap: 'wrap',
                                padding: 'var(--padding) var(--padding-lg)',
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
                                    <div
                                        key={idx}
                                        className="token"
                                        onMouseEnter={() =>
                                            setHoveredToken(token)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredToken(null)
                                        }
                                    >
                                        <div>{token.type}</div>
                                        <div>
                                            {JSON.stringify(token.value).slice(
                                                1,
                                                -1,
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            style={{
                                borderLeft:
                                    '1px solid var(--color-border-muted)',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <div className="header-box">Parser</div>
                            <pre
                                style={{
                                    padding: 'var(--padding) var(--padding-lg)',
                                    margin: 0,
                                }}
                            >
                                {JSON.stringify(program, null, 2)}
                            </pre>
                        </div>
                    </div>
                    <div className="footer">
                        <div>
                            <button onClick={handleClear}>Clear</button>
                            <button onClick={handleSetExampleData}>
                                Example
                            </button>
                        </div>
                        <div>
                            <span>{__COMMIT_HASH__}</span>
                            <a
                                href="https://www.npmjs.com/package/@zazzik/nlsolver"
                                target="_blank"
                                className="icon-button"
                            >
                                <FaNpm size={22} />
                            </a>
                            <a
                                href="https://github.com/Zazzik1/nonlinear-system-solver"
                                target="_blank"
                                className="icon-button"
                            >
                                <FaGithub size={22} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
