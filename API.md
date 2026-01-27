# API Documentation

This document describes all API endpoints available in the Krunk Twitter-like application.

## Base URL

- **Local Development**: `http://localhost:3000`
- **Production**: `https://krunk-eight.vercel.app`

## Authentication

Most endpoints require authentication via session cookies. Users must log in through `/api/auth/login` to receive a session cookie.

### Authentication Flow

1. User logs in via `POST /api/auth/login`
2. Server sets an `httpOnly` cookie with the username
3. Subsequent requests automatically include this cookie
4. Server validates the session using `getSession()`

---

## Authentication Endpoints

### POST /api/auth/login

Logs in a user and creates a session.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "captchaToken": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Error Responses:**
- `400 Bad Request`: Missing username, password, or captcha token
- `401 Unauthorized`: Invalid username or password
- `500 Internal Server Error`: Server error during login

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepassword123",
    "captchaToken": "03AGdBq..."
  }'
```

---

### POST /api/auth/signup

Creates a new user account.

**Request Body:**
```json
{
  "username": "string (required, unique)",
  "email": "string (required, valid email)",
  "password": "string (required)",
  "captchaToken": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User created successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields, username already exists, or missing captcha token
- `500 Internal Server Error`: Server error during user creation

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "captchaToken": "03AGdBq..."
  }'
```

---

### POST /api/auth/logout

Logs out the current user by destroying their session.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  --cookie "username=john_doe"
```

---

### GET /api/auth/me

Returns the current authenticated user's information.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "authenticated": true,
  "username": "john_doe",
  "profilePicture": "/images/circle.png"
}
```

**Response (401 Unauthorized):**
```json
{
  "authenticated": false
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  --cookie "username=john_doe"
```

---

### POST /api/auth/update-profile-picture

Updates the current user's profile picture.

**Authentication:** Required

**Request Body:**
```json
{
  "profilePicture": "string (required, URL or path)"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401 Unauthorized`: User not logged in
- `400 Bad Request`: Missing profilePicture field
- `500 Internal Server Error`: Server error

---

## Post Endpoints

### POST /api/submit

Creates a new post.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "string (required)",
  "imageUrl": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011"
}
```

**Error Responses:**
- `401 Unauthorized`: User not logged in
- `500 Internal Server Error`: Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  --cookie "username=john_doe" \
  -d '{
    "content": "Hello, world!",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

---

### PUT /api/posts/[id]

Updates an existing post. **Users can only update their own posts.**

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the post (required)

**Request Body:**
```json
{
  "content": "string (required, cannot be empty)",
  "imageUrl": "string (optional)",
  "authorName": "string (required)",
  "authorAvatar": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid post ID or empty content
- `401 Unauthorized`: User not logged in
- `403 Forbidden`: User does not own this post
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Server error

**Example:**
```bash
curl -X PUT http://localhost:3000/api/posts/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  --cookie "username=john_doe" \
  -d '{
    "content": "Updated post content",
    "imageUrl": "https://example.com/new-image.jpg",
    "authorName": "john_doe",
    "authorAvatar": "/images/circle.png"
  }'
```

---

### DELETE /api/[id]

Deletes a post. **Users can only delete their own posts.**

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the post (required)

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid post ID format
- `401 Unauthorized`: User not logged in
- `403 Forbidden`: User does not own this post
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Server error

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/507f1f77bcf86cd799439011 \
  --cookie "username=john_doe"
```

---

### POST /api/posts/[id]/like

Toggles like status on a post (likes if not liked, unlikes if already liked).

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the post (required)

**Response (200 OK):**
```json
{
  "success": true,
  "likes": 42,
  "isLiked": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or missing post ID
- `401 Unauthorized`: User not logged in
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/posts/507f1f77bcf86cd799439011/like \
  --cookie "username=john_doe"
```

---

### POST /api/posts/[id]/repost

Toggles repost status on a post (reposts if not reposted, unreposts if already reposted).

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the post (required)

**Response (200 OK):**
```json
{
  "success": true,
  "reposts": 15,
  "isReposted": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or missing post ID
- `401 Unauthorized`: User not logged in
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/posts/507f1f77bcf86cd799439011/repost \
  --cookie "username=john_doe"
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## HTTP Status Codes

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid request data or missing required fields
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized (e.g., trying to modify someone else's post)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Session Management**: Uses httpOnly cookies for secure session management
3. **reCAPTCHA**: Login and signup require reCAPTCHA verification
4. **Input Validation**: All inputs are validated before processing
5. **Authorization Checks**: Users can only modify their own posts
6. **SQL Injection Prevention**: Uses MongoDB ObjectId validation and parameterized queries
7. **XSS Prevention**: Input sanitization and validation

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production use.

## CORS

CORS is handled by Next.js. The API accepts requests from the same origin.

---

**Last Updated**: January 2026
