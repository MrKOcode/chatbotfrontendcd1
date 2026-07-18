# Project Overview

## Project Name

AI Chatbot Frontend

## Purpose

This repository contains the browser frontend for the AI chatbot platform. It provides the user interface for authentication, conversation management, chatbot messaging, conversation history, and self-assessment-related experiences. It communicates with a separately deployed AWS backend.

## Current Status

- The backend has been deployed through AWS CloudFormation.
- The frontend repository is being prepared for controlled deployment.
- The intended production repository is `MrKOcode/chatbotfrontendcd1`.
- The intended integration branch is `aichatbotbranch2`.
- The `main` branch is intended to represent production and must not receive direct application pushes.
- GitHub Actions CI/CD has not yet been implemented; it will be created as a guided, step-by-step exercise.

## Technology

- React 19
- TypeScript
- Vite 6
- Redux and Redux Toolkit
- React Router
- Tailwind CSS
- Vitest and Testing Library
- ESLint and Prettier integration
- Amazon Cognito client library

## Repository Layout

```text
repository root/
|-- frontend/          Deployable Vite application
|   |-- src/           Application source
|   |-- test/          Test setup and tests
|   |-- package.json   Application scripts and dependencies
|   `-- dist/          Generated production output; never hand-edit
|-- docs/              Local project documentation
`-- AGENTS.md          Durable Codex working instructions
```

The root `package.json` is not the authoritative application package. Build, test, and lint commands must run from `frontend/`.

## Users and Capabilities

The application is expected to let authenticated users:

- View their conversations.
- Create a conversation.
- Load conversation messages.
- Send a message and receive an AI response.
- Delete a conversation.
- Use self-assessment or conversation-history features as they mature.

## Environment Configuration

The confirmed production variable is:

- `VITE_API_BASE_URL`: public base URL of the deployed backend.

All variables beginning with `VITE_` are compiled into public browser assets and must not contain secrets.

## Definition of a Successful Initial Deployment

- Pull requests run repeatable quality checks.
- `main` cannot receive unreviewed direct changes.
- GitHub authenticates to AWS using OIDC.
- The Vite application builds successfully from `frontend/`.
- Static assets are served through CloudFront from a private S3 bucket.
- SPA routes load correctly when opened or refreshed directly.
- The deployed frontend can authenticate and call the production backend without CORS errors.
- Deployment and rollback are documented and tested.

