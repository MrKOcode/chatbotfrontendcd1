# Frontend API Guide

## Purpose

This document records the frontend's current understanding of the backend contract. The deployed backend and its authoritative API specification take precedence. Update this guide when an approved backend contract changes.

## Base URL

The application reads the backend base URL from:

```text
VITE_API_BASE_URL
```

Calls currently append routes beginning with `/api/AIchat`. Avoid a trailing slash in the configured base URL unless URL construction is normalized.

## Common Headers

Current authenticated JSON requests use:

```http
Content-Type: application/json
Authorization: Bearer <Cognito ID token>
```

The token is currently read from `localStorage` under `idToken`. The application also reads `userId` from `localStorage` for request data or guards.

## Current Endpoints

### List Conversations

```http
GET /api/AIchat/conversations
```

Expected result includes conversation records under `content.data`.

### Create Conversation

```http
POST /api/AIchat/conversations
```

Current request body:

```json
{
  "userId": "string"
}
```

### Get Conversation Messages

```http
GET /api/AIchat/conversations/{conversationId}/messages?userId={userId}
```

Expected result contains messages under `content.content`.

### Send Message

```http
POST /api/AIchat/conversations/{conversationId}/messages
```

Current request shape:

```json
{
  "userId": "string",
  "conversationId": "string",
  "message": {
    "content": "string",
    "role": "user",
    "createdAt": "ISO-8601 timestamp",
    "conversationId": "string"
  }
}
```

### Delete Conversation

```http
DELETE /api/AIchat/conversations/{conversationId}
```

Current request body:

```json
{
  "userId": "string",
  "conversationId": "string"
}
```

## Message Role Mapping

The frontend currently maps backend roles as follows:

| Backend role | Frontend role |
|---|---|
| `user` | `send` |
| `chatbot` | `ai` |
| `system` | `ai` |

## Error Handling Expectations

- Treat non-2xx responses as failures.
- Do not expose internal backend details to users.
- Handle expired or invalid authentication consistently.
- Distinguish offline/network failures from rejected API requests where practical.
- Ensure optimistic messages can be reconciled or marked failed.

## Contract Questions to Resolve

- Is `userId` required when identity is already available from the validated token?
- Should GET and DELETE requests carry user data in query parameters or bodies?
- What is the standard error response schema?
- What pagination parameters and defaults are supported?
- What are the canonical message and conversation identifier types?
- Which endpoint supports assessment submission and retrieval?
- What retry or rate-limit behavior does the backend expect?

