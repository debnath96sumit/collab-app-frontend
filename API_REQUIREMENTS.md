# API Requirements for Collaboration App

To support the frontend features (Authentication, Document Management, Real-time Collaboration), the backend must implement the following endpoints and Socket.io events.

## Base URL
`http://localhost:3000/api` (or as configured in `VITE_API_URL`)

## Authentication

### POST `/auth/login`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "token": "jwt_token", "user": { "id": "string", "username": "string", "email": "string" } }`

### POST `/auth/register`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "message": "User registered successfully" }`

### POST `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "message": "Logged out successfully" }`

## Documents

### GET `/documents`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `[ { "id": "string", "title": "string", "updatedAt": "date", "createdAt": "date" } ]`

### GET `/documents/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "id": "string", "title": "string", "content": "html_string", "collaborators": [...] }`

### POST `/documents`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: `{ "id": "string", ... }`

### PUT `/documents/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: `{ "id": "string", ... }`

### DELETE `/documents/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "message": "Document deleted" }`

### POST `/documents/:id/share`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "email": "string", "permission": "editor|viewer|commenter" }`
- **Response**: `{ "id": "collaborator_id", ... }`

### DELETE `/documents/:id/collaborators/:collaboratorId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "message": "Collaborator removed" }`

### PATCH `/documents/:id/collaborators/:collaboratorId`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "role": "editor|viewer|commenter" }`
- **Response**: `{ "message": "Permission updated" }`

## Socket.io Events

### Connection
- Client connects with `auth: { token: "jwt_token" }`.

### Events Emitted by Client
- `joinDocument(docId)`: Join the room for a specific document.
- `editDocument({ docId, content })`: Send updated content (HTML) to the server.
- `renameDocument({ docId, name })`: Send updated title.
- `cursorMove({ docId, range, user })`: Send cursor position and user info.

### Events Listened by Client
- `documentUpdated(content)`: Receive updated content from other users.
- `documentRenamed(name)`: Receive updated title.
- `cursorMoved({ range, user })`: Receive cursor position of another user.
