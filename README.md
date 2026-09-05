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

The exercise: build direct messaging between two registered people. Someone signs up, opens a
conversation with anyone who has an account, and types. The message is stored, echoed back to
the sender, and pushed to whoever else is watching that conversation.

The interesting part is not the CRUD — it is that **the second browser never asked for that
message.** It arrives on a channel, out of band, and has to land in a cache the screen is
already rendering from. Getting that write to look exactly like an HTTP response — so the UI
cannot tell the two apart — is what the project is about. The optimistic bubble that appears
before the server answers is the same problem seen from the other side.

The project was built in three passes, and the seams are deliberate:

1. **REST only**, with the channel stubbed behind an interface — a null object that connected
   to nothing.
2. **Socket.IO dropped in**, without touching a single component: one call at bootstrap swapped
   the null gateway for the real one.
3. **The server learned to describe itself** — `GET /me` and `GET /chats`, plus the last message
   denormalized onto the chat row. That third pass deleted two workarounds the front end had
   been carrying: inferring its own identity by elimination, and writing a `POST /chat` every
   time someone merely *looked* at a conversation.

## Features

- **Session authentication** — register and login with flask-login, password hashed with
  Werkzeug, session kept in an httpOnly cookie the JavaScript never reads.
- **Conversation list in one request** — `GET /chats` returns each conversation already carrying
  the other participant and the last message, ordered by activity. The sidebar needs no second
  call and no cross-referencing.
- **A chat is created by talking, not by looking** — opening a conversation is a pure read; the
  row is minted on the first send, so clicking a name never leaves an empty conversation behind.
- **1:1 conversations** — `POST /chat` is create-or-return: asking twice for the same pair
  gives back the same chat, so the client needs no "does it exist" round trip.
- **Own identity from the server** — `GET /me` answers who the cookie belongs to, so which side
  of the conversation a bubble falls on is a comparison, not a guess.
- **Message history** — chronological, and readable only by a participant of that chat.
- **Push over WebSocket** — after the row is committed, the server emits `new-message` into
  the `chat:<chat_id>` room, so only the two people in that conversation are woken up.
- **Channel behind an interface** — the app talks to `RealtimeGateway`; `socket.io-client` is
  imported in exactly one file, and swapped in with a single call at bootstrap.
- **One door into the cache** — `applyIncomingMessage` is where an unrequested message lands,
  whether it came from the socket or from the `POST` response. The components never learn
  which.
- **The sidebar reorders without a refetch** — `applyChatActivity` updates the preview, the
  timestamp and the position of a conversation in the cache, mirroring the server's `ORDER BY`.
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
│   ├── exceptions/
│   │   └── chat_exceptions.py      # NotChatParticipantError, so the route can answer 403
│   ├── models/
│   │   ├── user.py                 # UserMixin, so flask-login can carry it
│   │   ├── chat.py                 # + last_message_at / last_message_id
│   │   ├── chat_participant.py     # the join table, composite primary key
│   │   └── message.py
│   ├── schemas/                    # request and response contracts (Pydantic)
│   │   ├── auth/                   # create_user_request, login_request
│   │   ├── chat/create_chat_request.py   # the request, plus the GET /chats response
│   │   ├── message/message_schemas.py
│   │   └── user/get_users_response.py    # UserResponse, reused by GET /me
│   ├── routes/                     # blueprints, one per API domain
│   │   ├── auth.py                 # register, login, logout, the user_loader
│   │   ├── user.py                 # GET /users and GET /me
│   │   └── chat.py                 # POST /chat, GET /chats and the message endpoints
│   ├── services/                   # every rule that is not HTTP
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── chat_service.py         # create-or-return, participant check, list by activity
│   │   └── message_service.py      # writes the message and the chat's last-message columns
│   ├── sockets/
│   │   └── chat_socket.py          # the `connect` guard and the `join-chat` handler
│   └── migrations/versions/        # Alembic revisions
└── frontend/
    ├── index.html
    ├── vite.config.ts              # port 5173, strictPort, the `@` alias
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
`mutationOptions` with a key factory), `*.cache.ts` where a domain writes to the cache without
going through the network, and one thin hook per operation — that last one is what the UI
imports.

### Design decisions

**The extensions live outside the factory.** `db`, `socketio` and `login_manager` are created
at module scope in `extensions.py` and only bound with `init_app`. It matters most for
`socketio`: `routes/chat.py` has to emit an event, and if the emitter only existed inside
`create_app()` the route would have to import the app to reach it. With the instance in a
neutral module the arrow always points the same way — everything imports `extensions`, nothing
imports `app`.

**The channel is behind a gateway.** `RealtimeGateway` (`realtime.contract.ts`) declares
`connect`, `disconnect`, `isConnected`, `joinChat` and `onNewMessage`; `socket-io-gateway.ts`
is the only file in the codebase that imports `socket.io-client`, and `setRealtimeGateway()`
installs it once at bootstrap. The default implementation is a null object that does nothing,
which is what let the whole REST phase ship with the seam already in place. No component, page
or hook knows the transport exists.

**A message enters the cache through one function.** `applyIncomingMessage(queryClient,
message)` writes to the same `queryKey` the conversation is already rendering from. The socket
handler calls it; so does the `POST` response path. Because the write is the same, an HTTP
answer and a pushed event produce an identical render — there is no "real-time branch" in the
UI to keep in sync with the normal one.

**The optimistic bubble is matched by content, not by id.** The client mints its own id
(`optimistic:<uuid>`) and the server mints another, so they can never be compared. When the
confirmed message arrives, the cache looks for a still-pending bubble with the same text from
the same sender and swaps it; failing that, it inserts. That fallback is not hypothetical: in a
freshly created conversation the first `GET .../messages` can land between the send and its
answer and carry the bubble away. Insertion is de-duplicated by id and re-sorted by instant —
the sender receives its own message twice (once as the response, once as the broadcast) and
must not see it twice.

**The chat id comes from the list, and `POST /chat` runs only on the first send.** Earlier the
front end resolved the id by calling the idempotent `POST /chat` every time the screen opened —
which meant browsing names wrote empty conversations into the database. Now `GET /chats` is the
source of every `chat_id`, opening a conversation is a pure read, and the only `POST /chat` in
the app lives in the composer's submit path: `chatId ?? (await createChat(...)).chatId`. A
conversation exists because someone spoke.

**The route carries the contact id, not the chat id.** The contact exists as soon as the
conversation list (or `GET /users`) answers; the chat may not exist at all. Addressing the
screen by the contact keeps the browser route `/conversations/:userId` valid before the first
message is ever sent — and still valid afterwards, because `GET /chats` returns the participant
next to each chat.

**The last message lives on the chat row.** `chat.last_message_at` and `chat.last_message_id`
are written by `MessageService.create_message` in the same commit as the message itself, so the
preview can never disagree with the history. The alternative — a correlated subquery or one
extra query per row — costs more the longer the list gets, and this list is read on every page
load. `last_message_at` is indexed because it is the sort key: `ORDER BY last_message_at DESC,
created_at DESC`, and MySQL sorts `NULL` last in `DESC`, which puts a conversation with no
message at the bottom without a special case.

**The sidebar reorders in the cache, in the server's order.** `applyChatActivity` updates the
preview and the timestamp and re-sorts the list in the same frame as the message — no request
per message received. Its comparator deliberately mirrors the backend's `ORDER BY`: if the two
ever diverge, the sidebar would jump on the next refetch. When the message belongs to a
conversation that is not in the list yet, there is nothing to patch — the participant is missing
— so it invalidates instead and lets the server assemble the row.

**One list, two modes.** The sidebar renders conversations by default and contacts when you ask
to start a new one; both use the same row component, so the difference is copy, not markup.
`GET /users` is no longer the conversation list, so it is fetched lazily: only when picking
someone, or when the browser route `/conversations/:userId` names a contact you have no
conversation with and the screen needs a name to show. People you already talk to are filtered
out of the picker.

**Identity is a query; the displayed email is still local.** `GET /me` returns the authenticated
user, and `userQueries.me` caches it with `staleTime: Infinity` — the identity cannot change
while the session lives. It is a prerequisite for rendering the history, not a decoration: with
no id there is no side, so `MessageList` shows the spinner until it arrives.
`isOutgoingMessage(message, currentUserId)` now compares the real sender instead of reasoning
"whoever is not the contact is me". The email typed at login stays in `localStorage` anyway,
because the route guard has to decide whether to render the app *before* any request goes out;
it feeds the header and nothing else. Authorization stays entirely on the server, and any `401`
clears both.

**One room per conversation.** The browser emits `join-chat` and lands in `chat:<chat_id>`; the
route emits to that room only, and only after the commit — so a client is never told about a
state the database has not accepted yet. The `connect` handler returns `False` for an
unauthenticated socket, so `join-chat` only ever runs with a `current_user`. Joining is the
client's job on every connection: a reconnect gets a fresh session id, which belongs to no room.

**Only the conversation scrolls.** `AppShell` is the single fixed height in the tree
(`height: 100dvh`, `overflow: hidden`), and the chat grid is capped at `minmax(0, 1fr)`. Without
a closed box at the top, the message list's `flex: 1` + `overflow-y: auto` resolves against its
content, never clips, and the page itself becomes the scroller — taking the header and the
sidebar with it. `dvh` rather than `vh` so the mobile address bar is accounted for.

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
     │  GET /me                      │                               │
     ├──────────────────────────────>│  own id: which side a bubble  │
     │<── 200 { id, email }          │  falls on                     │
     │                               │                               │
     │  GET /chats                   │                               │
     ├──────────────────────────────>│  each chat + peer + last msg  │
     │<── 200 { chats }              │  ordered by activity          │
     │                               │                               │
     │  socket: join-chat            │          socket: join-chat    │
     ├──────────────────────────────>│<──────────────────────────────┤
     │          both now in room  chat:<chat_id>                     │
     │                               │                               │
     ├─ optimistic bubble: "sending" │                               │
     │                               │                               │
     │  POST /chat  (first send only)│  create-or-return the pair    │
     ├──────────────────────────────>│                               │
     │<── 201 { chat_id }            │                               │
     │                               │                               │
     │  POST /chat/<id>/messages     │  one commit: the message row  │
     ├──────────────────────────────>│  and the chat's last_message  │
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
| `last_message_at` | `DATETIME` | nullable, indexed — the sort key of the conversation list |
| `last_message_id` | `String(36)` | nullable, FK → `message.id` — the preview |

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

`chat.last_message_id` and `message.chat_id` point at each other, so the two tables cannot both
be created with their constraints in one step. The column arrives in its own later revision,
with an explicitly named foreign key (`fk_chat_last_message_id_message`) — MySQL would invent a
name otherwise, and the downgrade would have nothing to drop.

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

cp .env.example .env                 # then fill it in, see Configuration
```

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
| `GET` | `/me` | The authenticated user |
| `GET` | `/users` | List every user except the caller |
| `GET` | `/chats` | The caller's conversations, with peer and last message |
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

The body carries no user object. The client learns who it is from `GET /me`; what it keeps from
the login screen is the email it already had — see [Design decisions](#design-decisions).

**Errors** — `400` invalid payload; `401` wrong email or password.

---

#### `GET /me`

Whoever the session cookie belongs to. The only way the front end can know its own `id`, since
the login response says nothing and the cookie is httpOnly.

**Returns** `200 OK` — the user at the root of the response, with no envelope:

```json
{
  "id": "0199a1c1-0f0e-7d0c-8b0a-9a8b7c6d5e4f",
  "email": "ana@example.com",
  "created_at": "2026-09-01T09:12:44Z"
}
```

---

#### `GET /users`

Every registered user except the caller. This is the picker for starting a new conversation —
not the conversation list, which is `GET /chats`.

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

#### `GET /chats`

The caller's conversations, most recently active first (`last_message_at DESC, created_at
DESC`, so a conversation with no message sinks to the bottom).

`participant` is always the *other* side: the backend drops the caller while assembling the
response, so the client has nothing to filter. `last_message` is the same object shape the
message endpoints return, which is why the sidebar can render a preview and decide "You:" with
the rules it already has.

**Returns** `200 OK`

```json
{
  "chats": [
    {
      "id": "0199a1c2-88f0-7c31-b4d2-5e6f7a8b9c0d",
      "participant": {
        "id": "0199a1c2-3d4e-7f80-9a1b-2c3d4e5f6a7b",
        "email": "bruno@example.com"
      },
      "created_at": "2026-09-03T14:20:55Z",
      "last_message_at": "2026-09-03T14:22:07.481293Z",
      "last_message": {
        "id": "0199a1c3-11aa-7bb2-8c41-1e2f3a4b5c6d",
        "chat_id": "0199a1c2-88f0-7c31-b4d2-5e6f7a8b9c0d",
        "sender_id": "0199a1c1-0f0e-7d0c-8b0a-9a8b7c6d5e4f",
        "content": "hello",
        "created_at": "2026-09-03T14:22:07.481293Z"
      }
    }
  ]
}
```

`last_message_at` and `last_message` are `null` while a conversation has no message. That is
reachable: a chat is born from a `POST /chat` followed by a `POST .../messages`, and if the
second call fails, an empty conversation is exactly what is left.

There is no pagination and no unread count.

---

#### `POST /chat`

Returns the conversation between the caller and the contact, creating it only if the pair has
none. The front end calls this once per conversation, on the first send.

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

Stores the message, updates the chat's `last_message_at` / `last_message_id` in the same commit,
and emits `new-message` into `chat:<chat_id>`.

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

**Errors** — `400` invalid payload; `403` the caller is not a participant of that chat. The
service raises a dedicated `NotChatParticipantError` for that case, which is what lets the route
tell it apart from a malformed body. A chat that does not exist gets the same `403`, which
leaks nothing about whether it is there.

---

#### `GET /chat/<chat_id>/messages`

The whole history, oldest first. This is the only revalidation path the conversation has: the
refresh button in its header.

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

**Errors** — `400` the caller is not a participant of that chat. This one still answers `400`
where the `POST` now answers `403`; see the [Roadmap](#roadmap).

## Real-time channel

Socket.IO is served by Flask itself, at `/socket.io`. The handshake carries the same session
cookie as the REST calls, which is why the client is created with `withCredentials: true` — and
why `connect` can refuse an anonymous socket by returning `False`, before any event handler
runs.

| Direction | Event | Payload | Meaning |
| --- | --- | --- | --- |
| client → server | `join-chat` | `{ "chat_id": "<uuid>" }` | Subscribe to one conversation's room |
| server → client | `new-message` | the `MessageResponse` object | A message was stored in that chat |

Rooms are named `chat:<chat_id>`. `join-chat` checks participation through
`ChatService.ensure_user_is_participant` before joining, and the event is emitted only to that
room, and only after the commit — so nobody is notified of a state the database has not
accepted.

The payload is the exact shape `GET .../messages` returns for one item, on purpose: the client
validates it with the same Zod schema and runs it through the same camelCase transform, so a
pushed message and a fetched one are indistinguishable by the time they reach the cache.

Joining is the client's responsibility on **every** connection, not just the first — a reconnect
gets a fresh session id, which belongs to no room.

Two limits worth knowing, both from there being no room per *user*: a conversation someone
starts with you does not arrive on the channel, because you are not in a room you do not know
about yet, and activity in a conversation you have never opened this session does not move your
sidebar. Both surface on the next `GET /chats` instead.

## Front end

Four screens: login (`/login`), register (`/register`), the chat itself (`/conversations` and
`/conversations/:userId`), and a not-found page. Those paths are browser routes, served by React
Router — none of them is an API endpoint. The chat is a two-column layout that collapses to one
column on narrow viewports, with the conversation replacing the contact list.

**Conversations** — `GET /chats` is the sidebar and the source of every `chat_id`. Each row
already carries the other participant and the last message, so the list renders from one
request. The timestamp gets more precise the more recent it is: today shows the time, yesterday
says "yesterday", anything older is a short date — the row is narrow, and the exact hour of a
conversation from three weeks ago is not interesting.

**Contacts** — `GET /users`, fetched only when needed: when picking someone to start a
conversation with, or when the browser route `/conversations/:userId` names a contact you have
no conversation with. Filtering is client-side, over the email and the name derived from it.

**Conversation** (browser route `/conversations/:userId`) — three reads and no write: the
identity (`GET /me`), the conversation list where the `chatId` lives, and the history, which
turns on once there is a `chatId` to ask about. `enabled` does the orchestration; there is no
`useEffect` coordinating them. When the conversation does not exist yet, `chatId` is
`undefined`, the history never fires, and the composer is still usable — the first send creates
the chat and posts into it.

Three decisions worth calling out:

**Only the history refuses to revalidate.** `messageQueries.byChat` sets `staleTime: Infinity`
and turns off refetch on window focus and on reconnect: the channel is what brings a new
message, and a periodic refetch would both repeat its work and disguise its absence. The rest of
the app keeps the client defaults (15s stale, refetch on focus) — which is exactly what makes a
conversation started by someone else eventually show up, since the channel cannot announce it.
The refresh button in the conversation header is the manual fallback for the history.

**The socket writes to the cache, not to the screen.** `useChatRealtime` subscribes, validates,
and hands the message to `applyIncomingMessage` and `applyChatActivity`. It renders nothing and
owns no state, so unmounting the conversation tears the subscription down without touching what
the socket connection itself is doing.

**Error feedback is centralized in the `QueryClient`.** Each call declares
`meta.errorMessageKey`; the translation and the toast happen in one place, and `401` is skipped
because the `AuthProvider` already reports it. Login and register declare no `meta`, because
they show the error inside the card instead.

The component layout — `index.tsx` for UI, `use-*.ts` for logic, `styles.ts` for styling, and
the atoms/molecules/organisms split — follows the conventions written down in
[frontend/docs/frontend-guide.md](frontend/docs/frontend-guide.md).

Visually the app commits to a "paper and ink" direction: a warm paper ground, white surfaces
separated by 1px hairlines instead of shadows, and color reserved for meaning — dark ink for
your own voice, blue for action, red for error. The conversation is the only part of the screen
that moves, and the only part that scrolls.

Available scripts:

```bash
npm run dev           # dev server on 5173 (strictPort)
npm run build         # type-check and build
npm run preview       # serve the build
npm run lint          # eslint (prettier as a rule)
npm run lint:fix      # eslint --fix
npm run format        # prettier over src
npm run format:check  # prettier, no writes
npm run type-check    # tsc, no emit
```

## Next steps

- [ ] A room per user (`user:<id>`), so a brand-new conversation and activity in a conversation
      you do not have open reach the sidebar over the channel instead of on the next `GET /chats`
- [ ] Leave the room when the conversation closes: `join-chat` has no counterpart, so a socket
      stays in every room it visited during that connection
- [ ] Unread counts, which the `last_message_at` column now makes cheap to compute
- [ ] Tests: `pytest` is installed and there is no suite yet; `MessageService` and
      `ChatService` are the layers worth covering first
- [ ] Pagination for the message history
- [ ] Read the allowed origins from the environment instead of hardcoding `localhost:5173`
- [ ] Move the `GET /chats` contracts out of `schemas/chat/create_chat_request.py` — the file
      outgrew its name

## License

Released under the [MIT License](LICENSE).
