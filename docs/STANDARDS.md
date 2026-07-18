# Frontend Engineering Standards

## Scope

These standards apply to the deployable application under `frontend/`. They should evolve through reviewed decisions rather than becoming an obstacle to urgent, safe fixes.

## TypeScript and React

- Prefer TypeScript for new application code.
- Use explicit domain types at API and state boundaries.
- Avoid `any`; when unavoidable, explain and isolate it.
- Use functional React components and hooks.
- Keep side effects out of render logic.
- Keep components focused; extract reusable behavior only when it improves clarity.
- Preserve React strict-mode compatibility.

## Naming and Organization

- Use descriptive names that reflect business meaning.
- Keep API transport types separate from UI state types.
- Keep shared UI primitives separate from feature-specific components.
- Follow existing path aliases such as `@`, `@src`, and `@test` consistently.
- Avoid duplicate entry points or duplicate implementations unless a migration explicitly requires them.

## State and API Calls

- Keep server calls in the API/data layer rather than scattering them across presentation components.
- Represent loading, success, empty, and failure states explicitly.
- Validate response assumptions at the boundary when practical.
- Do not log tokens or sensitive message content.
- Provide useful user-facing error states instead of relying only on console messages.

## Authentication and Security

- Send authentication only over HTTPS.
- Never embed client secrets or AWS credentials in the bundle.
- Treat `VITE_*` values as public.
- Review the risk before storing authentication tokens in `localStorage`.
- Avoid rendering untrusted HTML. Markdown rendering must remain configured to prevent unsafe HTML execution.
- Keep dependencies current through reviewed, tested updates.

## Formatting and Linting

- Follow the repository ESLint configuration.
- Do not disable rules broadly to avoid fixing a local problem.
- Keep formatting changes scoped when possible so reviews remain readable.
- Use comments to explain intent or non-obvious constraints, not to narrate straightforward code.

## Testing

- Add or update tests when behavior changes.
- Prefer user-observable tests for UI behavior.
- Mock backend boundaries through the existing MSW test setup when appropriate.
- Cover success, failure, loading, and authentication-related behavior for critical flows.
- Tests must be deterministic and must not depend on the production backend.

## Required Local Checks

Run from `frontend/`:

```powershell
npm run type-check
npm run lint
npm test
npm run build
```

Use `npm ci` first when verifying from a clean dependency state.

## Environment and Dependencies

- Commit the npm lockfile when dependency changes are intentionally shared.
- Do not manually edit generated `dist/` output.
- Do not commit `.env` files.
- Document every required environment variable by name and purpose without recording secret values.
- Discuss new production dependencies before adding them when the same outcome is possible with existing tools.

## Git and Review

- Keep commits focused and messages descriptive.
- Do not mix unrelated refactors with deployment or bug-fix work.
- Use pull requests; never bypass protected production flow.
- Review against `REVIEW_CHECKLIST.md`.

