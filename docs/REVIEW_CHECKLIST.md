# Frontend Review Checklist

Use the relevant items for each pull request. A reviewer should understand both what changed and how it was verified.

## Scope and Intent

- [ ] The change has a clear purpose and matches the requested scope.
- [ ] Unrelated refactors or generated files are not included.
- [ ] Assumptions and user-visible behavior are documented.
- [ ] Architectural or deployment changes update the relevant local documentation.

## Git and Delivery

- [ ] Work did not bypass the `aichatbotbranch2` integration flow.
- [ ] The change reaches `main` only through an approved pull request.
- [ ] Production deployment cannot be triggered from an unapproved branch.
- [ ] No force-push, history rewrite, or unrelated user work was lost.

## Code Quality

- [ ] TypeScript types describe API and state boundaries accurately.
- [ ] New `any` usage is avoided or justified.
- [ ] React effects and hook dependencies are correct.
- [ ] Loading, empty, error, and retry states are handled.
- [ ] Accessibility and responsive behavior were considered.
- [ ] Debug code and unnecessary console logging were removed.

## API and Authentication

- [ ] API routes, methods, request bodies, and response assumptions match the backend.
- [ ] Authentication headers use the intended token type.
- [ ] Missing and expired sessions are handled safely.
- [ ] Client-provided `userId` is not assumed to provide backend authorization.
- [ ] CORS implications were considered and tested in a browser.
- [ ] No token, private chat content, or sensitive response is logged.

## Security

- [ ] No secrets, credentials, tokens, `.env` files, or private URLs were committed.
- [ ] No secret was placed in a `VITE_*` variable.
- [ ] User-controlled content is rendered safely.
- [ ] New dependencies are necessary, reputable, and reviewed.
- [ ] S3 remains private and reachable through CloudFront Origin Access Control.
- [ ] IAM changes follow least privilege and GitHub uses OIDC.

## Tests and Build

Run from `frontend/` and record results:

- [ ] `npm ci`
- [ ] `npm run type-check`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Tests were added or updated for changed behavior.
- [ ] Known pre-existing failures are identified separately.

## Deployment Changes

- [ ] The workflow uses the correct `frontend/` working directory.
- [ ] Pull-request workflows cannot deploy production.
- [ ] Production variables come from the intended GitHub environment.
- [ ] AWS authentication uses OIDC rather than stored access keys.
- [ ] S3 synchronization targets only the intended bucket.
- [ ] Cache headers and CloudFront invalidation behavior are appropriate.
- [ ] SPA routing was tested by refreshing a nested route.
- [ ] The deployment identifies the source commit.
- [ ] Rollback steps are clear and feasible.

## Manual Verification

- [ ] Application loads through HTTPS.
- [ ] Authentication and logout work.
- [ ] Conversation list, create, open, message, and delete flows work.
- [ ] Browser console has no unexplained errors.
- [ ] Browser network panel has no failed assets, CORS errors, or mixed content.
- [ ] The reviewer knows how to reproduce the verification.

