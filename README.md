# AI Chatbot Frontend

A React single-page application for an authenticated AI chatbot experience. The
frontend uses Amazon Cognito for account registration and sign-in, maintains
chat state with Redux, and communicates with an authenticated backend API.

## Features

- User registration, confirmation, sign-in, and sign-out with Amazon Cognito
- Protected dashboard routing for authenticated users
- AI chat conversations with Markdown and mathematical notation rendering
- Conversation history management
- Self-assessment user interface
- Responsive component styling with CSS modules and Tailwind CSS
- Automated unit and component testing with Vitest and Testing Library

## Technology

- React 19 and React Router
- TypeScript and JavaScript
- Redux Toolkit
- Vite
- Tailwind CSS
- Amazon Cognito Identity SDK
- Vitest, Testing Library, and MSW
- ESLint and Prettier

## Repository Layout

```text
.
├── frontend/                 # Deployable React application
│   ├── public/               # Static public files
│   ├── src/
│   │   ├── components/       # Chat, dashboard, login, and assessment UI
│   │   ├── redux/            # Store, state, API actions, and backend models
│   │   ├── services/         # Authentication and backend API clients
│   │   └── main.tsx          # Application entry point
│   ├── test/                 # Vitest test support and test suites
│   └── vite.config.ts        # Vite, Vitest, aliases, and dev proxy
├── infrastructure/           # AWS infrastructure definitions
└── .github/                  # GitHub Actions workflows
```

All Node.js commands for the application must be run from `frontend/`.

## Prerequisites

- Node.js compatible with the lockfile and Vite 6
- npm
- A configured Amazon Cognito user pool and application client
- Access to the chatbot backend API

## Local Setup

1. Clone the repository and enter the frontend directory.

   ```powershell
   git clone <repository-url>
   cd chatbotfrontendcd1/frontend
   ```

2. Install the exact dependencies from the lockfile.

   ```powershell
   npm ci
   ```

3. Create a local environment file from the supplied example.

   ```powershell
   Copy-Item .env.example .env
   ```

4. Replace the example values in `.env` with values for your development
   environment.

   ```dotenv
   VITE_API_BASE_URL=https://your-api.example.com
   VITE_COGNITO_USER_POOL_ID=us-west-2_example
   VITE_COGNITO_CLIENT_ID=example
   VITE_COGNITO_DOMAIN=https://example.auth.us-west-2.amazoncognito.com
   VITE_COGNITO_REGION=us-west-2
   ```

5. Start the Vite development server.

   ```powershell
   npm run dev
   ```

Vite prints the local application URL in the terminal. The development server
also proxies `/api` requests to `VITE_API_BASE_URL`.

> [!IMPORTANT]
> Vite embeds every `VITE_*` value into browser assets. Never place passwords,
> access keys, client secrets, or other private values in these variables.

## Available Commands

Run these commands from `frontend/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run type-check` | Check TypeScript without emitting build files |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Apply safe ESLint fixes |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |

## Validation

Before opening a pull request, run:

```powershell
cd frontend
npm ci
npm run type-check
npm run lint
npm test
npm run build
```

The production output is written to `frontend/dist/`.

## Authentication and API Integration

The app uses Amazon Cognito for authentication. After sign-in, the current
implementation stores Cognito tokens in browser local storage and sends the ID
token to the backend as a bearer token:

```http
Authorization: Bearer <Cognito ID token>
```

The backend base URL comes from `VITE_API_BASE_URL`. Backend CORS configuration
must allow the exact deployed frontend origin, the required HTTP methods, and
the `Authorization` and `Content-Type` headers.

## Deployment

The intended production architecture is:

```text
Browser → CloudFront → private S3 bucket
Browser → Amazon Cognito
Browser → authenticated backend API
```

The build artifacts in `frontend/dist/` are suitable for static hosting. The
recommended AWS configuration uses a private, versioned S3 bucket behind
CloudFront Origin Access Control, HTTPS, and an SPA fallback to `index.html`.

The repository follows this delivery path:

```text
feature branch → pull request → aichatbotbranch2 → pull request → main
```

Production deployments must occur only after an approved merge into `main`.

## Security Notes

- Never commit `.env` files, tokens, passwords, or AWS credentials.
- Do not place a Cognito client secret in the frontend.
- Treat the browser and all client-supplied identifiers as untrusted.
- The backend must validate the bearer token and authorize every resource.
- Avoid logging authentication responses, bearer tokens, or private chat data.
- Use short-lived GitHub Actions OIDC credentials for AWS deployment.
