# Frontend Roadmap

## Guiding Principle

Deliver a secure, repeatable production deployment first. Improve automation and product features only after the deployment baseline is observable and recoverable.

## Phase 1: Repository Safety

- [ ] Correct and verify the Git remote.
- [ ] Create or track `aichatbotbranch2`.
- [ ] Protect `main` from direct pushes.
- [ ] Define the pull-request path from feature branches to integration to production.
- [ ] Establish local validation results.

## Phase 2: AWS Frontend Foundation

- [ ] Decide AWS account, region, naming, and tagging conventions.
- [ ] Create a separate frontend CloudFormation stack.
- [ ] Create a private, versioned S3 bucket.
- [ ] Create CloudFront with Origin Access Control.
- [ ] Configure SPA routing and cache behavior.
- [ ] Add a custom domain and certificate if required.
- [ ] Configure backend CORS for the deployed origin.

## Phase 3: Continuous Integration

- [ ] Add a pull-request validation workflow.
- [ ] Run dependency installation, type checking, linting, tests, and build.
- [ ] Make successful checks required for `main`.
- [ ] Document handling of known failures and test coverage expectations.

## Phase 4: Continuous Deployment

- [ ] Configure GitHub Actions OIDC in AWS.
- [ ] Create a least-privilege frontend deployment role.
- [ ] Create a production GitHub environment and approval policy.
- [ ] Deploy `frontend/dist/` after approved merges to `main`.
- [ ] Configure cache headers and CloudFront invalidation.
- [ ] Record deployment metadata and test rollback.

## Phase 5: Production Hardening

- [ ] Review token storage and the Cognito authentication flow.
- [ ] Remove or constrain sensitive production console logging.
- [ ] Add security headers through CloudFront.
- [ ] Add dependency and code security scanning.
- [ ] Add frontend error monitoring and deployment alerts.
- [ ] Review accessibility and browser compatibility.
- [ ] Define performance budgets and monitor Core Web Vitals.

## Phase 6: Delivery Improvements

- [ ] Add an isolated staging environment if useful.
- [ ] Introduce preview environments only if their cost and cleanup are controlled.
- [ ] Use immutable build artifacts across promotion stages.
- [ ] Automate smoke tests after deployment.
- [ ] Improve test coverage around authentication and chat workflows.

## Later Product Work

- [ ] Refine conversation history and self-assessment experiences.
- [ ] Improve loading, retry, empty, and error states.
- [ ] Improve mobile and responsive behavior.
- [ ] Add user-facing release notes where appropriate.

