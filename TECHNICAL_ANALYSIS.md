
---

# Technical Analysis — Note Taking API

## 1. Overview

This document explains **how and why** the Note Taking API was designed and implemented the way it is.

The objective was not just to build a working API, but to **demonstrate production-grade backend thinking** especially with **data modeling, concurrency, versioning, caching, and long-term maintainability**.

From the very first moment, I treated this assessment like a **real system that could evolve**, not just a required assessment. Every technical choice was made deliberately, with clear trade-offs in mind.

---

## 2. Initial Approach & Thought Process

When I first received the problem statement, I intentionally **did not start writing code**.

In real-world backend systems, poor early decisions, especially those related to database design and concurrency are expensive to rectify later. So I followed a strict top-down approach:

1. Fully understand the problem and constraints
2. Design the database schema
3. Identify core and optional features
4. Choose an architecture
5. Select technologies based on *why*, not popularity
6. Implement with clean boundaries and predictable data flow

This ensured that **code followed design* not the other way around.

---

## 3. Database-First Design

### Why the Database Came First

This system fundamentally revolves around:

* Notes
* Notes history
* Concurrent updates
* Searching
* Sharing 
* Removing notes with care

That makes the **database the backbone of the entire application**.

Before touching any controllers or services, I designed a schema that naturally supports:

* Version tracking
* Reverting changes
* Optimistic locking
* Soft deletion
* Sharing permissions
* Full-text search
* Attachments

If the database is right, the API becomes simpler and safer.

---

### Core Tables

**users**
Stores authentication and identity information.

**notes**
Represents the logical note entity:

* Ownership
* Current active version
* Soft deletion flag

**note_histories**
Stores immutable historical versions of notes:

* Every update creates a new row
* Enables full audit trail
* Allows clean revert functionality

**note_shares**
Handles collaboration, but with permission constraints 
* Shared users
* Permission levels (read / edit)

**attachments**
Stores metadata for uploaded files associated with notes.

---

### Key Design Principle

> **Notes are immutable. Updates create history.**

Instead of mutating a note in place, each update creates a new version.

This decision dramatically simplifies:

* Concurrency handling
* Rollbacks
* Debugging
* Auditing
* Reasoning about state

It also avoids subtle bugs caused by in-place updates under concurrent access which is a common issue in collaborative systems. Though we creating an extra row but from a note tracking perspective this doesn't eat much. 

---

## 4. Feature Segregation

After creating schema, features were grouped.

### Core Features

* User authentication
* Note CRUD with version history
* Optimistic locking
* Soft deletion

### Performance & Reliability

* Redis caching
* Cache invalidation
* Full-text search

### Collaboration, Media and Refresh Token Features (BONUSS)

* Note sharing with permissions
* File attachments
* Refresh token mechanism

I always prefer to separate because this ensured **each feature had a clear purpose** and didn’t leak concerns into other areas of the system.

---

## 5. Architecture Selection

### Layered Architecture

I chose a classic **layered architecture** because it scales well in both team size and complexity.

**Routes / Controllers**

* Handle HTTP concerns
* Validate inputs
* Forward requests

**Services**

* Contain business logic
* Enforce authorization
* Handle versioning and concurrency rules

**Repositories**

* Encapsulate database access
* Abstract ORM details
* Keep queries isolated and testable

**Infrastructure**

* Database connection
* Redis client
* Singleton instances

---

### Why This Matters

This structure:

* Keeps business logic framework-agnostic
* Makes testing straightforward
* Prevents tight coupling
* Allows layers to evolve independently

In real systems, this separation is what keeps codebases sane over time.

---

## 6. Concurrency Strategy

### Concurrency Was a Real Problem Here 

Multiple users can:

* Read the same note
* Attempt updates at the same time

Without a strategy, it would follow **last write wins** and this leads to certain data loss.

---

### Optimistic Locking

I implemented **optimistic locking using a version field**.

**Flow:**

1. Client reads a note and receives its version
2. Client sends the version back during update
3. Server compares versions
4. If mismatched → reject with a conflict error

---

### Why Optimistic Locking?

* No database-level locks
* Works well in read-heavy systems
* Scales in distributed environments
* Easier to reason about than pessimistic locking

This approach **prevents race conditions without blocking** other users.

---

## 7. Caching Strategy

### Why Caching Is Needed

Fetching notes is a **read-heavy operation**.
Hitting the database every time! Not an ideal strategy to follow.

---

### Redis as a Read Cache

Redis is used to cache:

* Fetch all notes
* Fetch a single note
* We can also fetch history lists if we want

This provides faster response as it uses RAM than disc storage.

---

### Cache Invalidation

Cache is explicitly invalidated on:

* Create
* Update
* Revert
* Delete

This ensures:

* Strong consistency
* Predictable behavior
* No stale data surprises

---

### Trade-off

* Slightly more write complexity
* Massive read performance gains

This is a trade-off I would love to make again in real production systems.

---

## 8. Technology Choices & Reasoning

### Runtime & Framework

**Node.js + Express**

* Non-blocking I/O
* Lightweight
* Ideal for API services

---

### Database

**MySQL**

* Strong relational guarantees
* Native FULLTEXT search
* Widely supported and reliable

---

### ORM Choice

**Sequelize**

**Why Sequelize:**

* Explicit models
* Mature ecosystem
* Strong transaction support
* Good fit for relational schemas

**Trade-off:**

* More verbose than modern ORMs

**Alternative:**
Prisma is gaining popularity nowadays for,

* Better type safety
* Cleaner syntax

However, Sequelize provides **more explicit control**, which is valuable in systems dealing with concurrency and versioning.

---

### Authentication

JWT with access + refresh tokens:

* Stateless authentication
* Better UX
* Secure session handling

---

### Containerization

**Docker & Docker Compose**

* Consistent environments
* Easy onboarding
* Mirrors real deployments

---

## 9. Design Patterns

### Singleton Pattern

Applied to:

* Database connection
* Redis client

**Why:**

* Prevents connection explosion
* Ensures shared resources
* Avoids subtle bugs under load

This is critical in long-running Node.js processes.

---

## 10. Trade-offs & Their Impact

### Local File Storage for Attachments

**Trade-off:**

* Simple setup
* Not horizontally scalable

**Impact:**

* Acceptable for assessment
* Easy upgrade to S3 or object storage later

---

### MySQL FULLTEXT vs Elasticsearch

**Trade-off:**

* Simpler infrastructure
* Less powerful search

**Impact:**

* Faster development
* Meets requirements
* Clear upgrade path

---

## 11. Scalability, Performance & Maintainability
At this stage of development, I believe we have ensured:

### Scalability

* Stateless API
* Optimistic locking
* Redis caching
* Dockerized services

### Performance

* Read caching
* Indexed queries
* FULLTEXT search
* Minimal locking

### Maintainability

* Clear separation of concerns
* Predictable data flow
* Explicit version history
* Minimal hidden side effects

---

## 12. Final Thoughts

This project was built as a **real backend system**, not a demo.

The result is a system that is:

* Safe under concurrency
* Easy to reason about
* Ready to evolve beyond the assessment scope

If this were taken to production, the foundations are already in place.

---

