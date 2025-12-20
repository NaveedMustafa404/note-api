# Note Taking API

**Assessment Submission – Setup & Testing Documentation**

This document provides clear and concise instructions to configure, run, and test the Note Taking API locally, as required in Requirement #7 of the assessment.

---

## 1. Problem Overview (Assessment Context)

This application implements a Note Taking API using **ExpressJS**, **MySQL**, **Redis**, **Sequelize**, and **Docker**, demonstrating:

- Version control for notes
- Safe concurrent updates using optimistic locking
- Efficient full-text search
- Redis caching with proper invalidation
- Clean architecture and separation of concerns

---

## 2. Prerequisites

The application is **fully containerized**.

**Required tools:**
- Docker
- Docker Compose

❗ **No local installation of Node.js, MySQL, or Redis is required.**

---

## 3. Environment Configuration (Required)

Create a `.env` file at the project root using `.env.example` as reference.

### Required Environment Variables

```env
PORT=3000

DB_HOST=mysql
DB_PORT=3306
DB_NAME=notes_db
DB_USER=root
DB_PASSWORD=root

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

> **Note:** Docker service names (`mysql`, `redis`) are used as internal hosts.

---

## 4. Running the Application (Dockerized)

### Step 1: Start All Services

```bash
docker-compose up -d
```

This starts:
- Express API server
- MySQL database
- Redis cache

**Verify containers:**

```bash
docker ps
```

### Step 2: Run Database Migrations

```bash
docker exec -it note_api npm run migrate
```

This command:
- Creates all database tables
- Applies relationships and indexes
- Enables FULLTEXT search
- Prepares versioning and sharing schema

### Step 3: Verify Server

The API will be available at:

```
http://localhost:3000
```

**(Optional health check)**

```bash
curl http://localhost:3000/health
```

---

## 5. Authentication (Requirement 3a, 3b)

### User Registration

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

> Passwords are securely hashed.

### User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Returns:**
- Access token
- Refresh token

**Use the access token for protected routes:**

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 6. Notes API (Core Functionality)

### Create a Note (Versioned)

```http
POST /api/notes/create
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Initial content"
}
```

> Creates version 1 of the note.

### Retrieve All Notes (Cached)

```http
GET /api/notes/all-list
Authorization: Bearer <ACCESS_TOKEN>
```

- Returns notes owned by the authenticated user
- Cached in Redis

### Retrieve a Specific Note (Cached)

```http
GET /api/notes/by/:id
Authorization: Bearer <ACCESS_TOKEN>
```

- Cached in Redis
- Excludes soft-deleted notes

### Update a Note (Concurrency Safe)

```http
PUT /api/notes/update/:id
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "version": 1
}
```

- Uses optimistic locking
- If version mismatch → `409 Conflict`
- Creates a new version entry

### Revert to a Previous Version

```http
POST /api/notes/revert/:id
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "version": 2
}
```

> Restores content by creating a new version.

### Delete a Note (Soft Delete)

```http
DELETE /api/notes/delete/:id
Authorization: Bearer <ACCESS_TOKEN>
```

- Marks note as deleted
- Preserves full version history

---

## 7. Full-Text Search (Requirement 1c, 2b)

```http
GET /api/notes/search?q=keyword
Authorization: Bearer <ACCESS_TOKEN>
```

**Behavior:**
- Uses MySQL FULLTEXT index
- Searches latest versions only
- Excludes soft-deleted notes

---

## 8. Caching with Redis (Requirement 4)

**Cached endpoints:**
- `GET /api/notes/all-list`
- `GET /api/notes/by/:id`

**Cache invalidation occurs on:**
- Create
- Update
- Revert
- Delete
- Share

> Database remains the source of truth.

---

## 9. Note Sharing (Bonus Feature)

### Share a Note

```http
POST /api/notes/:id/share
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "email": "other@example.com",
  "permission": "read"
}
```

**Permissions:**
- `read` → view only
- `edit` → view and update (version checked)

### Retrieve Notes Shared With Me

```http
GET /api/notes/shared-with-me
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 10. Attachments (Bonus Feature)

### Upload Attachment

```http
POST /api/notes/:id/attachments
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data
```

- File stored locally
- Metadata stored in database

### List Attachments

```http
GET /api/notes/:id/attachments
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 11. Refresh Token Mechanism (Bonus Feature)

- Access tokens are short-lived
- Refresh tokens allow session continuation without re-login
- Improves security and user experience

---

## 12. Testing the API

The API can be tested using:
- Postman 
- curl
- Any REST client

**Example:**

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello world"}'
```

---

Perfect — here is the **exact README-style section**, minimal and professional, **copy-paste ready**, matching the tone and structure of the rest of your README.

---

## Postman Collection

A Postman collection is provided to test all API endpoints quickly without manual setup.

### Collection Link

```
https://api.postman.com/collections/17737850-5fda08a4-3ba7-4b70-b738-9a45bc9f649d?access_key=PMAT-01KCWQQ2FV3SADPM79EJCCHCA3
```

### How to Use

1. Open Postman
2. Click **Import**
3. Paste the collection link or upload the file
4. Set the following environment variables:

| Variable        | Description                 |
| --------------- | --------------------------- |
| `base_url`      | `http://localhost:3000`     |
| `access_token`  | JWT access token from login |
| `refresh_token` | JWT refresh token           |

### Notes

* All protected requests automatically include
  `Authorization: Bearer {{access_token}}`
* The collection covers:

  * Authentication
  * Notes CRUD with versioning
  * Optimistic locking scenarios
  * Full-text search
  * Note sharing
  * Attachments

---



## License

This project is created for assessment purposes.
