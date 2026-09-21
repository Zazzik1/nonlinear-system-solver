import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

import { execSync } from 'node:child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// https://vite.dev/config/
export default defineConfig({
    base: '/nonlinear-system-solver/',
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    define: {
        __COMMIT_HASH__: JSON.stringify(commitHash),
    },
});
