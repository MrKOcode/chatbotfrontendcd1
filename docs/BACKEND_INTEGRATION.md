# Backend Integration

## Responsibility Boundary

The frontend renders the user experience and invokes authenticated backend APIs. The backend owns authorization, data persistence, AI orchestration, validation, and enforcement of user-level access. Client-supplied identifiers must never be treated as proof of identity by the backend.

## Production Connection

The production API origin is supplied at build time through `VITE_API_BASE_URL`. Because Vite compiles this value into browser JavaScript, the value is public and environment-specific.

Recommended environments:

- Local development: local or approved development API.
- Staging: staging API and staging Cognito resources.
- Production: production API and production Cognito resources.

Do not silently point non-production builds at production services.

## Authentication

The source currently sends a bearer token from `localStorage.idToken` and checks for `localStorage.userId`. Amazon Cognito tooling is included as a dependency.

Before production release, verify:

- Which Cognito user pool and app client are used.
- The callback, logout, and allowed web origins.
- Token expiration and refresh behavior.
- Behavior for missing, expired, malformed, or revoked tokens.
- Whether ID tokens or access tokens are required by the backend authorizer.
- Whether storing tokens in `localStorage` is acceptable for the application's threat model.
- That the backend derives and authorizes identity from the validated token.

Never store a Cognito client secret in the frontend.

## CORS

The backend must allow the exact deployed frontend origin. Confirm:

- Allowed origin matches the CloudFront or custom domain origin.
- Allowed methods include the methods actually used: `GET`, `POST`, and `DELETE`.
- Allowed headers include `Authorization` and `Content-Type`.
- OPTIONS preflight requests succeed.
- Production does not use an unnecessarily broad wildcard origin with credentialed requests.

Test CORS in the browser; command-line API success does not prove browser CORS is correct.

## Local Development Proxy

`frontend/vite.config.ts` defines a development proxy for `/api` using `VITE_API_BASE_URL`. Current API calls also construct absolute URLs using `VITE_API_BASE_URL`. Keep the approach consistent when refactoring so local and production behavior do not unexpectedly diverge.

## API Contract

See `API_GUIDE.md` for the currently observed endpoints and request shapes. Backend-generated API documentation remains authoritative.

## Logging and Privacy

Current API code logs detailed request flow and some message/request data. Before production:

- Remove or constrain logs containing user messages or identifiers.
- Never log bearer tokens.
- Avoid logging full authentication responses.
- Ensure frontend monitoring redacts sensitive fields.
- Define what chatbot content may be retained by monitoring tools.

## Integration Verification

For every environment, verify:

1. Application loads over HTTPS.
2. User can authenticate.
3. Token is accepted by the backend authorizer.
4. Conversation list loads for the authenticated user only.
5. Conversation creation succeeds.
6. Message send and response succeed.
7. Conversation history loads.
8. Conversation deletion is authorized and succeeds.
9. Expired-session behavior is understandable and safe.
10. Browser console and network panel show no CORS or mixed-content errors.

## Security Principle

The browser is untrusted. The backend must validate every token, input, conversation identifier, and authorization decision even if the frontend has already performed a check.

