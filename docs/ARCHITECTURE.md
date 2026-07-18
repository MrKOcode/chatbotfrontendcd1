# Frontend Architecture

## System Context

```text
User browser
    |
    v
CloudFront distribution
    |
    v
Private S3 bucket containing frontend/dist

User browser ---- HTTPS/JSON + bearer token ----> AWS backend API
User browser ---- authentication ----------------> Amazon Cognito
```

The frontend is a client-side React single-page application. AWS hosts the compiled static files, while the browser communicates directly with the backend API and authentication service.

## Application Architecture

### Entry Point

`frontend/src/main.tsx` initializes React, enables strict mode, attaches the Redux provider, and renders the root application.

### State Management

Redux manages chat and conversation state. Asynchronous API operations live under `frontend/src/redux/api/`, with backend response types under `frontend/src/redux/backend_models/`.

### UI

UI code is organized under `frontend/src/components/`, including chat, dashboard, and self-assessment-related components. Styling combines local CSS and Tailwind-related tooling.

### Backend Communication

The application reads `VITE_API_BASE_URL` at build time and uses browser `fetch` calls. Requests currently use JSON and a bearer token read from browser storage.

## Build Architecture

The production build runs:

```powershell
cd frontend
npm ci
npm run build
```

The `build` script runs TypeScript project compilation followed by `vite build`. Output is written to `frontend/dist/`.

## Target AWS Hosting Architecture

### S3

- Store compiled static assets only.
- Enable bucket versioning for recovery.
- Block all public access.
- Do not use an unrestricted public-read bucket policy.

### CloudFront

- Use the S3 bucket as the origin.
- Use Origin Access Control to read private S3 objects.
- Redirect HTTP to HTTPS.
- Configure the root object as `index.html`.
- Support SPA routing by returning `index.html` for application routes that do not map to S3 objects.
- Cache fingerprinted assets for a long duration and `index.html` for a short duration.

### Optional Domain

- Route 53 can map a custom domain to CloudFront.
- An ACM certificate used by CloudFront must be provisioned in `us-east-1`.

## Deployment Boundaries

- Frontend infrastructure should be managed separately from backend application infrastructure unless an explicit architecture decision combines them.
- GitHub Actions uploads only the contents of `frontend/dist/`.
- Production deployment occurs from `main` only.
- AWS access is granted through a narrowly scoped GitHub OIDC role.

## Current Risks and Follow-ups

- `frontend/bucket-policy.json` grants public object reads. The target design replaces this with private S3 plus CloudFront Origin Access Control.
- Authentication data is read from `localStorage`; the security implications should be reviewed before production hardening.
- API code includes extensive console logging. Logs must be reviewed to ensure tokens, user data, or sensitive chat content are not exposed.
- CORS on the backend must explicitly allow the deployed frontend origin.
- The exact Cognito configuration and frontend authentication flow must be verified before deployment.
- SPA fallback behavior must be tested through CloudFront.

