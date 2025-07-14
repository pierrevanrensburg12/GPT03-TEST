#!/usr/bin/env bash
set -euo pipefail

# Initialize root package
pnpm init -y

# Setup pnpm workspace configuration
cat <<'YAML' > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
YAML

# Ensure package.json marked private and add dev script
node - <<'NODE'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.private = true;
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = 'pnpm --parallel --filter "./apps/**" dev';
pkg.scripts.lint = 'eslint "**/*.{js,ts,tsx}"';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
NODE

mkdir -p apps packages

# Create web app with Next.js and TypeScript
pnpm create next-app apps/web -- --ts --eslint --tailwind --use-pnpm

# Create API app with Fastify
mkdir -p apps/api
cd apps/api
pnpm init -y
pnpm add fastify
pnpm add -D typescript ts-node @types/node
cat <<'JSON' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
JSON
mkdir -p src
cat <<'TS' > src/index.ts
import Fastify from 'fastify';
const app = Fastify();
app.get('/', async () => ({ hello: 'world' }));
app.listen({ port: 3001 }, err => {
  if (err) throw err;
  console.log('API listening on http://localhost:3001');
});
TS
sed -i '/"dependencies": {/a "fastify": "^4"' package.json
sed -i '/"scripts": {/a \    "dev": "ts-node src/index.ts"' package.json
pnpm install
cd ../..

# Create shared UI package
mkdir -p packages/ui
cd packages/ui
pnpm init -y
pnpm add react react-dom
pnpm add -D tailwindcss postcss autoprefixer shadcn-ui lucide-react typescript @types/react @types/react-dom
npx tailwindcss init
cat <<'JSON' > tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react",
    "declaration": true,
    "outDir": "dist",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src"]
}
JSON
mkdir -p src
cat <<'TSX' > src/index.tsx
export const Placeholder = () => <div className="text-primary">UI Component</div>;
TSX
cat <<'JS' > tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
JS
cat <<'JS' > postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
JS
cd ../..

# Install ESLint, Prettier, and Husky at root
pnpm add -D eslint prettier husky
pnpm exec husky install
pnpm exec husky add .husky/pre-commit "pnpm lint"

cat <<'JSON' > .eslintrc.json
{
  "extends": ["next", "prettier"],
  "root": true
}
JSON

cat <<'JSON' > .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all"
}
JSON

cat <<'EOF_MSG'

Setup complete! Run the following commands to get started:

pnpm install
pnpm dev

EOF_MSG
EOF
