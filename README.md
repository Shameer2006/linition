# Linition - Project & Task Management

Linition is a premium, high-performance project and task management application built with the modern Next.js App Router. It is designed with a sleek, glassmorphic UI, smooth micro-animations, and powerful real-time collaboration features inspired by industry leaders like Notion and Linear.

## ✨ Features

- **Advanced Authentication:** Secure credential-based login (with bcrypt password hashing) and Google OAuth integration powered by NextAuth.js (Auth.js v5).
- **Multiplayer Collaboration:** Invite teammates to projects using an email-based invitation system. Experience live-syncing of tasks and project states across multiple users without manual page refreshes.
- **Project Workspaces:** Organize tasks into dedicated projects. Track project start/end dates, overall progress, and completion rates.
- **Task Management:** Create, edit, and prioritize tasks (Low, Medium, High). Track statuses (Pending, In Progress, Completed) and set due dates.
- **Dynamic Dashboard:** Get a bird's-eye view of your productivity with a real-time analytics dashboard featuring progress bars, upcoming tasks, and recent projects.
- **Premium Aesthetics:** Built entirely with a custom, high-end CSS design system featuring tailored color palettes, blurred glassmorphic cards, glowing gradients, and fluid CSS animations.

---

## 📂 Project Directory Structure

Below is the directory layout of the Linition application, outlining the responsibility of each folder and key file:

```text
linition/
├── prisma/                  # Database configuration and migrations
│   └── schema.prisma        # Prisma ORM schema defining User, Project, Member, and Task models
├── public/                  # Static assets (images, icons, vectors)
├── scripts/                 # Server utilities and migration scripts
│   └── migrate-members.ts   # Database migration script (for migrating old single-user setups)
├── src/                     # Core application source code
│   ├── app/                 # Next.js App Router (pages and API routes)
│   │   ├── (authenticated)/ # Logged-in application screens (Dashboard, Projects, etc.)
│   │   │   ├── dashboard/   # Dashboard analytics and overview
│   │   │   ├── invitations/ # Accept/Reject project invitation UI
│   │   │   ├── projects/    # Project list view & [id] workspace Kanban board
│   │   │   ├── tasks/       # Task manager list view
│   │   │   ├── layout.tsx   # Sidebar wrapper layout for authenticated users
│   │   │   └── page.tsx     # NextAuth redirection helper
│   │   ├── api/             # Backend API endpoint routes
│   │   │   ├── auth/        # NextAuth v5 endpoints & User Registration API
│   │   │   ├── invitations/ # APIs for managing invites (/api/invitations)
│   │   │   ├── projects/    # APIs for managing projects & members (/api/projects)
│   │   │   └── tasks/       # APIs for managing task items (/api/tasks)
│   │   ├── favicon.ico      # App icon
│   │   ├── globals.css      # Custom HSL-driven design tokens & CSS system
│   │   ├── layout.tsx       # Root layout defining document structure and Google fonts
│   │   └── page.tsx         # Public landing/hero page
│   ├── components/          # Shared reusable React UI components
│   │   ├── ShareModal.tsx   # Modal interface to invite other users to a project
│   │   └── Sidebar.tsx      # Sidebar navigation & Pending invitations notifications
│   ├── lib/                 # Utility libraries, adapter bindings, and helpers
│   │   ├── auth.ts          # Auth.js / NextAuth v5 handler & login providers configuration
│   │   ├── prisma.ts        # PrismaClient connection pool setup with pg-adapter
│   │   └── validations.ts   # Zod validation schemas (registration, project/task CRUD)
│   ├── proxy.ts             # Custom route-protection middleware proxy
│   └── types/               # Custom global TypeScript declarations
├── .env                     # Local environment variables configuration file (git-ignored)
├── next.config.ts           # Next.js framework configuration
├── prisma.config.ts         # Custom prisma config override loader
└── package.json             # NPM dependencies, scripts, and runtime engines configuration
```

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (using `@prisma/adapter-pg` pool connector)
- **Authentication:** [NextAuth.js v5 (Auth.js)](https://next-auth.js.org/)
- **Styling:** Vanilla CSS (Custom Design System, no external UI libraries)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Form Validation:** Zod

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running [PostgreSQL](https://www.postgresql.org/) database.

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/projectmanager?schema=public"

# NextAuth secret for encrypting sessions (generate via `openssl rand -base64 32`)
AUTH_SECRET="your_nextauth_secret_here"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

# Google OAuth credentials for social login
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Database Initialization

Push the database schema and generate the Prisma Client:

```bash
npx prisma db push
```

*(Note: If you are upgrading from an older single-user version of the database to the new multi-user collaboration schema, run the migration script: `npx tsx scripts/migrate-members.ts`)*

### 4. Running the Application

Start the development server with Turbopack for ultra-fast compilation:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Database Design

The application uses a highly relational PostgreSQL schema managed by Prisma:

- **`User`**: Handles authentication, registration, and user profile data.
- **`Project`**: The core workspace entity.
- **`ProjectMember`**: A join table mapping Users to Projects, enabling multiplayer collaboration with distinct roles (`OWNER`, `MEMBER`, `VIEWER`) and statuses (`PENDING`, `ACCEPTED`, `REJECTED`).
- **`Task`**: Individual action items belonging to a specific project.

### Collaboration Infrastructure
Collaboration is achieved by checking user permissions against the `ProjectMember` table. For a seamless user experience, the application utilizes optimized background polling, continuously fetching lightweight delta updates to automatically synchronize task states across all active clients in real-time.
