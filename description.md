# **Flowboard – Workspace & Board Management App**

A full-stack **Next.js 16 App Router** project that teaches modern full-stack development with **React Server Components, API Route Handlers, data fetching, caching, authentication, and Docker**.

**Goal:** Build a Trello-style workspace + board + task management app.

---

## **Tech Stack**

### Frontend

- Next.js 16 (App Router)
- React (Server + Client Components)
- ShadCN UI (with TailwindCSS)
- React Hooks
- Drag-and-Drop (e.g., `@dnd-kit` or similar)

### Backend

- Next.js Route Handlers (no separate Express)
- MongoDB (Docker)
- Mongoose or a Mongo utility (like `mongodb` client)

### DevOps

- Docker
- Docker Compose

### AI Tools (MANDATORY)

- **Cursor** for generating code & debugging
- **ChatGPT** for design, API structure, architecture
- **Google Antigravity** for UI wireframing/UI code generation

---

## **Project Description**

Flowboard is a productivity app where users can:

✅ Create Workspaces

✅ Create Boards inside Workspaces

✅ Create & manage Tasks inside Boards

✅ Drag & drop tasks

✅ User Authentication

✅ Route protection

✅ Responsive UI with ShadCN

The goal is not just UI but mastering Next.js features like:

- Server Components
- Client Components
- Route Handlers
- App Routing & Layouts
- Middlewares/Proxy
- Caching & Revalidation

---

## **Project Requirements**

### Functional Requirements

✔ User signup and login

✔ Authentication with server-side cookies

✔ Workspaces (CRUD)

✔ Boards (CRUD)

✔ Tasks (CRUD)

✔ Drag-and-drop task reordering

✔ Real-time UI updates where possible

✔ Pagination or lazy loading for large lists

✔ Protected pages & API routes

### Technical Requirements

✔ Server Components for rendering data

✔ Client Components for interactive UI

✔ React Query (optional, but recommended) for client data caching

✔ Next.js Route Handlers for backend APIs

✔ Docker + MongoDB

✔ Tailwind + ShadCN UI

---

## Desired Learning Outcomes

By completing this project, the student will be able to:

✅ Build full-stack apps entirely in Next.js

✅ Distinguish between Server Components & Client Components

✅ Implement authentication with cookies and middleware

✅ Build reusable UI with ShadCN/Tailwind

✅ Implement drag-and-drop UI

✅ Use caching & revalidation strategies

✅ Dockerize a full-stack Next.js app with MongoDB

---

## Workspace Entities

Flowboard manages three core entities:

1. **Workspaces**
2. **Boards**
3. **Tasks**

Each Workspace has multiple Boards, and each Board contains multiple Tasks.

---

## **API Routes (Route Handlers)**

> Next.js 14 Route Handlers under app/api/*/route.js
> 

### 🧑 Auth

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create user |
| POST | `/api/auth/login` | Authenticate & set cookie |
| POST | `/api/auth/logout` | Remove cookie |

---

### 🏢 Workspaces

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces` | List user workspaces |
| GET | `/api/workspaces/:id` | Get workspace by ID |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |

---

### 📋 Boards

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:workspaceId` | Boards by workspace |
| GET | `/api/boards/id/:id` | Board by ID |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |

---

### ✔ Tasks

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/board/:boardId` | Tasks by board |
| GET | `/api/tasks/:id` | Task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/reorder` | Reorder tasks |

---

## **Data Models**

### 🧑‍💼 **User Model**

```jsx
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}

```

---

### 🏢 **Workspace Model**

```jsx
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (user),
  createdAt: Date
}

```

---

### 📋 **Board Model**

```jsx
{
  _id: ObjectId,
  title: String,
  workspaceId: ObjectId,
  position: Number,
  createdAt: Date
}

```

---

### ✔ **Task Model**

```jsx
{
  _id: ObjectId,
  boardId: ObjectId,
  title: String,
  description: String,
  position: Number,
  status: String,
  createdAt: Date
}

```

---

## **Folder Structure**

```
flowboard/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── signup/
│   │   │   └── page.js
│   ├── (dashboard)
|		|		├── workspace/
|		│   │   ├── page.js
|		│   │   ├── [workspaceId]/
|		│   │   |   └── page.js
|		|		│   ├── board/
|		|	  |		|   └── [boardId]/
|		│   │   |   └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.js
│   │   ├── workspaces/
│   │   │   ├── route.js
|		│   │   ├── boards/
|		│   │   │   └── route.js
|		│   │   ├── tasks/
|		│   │   |   └── route.js
├── components/
│   ├── ui/
│   ├── workspace/
│   ├── board/
│   └── task/
├── lib/
│   └── db.js
├── middleware.js
├── package.json
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md

```

---

## **UI Wireframes (Text-Based)**

> Use AI (Google Antigravity / ChatGPT UI descriptions) to turn these into live components
> 

### Login Page

```
+-----------------------------+
| Flowboard Logo              |
| LOGIN                       |
| [ Email Input       ]       |
| [ Password Input    ]       |
| [ Login Button      ]       |
| Or Login with OAuth         |
| Link: “New? Sign up”        |
+-----------------------------+

```

---

### Signup Page

```
+-----------------------------+
| Flowboard Logo              |
| SIGN UP                     |
| [ Full Name Input   ]       |
| [ Email Input       ]       |
| [ Password Input    ]       |
| [ Signup Button     ]       |
| Link: “Already a user? Login”|
+-----------------------------+

```

---

### Workspace Dashboard

```
+ Workspace Nav — “+ New Workspace”
|--------------------------------
| Workspace Card  | Workspace Card
| Title           | Title
| View → Button   | View → Button
| Edit / Delete   |
|--------------------------------

```

---

### Board List (Inside Workspace)

```
+ Workspace Name Header
|--------------------------------
| Board Card       | Board Card
| Board Title      | Board Title
| View Tasks →     | View Tasks →
|--------------------------------

```

---

### Board Tasks Page

```
+ Board Header
|--------------------------------
| [ Add New Task Button ]       |
|--------------------------------
| Column: Todo       Column: Doing       Column: Done
| [ Task Card ]      [ Task Card ]       [ Task Card ]
| drag →             drag →              drag →
|--------------------------------

```

> Tasks can be drag & drop between columns
> 

---

## **Important Pages (Full List)**

✔ `/login`

✔ `/signup`

✔ `/workspace` (Dashboard)

✔ `/workspace/[workspaceId]` (Boards list)

✔ `/board/[boardId]` (Tasks + drag & drop)

✔ `/api/*` route handlers

---

## Important Concepts To Use

✅ Server Components for pages that fetch data

✅ Client Components for interactive UI (drag/drop, buttons)

✅ Next.js Middleware for route protection

✅ Revalidation strategies (`revalidate`, caching headers)

✅ API errors with proper response format

✅ Protect API routes with user session

---

## Docker Setup (Overview)

Create:

- a **Dockerfile** for Next.js
- **docker-compose.yml** with Next.js + MongoDB
- environment variables management
- volumes for database persistence

---

## Development Tips

ALWAYS:

- Use **Cursor** to generate boilerplate
- Ask ChatGPT for UI logic
- Use Antigravity for UI prototype → convert to ShadCN
- Build one feature at a time

---

## Suggested Milestones

✔ Milestone 1 — Authentication Pages

✔ Milestone 2 — Workspace CRUD + UI

✔ Milestone 3 — Boards CRUD + UI

✔ Milestone 4 — Tasks CRUD + Drag & Drop

✔ Milestone 5 — Route protection + Middleware

✔ Milestone 6 — UI polish + responsive

✔ Milestone 7 — Dockerize + final deploy

---

## Final Outcome

A **professional intermediate full-stack application** fully in **Next.js**, using **modern patterns**, **dockerized**, and with **clean architecture** — ready to add real users and features.

---

---

# **IMPLEMENTATION GUIDE**

**Tech:** Next.js 16 (App Router), ShadCN UI + TailwindCSS, MongoDB (Docker)

**HTTP Client:** Axios

**Language:** TypeScript (no `any`)

**UI:** Includes Persistent Sidebar

**AI Tools:** Cursor, ChatGPT, Antigravity

---

## STEP 1 — PROJECT BOILERPLATE

### 1.1 — Create Next App

```bash
npx create-next-app@latest flowboard --typescript
```

Choose **App Router, ESLint, TailwindCSS**

---

### 1.2 — Install ShadCN UI

```bash
npx shadcn@latest init
```

Pick a few UI components (Button, Card, Sidebar, Input)

---

### 1.3 — Install Axios

```bash
npm install axios
```

Create a reusable Axios instance in:

`lib/axios.ts`

```tsx
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});
```

---

### 1.4 — Sidebar Layout

Scaffold a persistent layout at:

```
app/layout.tsx
```

with a Sidebar component:

```
components/ui/Sidebar.tsx
```

Use ShadCN UI for styling.

**AI prompt suggestion:**

> “Generate a sidebar UI with ShadCN UI that remains fixed on the left and supports navigation links.”
> 

---

## STEP 2 — MONGODB + DOCKER

### 2.1 — Docker Compose

```yaml
version: "3"
services:
  mongodb:
    image: mongo:latest
    container_name: flowboard-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:

```

Run:

```bash
docker-compose up -d
```

---

### 2.2 — DB Connection (lib/db.ts)

```tsx
import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGO_URI!);
}

```

---

## STEP 3 — AUTH

### 3.1 — User Model

`models/User.ts`

```tsx
import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
});

export const User = models.User || model<IUser>("User", userSchema);

```

---

### 3.2 — API Routes

### /api/auth/signup/route.ts

Use proper types and Axios JSON body.

---

### 3.3 — Set Cookie Session

For auth, store JWT in **httpOnly cookie**.

---

### 3.4 — Auth Proxy

Next.js 16 uses `proxy.ts` for route protection.

---

## STEP 4 — WORKSPACE MODULE

### 4.1 — Workspace Model

`models/Workspace.ts`

```tsx
import { Schema, model, models, Types } from "mongoose";

export interface IWorkspace {
  name: string;
  description: string;
  owner: Types.ObjectId;
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Workspace =
  models.Workspace || model<IWorkspace>("Workspace", workspaceSchema);

```

---

### 4.2 — API Routes

Create `app/api/workspaces/route.ts`:

✔ POST create

✔ GET list workspaces

Respond with typed responses.

---

### 4.3 — UI Page

`app/workspace/page.tsx`

Use Axios to fetch:

```tsx
const { data } = await api.get<IWorkspace[]>("/workspaces");

```

---

## STEP 5 — BOARDS MODULE

### 5.1 — Board Model

`models/Board.ts`

```tsx
import { Schema, model, models, Types } from "mongoose";

export interface IBoard {
  title: string;
  workspaceId: Types.ObjectId;
  position: number;
}

const boardSchema = new Schema<IBoard>({
  title: String,
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
  position: Number,
});

export const Board =
  models.Board || model<IBoard>("Board", boardSchema);

```

---

### 5.2 — API Routes

`app/api/boards/route.ts`

✔ POST

✔ GET by workspace

✔ PUT

✔ DELETE

Return typed JSON.

---

### 5.3 — UI Page

Dynamic route:

```
app/workspace/[workspaceId]/page.tsx

```

Axios fetch:

```tsx
const { data } = await api.get<IBoard[]>(`/boards/${workspaceId}`);

```

---

## STEP 6 — TASKS MODULE + DRAG & DROP

### 6.1 — Task Model

`models/Task.ts`

```tsx
import { Schema, model, models, Types } from "mongoose";

export interface ITask {
  boardId: Types.ObjectId;
  title: string;
  description: string;
  position: number;
  status: "todo" | "inProgress" | "done";
}

const taskSchema = new Schema<ITask>({
  boardId: { type: Schema.Types.ObjectId, ref: "Board" },
  title: String,
  description: String,
  position: Number,
  status: String,
});

export const Task =
  models.Task || model<ITask>("Task", taskSchema);

```

---

### 6.2 — API Routes

`app/api/tasks/route.ts`

✔ POST

✔ GET by board

✔ PUT

✔ DELETE

✔ PATCH reorder

Use proper response types:

```tsx
return NextResponse.json<ITask[]>(tasks);

```

---

### 6.3 — Tasks Page UI

`app/board/[boardId]/page.tsx`

Use a drag-and-drop library like `@dnd-kit/core`.

Drag & drop should update `position` of tasks.

Use Axios:

```tsx
await api.patch("/tasks/reorder", { tasks: updatedList });

```

---

## STEP 7 — SIDEBAR + SHADCN UI POLISH

**Important:** Sidebar should include navigation like:

- Home (Workspaces)
- Create Workspace
- Profile
- Logout

Use a layout component:

```
components/ui/Sidebar.tsx
```

Integrate into `app/layout.tsx`.

Sidebar should be present on all authenticated pages.

---

## STEP 8 — DATA FETCHING + CACHING

Instead of `fetch`, use Axios inside:

- Server Components
- Client Components

Always type responses.

Example in a Server Component:

```tsx
import { api } from "@/lib/axios";

export default async function Workspaces() {
  const res = await api.get<IWorkspace[]>("/workspaces");
  const workspaces = res.data;

  return (
    <div>
      {workspaces.map(ws => (
        <WorkspaceCard key={ws._id} workspace={ws} />
      ))}
    </div>
  );
}

```

---

## STEP 9 — DOCKERIZE

### 9.1 — Dockerfile

```
# Use Node 24
FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

```

---

### 9.2 — docker-compose.yml

Add service:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/taskflow
    depends_on:
      - mongodb

```

---

## STEP 10 — FINAL TEST & DEPLOY

✔ Test all auth flows

✔ Boards + Tasks + drag-and-drop

✔ API typed responses

✔ Axios error handling

✔ Sidebar navigation

✔ Dockerized run

**Optional Deploy:** Vercel / Railway

---

## BEST PRACTICES YOU MUST FOLLOW

✅ Use Axios everywhere

✅ Define proper TypeScript interfaces

✅ Never use `any`

✅ Consistent error handling (status + message)

✅ Separate UI & data logic

✅ Sidebar should always be visible after login

✅ Keep ShadCN UI consistent

---

## AI PROMPTS YOU SHOULD USE

### After creating the boilerplate and basic folder and file structure (Step 1 and Step 2):

Prompt:

Read the [Task.md](http://Task.md) file throughly, and Implement the following:

1. The boilerplate and basic folder structure (STEP 1 and STEP 2) are already implemented, so check them whether they are according to the requirements. If something is missing them configure it.
2. Read the requirements of STEP 3 — AUTH throughly and Implement it.
3. Use the best and professional practices and the practices mention in the file.

### For STEP 4 (WORKSPACE MODULE)

Prompt:

Read the [Task.md](http://Task.md) file throughly, and Implement the following:

1. Read the requirements of STEP 4 — WORKSPACE MODULE throughly and Implement it.
2. Use the best and professional practices and the practices mention in the file.

---