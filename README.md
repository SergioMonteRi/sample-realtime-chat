# Sala — Real-Time Direct Messages

A two-person chat built end to end: a Flask API that authenticates by session cookie and
stores the conversation, and a React front end where a message sent in one browser appears
in the other one — pushed over Socket.IO, not fetched by a timer.

![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2-E92063?logo=pydantic&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-latest-4479A1?logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

> **Study project.** This repository is part of my Python learning track. The goal is to
> exercise what a chat forces on you that a CRUD app never does — a persistent connection,
> rooms, an event arriving with no request behind it, and a client cache that has to accept
> data it did not ask for. Nothing here is hardened for production; see
> [Roadmap](#roadmap) for what is missing.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [The message flow](#the-message-flow)
- [Data model](#data-model)
- [Getting started](#getting-started)
- [API reference](#api-reference)
- [Real-time channel](#real-time-channel)
- [Front end](#front-end)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

The exercise: build direct messaging between two registered people. Someone signs up, sees
everyone else as a contact, opens a conversation, and types. The message is stored, echoed
back to the sender, and pushed to whoever else is watching that conversation.

The interesting part is not the CRUD — it is that **the second browser never asked for that
message.** It arrives on a channel, out of band, and has to land in a cache the screen is
already rendering from. Getting that write to look exactly like an HTTP response — so the UI
cannot tell the two apart — is what the project is about. The optimistic bubble that appears
before the server answers is the same problem seen from the other side.

The project was built in two phases, and the seam is deliberate: the first commit was
REST-only, with the channel stubbed behind an interface; the second dropped Socket.IO in
without touching a single component.

## Features

- **Session authentication** — register and login with flask-login, password hashed with
  Werkzeug, session kept in an httpOnly cookie the JavaScript never reads.
- **1:1 conversations** — `POST /chat` is create-or-return: asking twice for the same pair
  gives back the same chat, so the client needs no "does it exist" round trip.
- **Message history** — chronological, and readable only by a participant of that chat.
- **Push over WebSocket** — after the row is committed, the server emits `new-message` into
  the `chat:<chat_id>` room, so only the two people in that conversation are woken up.
- **Channel behind an interface** — the app talks to `RealtimeGateway`; `socket.io-client` is
  imported in exactly one file, and swapped in with a single call at bootstrap.
- **One door into the cache** — `applyIncomingMessage` is where an unrequested message lands,
  whether it came from the socket or from the `POST` response. The components never learn
  which.
- **Optimistic send** — the bubble appears in the same frame as the click, marked as sending,
  and is replaced by the server's message when it returns; on failure it disappears and the
  text goes back to the field.
- **Validation on both ends** — Pydantic guards the API borders, Zod guards the front end's,
  including the payload that arrives over the socket.
- **Time-sortable UUID keys** — UUIDv7 primary keys via a custom SQLAlchemy type.
- **Alembic migrations** — the schema is versioned, not created at import time.
- **Bilingual UI** — pt-BR and en-US, switchable in the header.
- **Containerized database** — MySQL through Docker Compose, no local install required.

## Tech stack

### Backend

| Layer | Tool |
| --- | --- |
| Language | Python 3.14 |
| Web framework | Flask 3.1 |
| Real time | Flask-SocketIO 5.6 |
| Authentication | Flask-Login 0.6 |
| ORM | SQLAlchemy 2.0 + Flask-SQLAlchemy 3.1 |
| Migrations | Flask-Migrate 4.1 (Alembic) |
| Database | MySQL (via Docker Compose) |
| Driver | PyMySQL |
| Validation | Pydantic 2 + email-validator |
| CORS | Flask-Cors |
| Configuration | python-dotenv |

### Front end

| Layer | Tool |
| --- | --- |
| Language | TypeScript 6 |
| UI | React 19 |
| Build | Vite 8 |
| Server state | TanStack Query 5 |
| Real time | socket.io-client 4 |
| HTTP | Axios |
| Validation | Zod 4 + React Hook Form |
| Styling | styled-components 6 |
| i18n | i18next (pt-BR, en-US) |
| Routing | React Router 7 |
| Toasts | Sonner |

## Architecture

### Project structure

```text
sample-realtime-chat/
├── backend/
│   ├── app.py                      # entry point: application factory, CORS, blueprints
│   ├── extensions.py               # db, socketio and login_manager, created outside the app
│   ├── docker-compose.yml          # MySQL service for local development
│   ├── requirements.txt
│   ├── custom_types/
│   │   ├── uuid.py                 # TypeDecorator: UUID <-> String(36)
│   │   └── utc_datetime.py         # TypeDecorator: aware UTC <-> naive DATETIME
│   ├── models/
│   │   ├── user.py                 # UserMixin, so flask-login can carry it
│   │   ├── chat.py
│   │   ├── chat_participant.py     # the join table, composite primary key
│   │   └── message.py
│   ├── schemas/                    # request and response contracts (Pydantic)
│   │   ├── auth/                   # create_user_request, login_request
│   │   ├── chat/create_chat_request.py
│   │   ├── message/message_schemas.py
│   │   └── user/get_users_response.py
│   ├── routes/                     # blueprints, one per API domain
│   │   ├── auth.py                 # register, login, logout, the user_loader
│   │   ├── user.py                 # GET /users
│   │   └── chat.py                 # POST /chat and the message endpoints
│   ├── services/                   # every rule that is not HTTP
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── chat_service.py         # create-or-return, participant check
│   │   └── message_service.py
│   ├── sockets/
│   │   └── chat_socket.py          # the `join-chat` handler
│   └── migrations/versions/        # Alembic revisions
└── frontend/
    ├── index.html
    ├── docs/frontend-guide.md      # the front-end conventions this app follows
    └── src/
        ├── components/             # atoms, molecules, organisms
        ├── config/                 # typed read of the environment variables
        ├── constants/              # routes, storage keys, limits, regex
        ├── i18n/locales/           # pt-BR and en-US (common · auth · chat · errors)
        ├── pages/                  # auth/login · auth/register · chat · not-found
        ├── providers/              # query client, theme, i18n, session, toasts
        ├── routes/                 # routes and session guards
        ├── services/
        │   ├── http/               # axios client, error normalization, 401 handling
        │   ├── auth/ users/ chats/ messages/
        │   └── realtime/           # the gateway contract and its Socket.IO implementation
        ├── styles/                 # theme, mixins, global styles, animations
        └── utils/                  # date, string, storage
```

The backend separation follows one rule: **`routes` translate HTTP, `services` hold the
rules.** A route never queries the database directly, and a service never knows a request
exists — which is why `sockets/chat_socket.py` can reuse `ChatService` unchanged.

Each `services` domain on the front end has the same shape: `*.schemas.ts` (Zod validates the
response at the border and converts snake_case to camelCase), `*.types.ts` (inferred from the
schema), `*.service.ts` (axios only), `*.queries.ts` / `*.mutations.ts` (`queryOptions` /
`mutationOptions` with a key factory) and one thin hook per operation — that last one is what
the UI imports.

### Design decisions

**The extensions live outside the factory.** `db`, `socketio` and `login_manager` are created
at module scope in `extensions.py` and only bound with `init_app`. It matters most for
`socketio`: `routes/chat.py` has to emit an event, and if the emitter only existed inside
`create_app()` the route would have to import the app to reach it. With the instance in a
neutral module the arrow always points the same way — everything imports `extensions`, nothing
imports `app`.

**The channel is behind a gateway.** `RealtimeGateway` (`realtime.contract.ts`) declares
`connect`, `joinChat` and `onNewMessage`; `socket-io-gateway.ts` is the only file in the
codebase that imports `socket.io-client`, and `setRealtimeGateway()` installs it once at
bootstrap. The default implementation is a null object that does nothing, which is what let
the whole REST phase ship with the seam already in place. No component, page or hook knows the
transport exists.

**A message enters the cache through one function.** `applyIncomingMessage(queryClient,
message)` writes to the same `queryKey` the conversation is already rendering from. The socket
handler calls it; so does the `POST` response path. Because the write is the same, an HTTP
answer and a pushed event produce an identical render — there is no "real-time branch" in the
UI to keep in sync with the normal one.

**The optimistic bubble is matched by content, not by id.** The client mints its own id
(`optimistic:<uuid>`) and the server mints another, so they can never be compared. When the
confirmed message arrives, the cache looks for a still-pending bubble with the same text from
`@me` and swaps it; failing that, it inserts. Insertion is de-duplicated by id and re-sorted by
instant — the sender receives its own message twice (once as the response, once as the
broadcast) and must not see it twice.

**`POST /chat` is idempotent, so the front end treats it as a read.** `ChatService.create_chat`
returns the existing conversation when the pair already has one. Behaving like a read, it fits
in a TanStack query instead of a mutation, which keeps chat resolution out of a `useEffect` and
makes `/conversas/:userId` openable straight from a link.

**The route carries the contact id, not the chat id.** The contact exists as soon as
`GET /users` answers; the chat only exists after `POST /chat`. Addressing the screen by the
contact keeps the URL valid before the first message is ever sent.

**One room per conversation.** The browser emits `join-chat` and lands in `chat:<chat_id>`; the
route emits to that room only, and only after the commit — so a client is never told about a
state the database has not accepted yet. Joining is the client's job on every connection: a
reconnect gets a fresh session id, which belongs to no room.

**Two identifiers on the client, because the server offers none.** There is no `GET /auth/me`,
so the front end cannot know its own `user_id`. Since a chat here has exactly two participants,
the side of a bubble is decided by elimination — `isOutgoingMessage(message, peerId)` reads
"whoever is not the contact is me". The displayed identity is just the email that was typed at
login, kept in `localStorage`; authorization stays entirely on the server, and any `401` clears
it.

**UUIDv7 primary keys.** Identifiers use `uuid.uuid7()` (available from Python 3.14). Unlike
UUIDv4 it embeds a millisecond timestamp in its most significant bits, so it sorts by creation
time — keeping the benefit of not exposing sequential counters without the index fragmentation
UUIDv4 causes. MySQL has no native UUID column, so a `TypeDecorator` translates
`UUID` ↔ `String(36)` on the way in and out; the application sees `UUID` end to end.

**Timestamps are normalized at the column.** MySQL's `DATETIME` stores no timezone, so
`UTCDateTime` refuses a naive value on the way in, stores UTC, and hands back an aware UTC
datetime on the way out. Pydantic then serializes it with its offset, and the browser can parse
it without guessing.

## The message flow

```text
  browser A                      Flask API                      browser B
     │                               │                               │
     │  POST /auth/login             │                               │
     ├──────────────────────────────>│  session cookie (httpOnly)    │
     │                               │                               │
     │  POST /chat { receiver_id }   │                               │
     ├──────────────────────────────>│  create-or-return the pair    │
     │<── 201 { chat_id }            │                               │
     │                               │                               │
     │  socket: join-chat            │          socket: join-chat    │
     ├──────────────────────────────>│<──────────────────────────────┤
     │          both now in room  chat:<chat_id>                     │
     │                               │                               │
     ├─ optimistic bubble: "sending" │                               │
     │  POST /chat/<id>/messages     │                               │
     ├──────────────────────────────>│  row committed                │
     │                               ├── socket: new-message ───────>│
     │<── 201 { message } ───────────┤    { id, chat_id, sender_id,  │
     │                               │      content, created_at }    │
     └─ bubble replaced, "sent"                    cache write, no refetch ─┘
```

Browser A learns of its own message twice — once on the response, once on the broadcast — and
both paths call `applyIncomingMessage`. The second one is a no-op because the id already
exists. Browser B never issued a request at all.

## Data model

**`user`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String(36)` | UUIDv7, primary key |
| `email` | `String(80)` | required, unique |
| `password` | `String(255)` | Werkzeug hash, never the plaintext |
| `created_at` | `DATETIME` | naive UTC in storage, aware UTC in the application |

**`chat`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String(36)` | UUIDv7, primary key |
| `created_at` | `DATETIME` | as above |

**`chat_participant`**

| Column | Type | Notes |
| --- | --- | --- |
| `chat_id` | `String(36)` | FK → `chat.id`, part of the primary key |
| `user_id` | `String(36)` | FK → `user.id`, part of the primary key |

**`message`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `String(36)` | UUIDv7, primary key |
| `chat_id` | `String(36)` | FK → `chat.id`, required |
| `sender_id` | `String(36)` | FK → `user.id`, required |
| `content` | `Text` | required, at least 1 character |
| `created_at` | `DATETIME` | the sort key of the history |

The join table is what makes a conversation a set of participants rather than a
`user_a`/`user_b` pair. Only two rows are ever written today, but nothing in the schema says
so — the "exactly two" assumption lives in `ChatService`, not in the tables.

## Getting started

### Prerequisites

- Python 3.14 or newer (UUIDv7 requires it)
- Node.js 20 or newer
- Docker and Docker Compose

### 1. Database

The compose file lives in `backend/`, not at the root:

```bash
cd backend
docker compose up -d
```

### 2. Backend

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
pip install Flask-Migrate            # see the note below

cp .env.example .env                 # then fill it in, see Configuration
```

> **`requirements.txt` is currently missing `Flask-Migrate`**, even though `app.py` imports it
> and the `migrations/` directory is versioned here. Until the file is fixed, install it by
> hand or the app will not boot. It is the first item on the [Roadmap](#roadmap).

Create the schema:

```bash
flask db upgrade
```

Start the API — through `socketio.run`, not `flask run`, so the WebSocket transport is served:

```bash
python app.py
```

The API listens on `http://localhost:5001`.

### 3. Front end

```bash
cd frontend

npm install
cp .env.example .env

npm run dev
```

The app opens at `http://localhost:5173`. The port is fixed (`strictPort`) on purpose: it is
hardcoded in the backend's allow-lists, so falling back to 5174 would break CORS and the socket
handshake at once, with an error that points nowhere near the port.

To see the real-time path, open the app in two different browsers (or one normal window and one
private window) and log in as two different people. Two tabs of the same browser share the
session cookie, so both would be the same user.

### Configuration

**`backend/.env`**

```env
SECRET_KEY="my_secret_key"
SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:admin123@127.0.0.1:3306/sample-realtime-chat"
```

The credentials and database name match `backend/docker-compose.yml`, so these values work out
of the box for local development.

**`frontend/.env`**

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
VITE_SOCKET_PATH=/socket.io
VITE_APP_ENV=development
```

The front end talks to Flask directly — there is no Vite proxy. Two consequences, and both bite
silently if missed:

- **The origin must be allowed in two separate places.** `CORS(app, origins=[...],
  supports_credentials=True)` in [backend/app.py](backend/app.py) for the REST calls, and
  `cors_allowed_origins` in the same file's `socketio.init_app` for the Socket.IO handshake.
  Without `supports_credentials`, login answers `200` and the browser throws the cookie away.
- **Use `localhost`, not `127.0.0.1`.** The flask-login cookie is born `SameSite=Lax`, which
  only travels between origins of the same site: a different port is still the same site, a
  different host is not.

## API reference

Every route except register and login requires the session cookie.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Start a session (sets the cookie) |
| `POST` | `/auth/logout` | End the session |
| `GET` | `/users` | List every user except the caller |
| `POST` | `/chat` | Create or return the conversation with a contact |
| `POST` | `/chat/<chat_id>/messages` | Send a message; emits `new-message` |
| `GET` | `/chat/<chat_id>/messages` | Read the history, oldest first |

`<chat_id>` is validated at routing time by Flask's `<uuid:chat_id>` converter: a malformed
identifier returns `404` before reaching the view.

### Error format

Validation failures return `400` with the raw output of Pydantic's `ValidationError.errors()`
under `details`, so a client can map each failure back to its form field:

```json
{
  "error": "Invalid registration data",
  "details": [
    {
      "type": "string_too_short",
      "loc": ["password"],
      "msg": "String should have at least 8 characters",
      "input": "123",
      "ctx": { "min_length": 8 }
    }
  ]
}
```

A missing or expired session returns `401`, from flask-login's unauthorized handler:

```json
{ "error": "Authentication required" }
```

The front end treats that answer as a single event: the axios interceptor reports it once, the
`AuthProvider` clears the stored identity and the cache, and `ProtectedRoute` sends the person
back to login. No screen handles `401` on its own.

---

#### `POST /auth/register`

```json
{
  "email": "ana@example.com",
  "password": "at-least-8-chars"
}
```

**Fields** — `email` (valid address, required), `password` (string, required, minimum 8
characters).

**Returns** `201 Created`

```json
{ "message": "User created with success" }
```

**Errors** — `400` invalid payload.

---

#### `POST /auth/login`

```json
{
  "email": "ana@example.com",
  "password": "at-least-8-chars"
}
```

**Returns** `200 OK`, plus the flask-login session cookie in `Set-Cookie`.

```json
{ "message": "Successful login" }
```

The body carries no user object — no id, no email. That single omission is what shapes the
front end's identity handling; see [Design decisions](#design-decisions).

**Errors** — `400` invalid payload; `401` wrong email or password.

---

#### `GET /users`

Every registered user except the caller. This doubles as the contact list, since there is no
`GET /chats` to enumerate conversations.

**Returns** `200 OK`

```json
{
  "users": [
    {
      "id": "0199a1c2-3d4e-7f80-9a1b-2c3d4e5f6a7b",
      "email": "bruno@example.com",
      "created_at": "2026-09-02T18:04:11Z"
    }
  ]
}
```

---

#### `POST /chat`

Returns the conversation between the caller and the contact, creating it only if the pair has
none.

```json
{
  "receiver_id": "0199a1c2-3d4e-7f80-9a1b-2c3d4e5f6a7b"
}
```

**Fields** — `receiver_id` (UUID, required).

**Returns** `201 Created`

```json
{ "chat_id": "0199a1c2-88f0-7c31-b4d2-5e6f7a8b9c0d" }
```

Always `201`, even when nothing was created — the status describes the endpoint, not what
happened on this particular call.

**Errors** — `400` invalid payload, or the caller passed their own id.

---

#### `POST /chat/<chat_id>/messages`

Stores the message and emits `new-message` into `chat:<chat_id>`.

```json
{
  "content": "hello"
}
```

**Fields** — `content` (string, required, at least 1 character). The front end additionally
caps it at 2000 characters; the backend does not.

**Returns** `201 Created`

```json
{
  "message": {
    "id": "0199a1c3-11aa-7bb2-8c41-1e2f3a4b5c6d",
    "chat_id": "0199a1c2-88f0-7c31-b4d2-5e6f7a8b9c0d",
    "sender_id": "0199a1c1-0f0e-7d0c-8b0a-9a8b7c6d5e4f",
    "content": "hello",
    "created_at": "2026-09-03T14:22:07.481293Z"
  }
}
```

**Errors** — `400` invalid payload, or the caller is not a participant of that chat.

> **A non-participant gets `400`, not `403`.** The service raises `ValueError` for both
> "malformed" and "not yours", and the route maps that exception to one status. It is the same
> answer for a chat that does not exist, which at least leaks nothing — but the status is
> wrong; see the [Roadmap](#roadmap).

---

#### `GET /chat/<chat_id>/messages`

The whole history, oldest first. This is the only revalidation path the UI has: the refresh
button in the conversation header.

**Returns** `200 OK`

```json
{
  "messages": [
    {
      "id": "0199a1c3-11aa-7bb2-8c41-1e2f3a4b5c6d",
      "chat_id": "0199a1c2-88f0-7c31-b4d2-5e6f7a8b9c0d",
      "sender_id": "0199a1c1-0f0e-7d0c-8b0a-9a8b7c6d5e4f",
      "content": "hello",
      "created_at": "2026-09-03T14:22:07.481293Z"
    }
  ]
}
```

There is no pagination: a conversation is returned whole.

**Errors** — `400` the caller is not a participant of that chat.

## Real-time channel

Socket.IO is served by Flask itself, at `/socket.io`. The handshake carries the same session
cookie as the REST calls, which is why the client is created with `withCredentials: true`.

| Direction | Event | Payload | Meaning |
| --- | --- | --- | --- |
| client → server | `join-chat` | `{ "chat_id": "<uuid>" }` | Subscribe to one conversation's room |
| server → client | `new-message` | the `MessageResponse` object | A message was stored in that chat |

Rooms are named `chat:<chat_id>`. The event is emitted only to that room, and only after the
commit, so nobody is notified of a state the database has not accepted.

The payload is the exact shape `GET .../messages` returns for one item, on purpose: the client
validates it with the same Zod schema and runs it through the same camelCase transform, so a
pushed message and a fetched one are indistinguishable by the time they reach the cache.

Joining is the client's responsibility on **every** connection, not just the first — a reconnect
gets a fresh session id, which belongs to no room.

## Front end

Four screens: login, register, the chat itself, and a not-found page. The chat is a two-column
layout that collapses to one column on narrow viewports, with the conversation replacing the
contact list.

**Contacts** — `GET /users` is the list, since the backend has no notion of "my conversations".
Filtering is client-side, over the email.

**Conversation** (`/conversas/:userId`) — two chained queries: `POST /chat` resolves the chat id
for that contact, and the history query turns on once it answers. `enabled` does the
orchestration; there is no `useEffect` coordinating them.

Three decisions worth calling out:

**Nothing revalidates on its own.** No polling, no refetch on window focus, no refetch on
reconnect; `staleTime` is `Infinity`. During the REST-only phase this was deliberate — with two
tabs side by side, a focus refetch fakes real time and hides exactly the gap the channel exists
to fill. Now that the channel is in, the socket is the only thing that brings a new message
unprompted, and the refresh button is the manual fallback.

**The socket writes to the cache, not to the screen.** `useChatRealtime` subscribes, validates,
and hands the message to `applyIncomingMessage`. It renders nothing and owns no state, so
unmounting the conversation tears the subscription down without touching what the socket
connection itself is doing.

**Error feedback is centralized in the `QueryClient`.** Each call declares
`meta.errorMessageKey`; the translation and the toast happen in one place. Login and register
declare no `meta`, because they show the error inside the card instead.

The component layout — `index.tsx` for UI, `use-*.ts` for logic, `styles.ts` for styling, and
the atoms/molecules/organisms split — follows the conventions written down in
[frontend/docs/frontend-guide.md](frontend/docs/frontend-guide.md).

Visually the app commits to a "paper and ink" direction: a warm paper ground, white surfaces
separated by 1px hairlines instead of shadows, and color reserved for meaning — dark ink for
your own voice, blue for action, red for error. The conversation is the only part of the screen
that moves.

Available scripts:

```bash
npm run dev           # dev server on 5173
npm run build         # type-check and build
npm run lint          # eslint (prettier as a rule)
npm run format        # prettier over src
npm run type-check    # tsc, no emit
```

## Roadmap

- [x] `User`, `Chat`, `ChatParticipant` and `Message` modeling, with UUIDv7 and UTC column types
- [x] Alembic migrations instead of `create_all()`
- [x] Session authentication with flask-login, hashed passwords
- [x] Contact list, idempotent chat creation, message history
- [x] React front end: login, register, contacts, conversation, optimistic send
- [x] Socket.IO channel with one room per conversation
- [x] Messages pushed on `new-message` and merged into the query cache
- [ ] Add `Flask-Migrate` to `requirements.txt` — it is imported by `app.py` but not declared
- [ ] Fix `ChatService.ensure_user_is_participant`: it compares a boolean against `None`, so it
      always returns `True` and the `join-chat` guard never actually rejects anyone
- [ ] Require authentication on the socket `connect` handler — today an anonymous client
      reaches `join-chat`, where `current_user.id` raises instead of refusing
- [ ] Fix `socketIoGateway.isConnected()`: it reads `socket.connect`, the method, which is
      always truthy — it should read `socket.connected`
- [ ] Return `403` instead of `400` when the caller is not a participant of a chat
- [ ] Update the stale copy and comments left from the REST-only phase — the conversation
      header still announces that real time is coming later
- [ ] Tests: `pytest` is installed and there is no suite yet; `MessageService` and
      `ChatService` are the layers worth covering first
- [ ] `GET /auth/me`, so the client stops inferring its own identity by elimination
- [ ] `GET /chats`, so the conversation list stops being the user list
- [ ] Pagination for the message history
- [ ] Read the allowed origins from the environment instead of hardcoding `localhost:5173`

## License

Released under the [MIT License](LICENSE).
