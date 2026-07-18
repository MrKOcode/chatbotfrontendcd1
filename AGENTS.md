# Frontend Repository Instructions

## Purpose

This file defines durable working rules for Codex and other automated coding agents in this repository. The project documentation under `docs/` provides supporting context.

## Collaboration Rules

- Implement deployment, GitHub Actions, AWS, and infrastructure work directly when it is within the user's requested scope.
- Explain important outcomes, risks, configuration requirements, and blockers without requiring a step-by-step teaching workflow.
- CI/CD workflows may be created or modified as part of approved deployment and delivery work.
- Do not deploy, merge, push, or change external cloud resources without explicit user authorization.
- Prefer small, reviewable changes and report assumptions clearly.

## Git Workflow

- `main` is the protected production branch.
- Do not commit or push application changes directly to `main`.
- Use `aichatbotbranch2` as the integration branch.
- Normal flow: feature branch -> pull request into `aichatbotbranch2` -> validation -> pull request into `main`.
- Production deployment must occur only from an approved merge into `main`.
- Never force-push or rewrite shared history unless the user explicitly requests it and understands the impact.
- Preserve unrelated user changes in the working tree.

## Project Layout

- The deployable application is under `frontend/`.
- Run Node.js commands from `frontend/`, not the repository root.
- Vite production output is generated in `frontend/dist/`.
- Local project guidance is stored under `docs/` and is intentionally excluded from Git in this clone.

## Required Validation

For application changes, run the relevant checks from `frontend/`:

```powershell
npm ci
npm run type-check
npm run lint
npm test
npm run build
```

- Use `npm ci` in CI and when validating the lockfile exactly.
- If a check cannot run or fails for a pre-existing reason, report that clearly; do not hide or bypass it.
- Do not weaken tests, linting, or type checking merely to make a pipeline pass.

## Security and Configuration

- Never commit AWS access keys, passwords, tokens, `.env` files, or other secrets.
- Prefer GitHub Actions OIDC for AWS authentication; do not store long-lived AWS credentials in GitHub.
- Treat every `VITE_*` value as public because Vite embeds it in browser assets.
- `VITE_API_BASE_URL` must contain only the public backend base URL.
- Do not log bearer tokens, authentication responses, or sensitive user content.
- Prefer a private S3 bucket accessed through CloudFront Origin Access Control over public S3 object access.

## Architecture and Deployment

- Read `docs/ARCHITECTURE.md` before making architectural changes.
- Read `docs/DEPLOYMENT.md` before changing AWS or GitHub Actions deployment behavior.
- Read `docs/BACKEND_INTEGRATION.md` and `docs/API_GUIDE.md` before changing API calls or authentication.
- Update the relevant local document when an approved architectural or deployment decision changes.

## Review Expectations

- Use `docs/REVIEW_CHECKLIST.md` for pull-request reviews.
- Keep changes scoped to the requested task.
- Call out security, authentication, CORS, caching, routing, and rollback implications when relevant.
