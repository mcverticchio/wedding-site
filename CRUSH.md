# CRUSH.md

Build/lint/dev
- Dev: npm run dev
- Build: npm run build (Next build + static export)
- Start: npm run start (serve .next)
- Lint: npm run lint
- Typecheck: npx tsc --noEmit
- Test: none configured; add vitest/jest if needed. For single-test runs, decide on framework and add scripts here.

Testing (recommendation)
- Install: npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
- Scripts: "test": "vitest", "test:watch": "vitest --watch", "test:file": "vitest run --dir . --reporter verbose"
- Single test: npx vitest run path/to/file.test.tsx -t "test name"

Imports & modules
- Use path aliases per tsconfig: @/components/*, @/lib/*, @/hooks/*
- Prefer named exports over default; group React imports from 'react'
- Next 14 App Router; use server/components conventions ("use client" only when needed)

Formatting
- Prettier enforced via .prettierrc: semi: true, singleQuote: true, trailingComma: all, printWidth: 100
- Keep files formatted; run npx prettier -w . before commits

Types & strictness
- TypeScript strict true; no implicit any
- Prefer explicit return types for exported functions/components
- Use zod for runtime validation where applicable (already a dep)

Naming & structure
- PascalCase for components, camelCase for vars/functions, UPPER_SNAKE for consts
- Files: ComponentName.tsx; colocate styles; keep server actions in app/server-actions

Error handling
- Never swallow errors; surface via Result types or typed errors
- For server actions, validate input with zod; log minimal context, no secrets

Accessibility & UI
- Follow Next core-web-vitals ESLint; <img> rule disabled, prefer Next/Image where possible
- Ensure alt text, roles, keyboard nav; see docs/ACCESSIBILITY_CHECKLIST.md

Performance
- Use dynamic import for heavy client components; memoize where needed

Security & secrets
- Do not commit .env*; use process.env via Next runtime only on server; never log secrets

Notes
- No Cursor/Copilot rules found
- Add common commands here as they evolve