# Project Reference & Developer Prompt

**Role**: You are an Expert Senior Full-Stack Next.js Developer with a strong eye for premium, modern UI/UX design.

**Task**: Build a complete Project and Task Management Web Application from scratch.

**Design Aesthetic (CRITICAL)**:
The application MUST look and feel like a hybrid between **Notion** and **Linear**.
- Implement a dark mode by default.
- Use a persistent, collapsible sidebar for navigation.
- Implement glassmorphism, subtle micro-animations on hover/click, and modern typography (e.g., Inter or Geist).
- Use Tailwind CSS and Shadcn UI (or Radix UI primitives) to build highly polished, responsive components.
- Do NOT use emojis. Strictly use SVG icons (e.g., Lucide React).

**Tech Stack**:
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Backend**: Next.js Route Handlers (`/api/*`) following RESTful architecture.
- **Database**: PostgreSQL paired with Prisma ORM.
- **Validation**: Zod (for both frontend forms and backend API payloads).
- **Authentication**: NextAuth.js configured with Google Authentication for secure session management via HttpOnly cookies.

**Functional Requirements**:
1. **Authentication**: Login/Logout via Google OAuth. 
2. **Project Management**: CRUD operations for projects (Fields: Name, Description, Status [Not Started, In Progress, Completed], Start Date, End Date).
3. **Task Management**: CRUD operations for tasks within a project (Fields: Name, Description, Priority [Low, Medium, High], Status [Pending, In Progress, Completed], Due Date).
4. **Dashboard**: A dynamic overview showing Total Projects, Total Tasks, Completed Tasks, Pending Tasks, and Projects In Progress.
5. **Search & Filter**: Search projects/tasks by name. Filter projects by status. Filter tasks by status and priority.

**Security & Authorization Requirements**:
- **Data Isolation**: Users must ONLY be able to view, edit, and delete their own projects and tasks. Verify ownership on every backend request.
- **API Protection**: Protected routes must require a valid NextAuth session. Do not expose sensitive user data in responses.
- **Database Security**: Prevent SQL injection by strictly using Prisma ORM methods.
- **Input Validation**: Validate all incoming API requests (empty strings, invalid dates, enum values) and return appropriate HTTP errors.

**Required API Endpoints**:
- `GET`, `POST`, `PUT`, `DELETE` for `/api/projects` and `/api/projects/{id}`
- `GET`, `POST`, `PUT`, `DELETE` for `/api/tasks` and `/api/tasks/{id}`

**Deliverables**:
- A clean, well-architected Next.js codebase.
- A Prisma Schema file representing the normalized relational database.
- A README with local setup instructions, environment variables, and API documentation.
