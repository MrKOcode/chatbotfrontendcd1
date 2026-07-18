# Frontend Deployment Guide

## Objective

Deploy the Vite frontend safely to AWS while teaching each implementation step. This document records the intended process; it does not authorize an automatic deployment.

## Branch and Release Strategy

```text
feature branch
    |
    | pull request
    v
aichatbotbranch2
    |
    | validation + reviewed pull request
    v
main
    |
    | GitHub Actions production deployment
    v
AWS S3 + CloudFront
```

Rules:

- No direct application pushes to `main`.
- Pull requests into `aichatbotbranch2` run validation.
- Pull requests from `aichatbotbranch2` into `main` run the same validation.
- Only an approved merge into `main` may trigger production deployment.
- Staging deployment from `aichatbotbranch2` is optional and should use separate AWS resources.

## Planned Lessons

### Lesson 1: Repository and Branch Setup

- Confirm `origin` uses the repository URL, not a GitHub `/tree/...` browser URL.
- Fetch remote branches.
- Create or track `aichatbotbranch2`.
- Confirm branch upstreams.

### Lesson 2: Branch Protection

Configure `main` to require:

- A pull request before merging.
- Required status checks.
- Resolution of review conversations.
- Protection against force pushes and deletion.

Protection for `aichatbotbranch2` can require CI checks while allowing the chosen team workflow.

### Lesson 3: Local Build Baseline

From `frontend/`, establish a known result for:

```powershell
npm ci
npm run type-check
npm run lint
npm test
npm run build
```

Existing failures must be understood before CI is introduced.

### Lesson 4: AWS Static Hosting Infrastructure

Create a dedicated frontend CloudFormation stack containing, at minimum:

- Private S3 bucket.
- Public-access block.
- Bucket versioning.
- CloudFront Origin Access Control.
- CloudFront distribution.
- S3 bucket policy allowing only the CloudFront distribution.
- SPA routing behavior.
- Outputs for the bucket name and CloudFront distribution ID/domain.

Add Route 53 and ACM only when a custom domain is ready.

### Lesson 5: GitHub OIDC

Create an AWS IAM OIDC trust relationship for GitHub Actions. The deployment role should:

- Trust only the intended GitHub repository.
- Restrict production assumption to the intended branch or GitHub environment.
- Permit uploads/deletions only in the frontend deployment bucket.
- Permit CloudFront invalidation only for the intended distribution.
- Avoid administrator or wildcard access wherever possible.

Do not create permanent AWS access keys for GitHub.

### Lesson 6: Pull-Request CI

The future validation workflow should:

1. Check out the pull-request commit.
2. Configure the approved Node.js version and npm cache.
3. Set `working-directory: frontend` where appropriate.
4. Run `npm ci`.
5. Run type checking, linting, tests, and a production build.
6. Upload test or build diagnostics when useful.

This workflow must not deploy.

### Lesson 7: Production CD

The future deployment workflow should:

1. Trigger only after a push to `main`, optionally gated by a GitHub production environment.
2. Re-run required validation rather than trusting old artifacts blindly.
3. Build with the approved production `VITE_API_BASE_URL`.
4. Assume the AWS deployment role through OIDC.
5. Synchronize `frontend/dist/` to the target S3 bucket.
6. Apply appropriate cache headers.
7. Invalidate CloudFront paths needed for the new entry point.
8. Record the commit SHA and deployment result.

## Configuration

Use GitHub repository or environment variables for non-secret public build configuration such as `VITE_API_BASE_URL`. Use GitHub environments for production approval and separation where available.

Never put secrets in `VITE_*` variables. Browser users can inspect compiled values.

## Verification Checklist

After a deployment:

- Open the CloudFront URL over HTTPS.
- Refresh a client-side route directly.
- Authenticate through the expected flow.
- List, create, open, and delete a test conversation.
- Send a test message and receive a response.
- Check browser developer tools for CORS, mixed-content, CSP, and failed asset errors.
- Confirm the deployed commit SHA.
- Confirm old S3 versions or a known previous build remain available for rollback.

## Rollback Strategy

Initial rollback should be simple and rehearsed:

1. Identify the last known-good commit/build.
2. Restore the corresponding S3 object versions or redeploy the known-good commit.
3. Invalidate the CloudFront entry point.
4. Verify the application and API integration.
5. Record the incident and cause.

Do not treat CloudFront invalidation by itself as a rollback; the underlying files must represent the desired version.

