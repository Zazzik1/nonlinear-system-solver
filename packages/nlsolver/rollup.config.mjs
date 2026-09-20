import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const plugins = [
    resolve(),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
    }),
];

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'es',
                sourcemap: true,
            },
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins,
    },

    {
        input: 'src/repl.ts',
        output: {
            file: 'dist/repl.js',
            format: 'es',
            banner: '#!/usr/bin/env node',
            sourcemap: true,
        },
        plugins: [...plugins, json(), terser()],
    },
];
