# NEXUS AI — AI-Powered Software Engineering & Developer Productivity Platform

![NEXUS AI](https://img.shields.io/badge/Platform-NEXUS%20AI-indigo?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready%20Frontend%20%2B%20Express%20Vite%20Gateway-emerald?style=for-the-badge)
![Target Architecture](https://img.shields.io/badge/Target%20Architecture-Java%2021%20%7C%20Spring%20Boot%203.3%20%7C%20PostgreSQL%2016-blue?style=for-the-badge)
![AI Model](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash-purple?style=for-the-badge)

---

## 1. Project Overview

**NEXUS AI** is an enterprise-grade developer productivity and software engineering platform. Rather than acting as a generic conversational bot or toy CRUD dashboard, NEXUS AI is designed as a central engineering workbench where software teams manage projects, sprints, incidents, code reviews, runtime debugging, and technical documentation—augmented with deep, context-aware AI capabilities.

The platform provides software engineers with an integrated environment that mirrors production workflows in tier-1 product software organizations:
- **Project & Microservice Management**: Multi-repository tracking with health metrics and member roles.
- **Sprint & Task Kanban**: Interactive Kanban and table views with status transitions, priority tags, and assignees.
- **Incident & Issue Tracker**: Stack trace logging, environment categorization, discussion threads, and instant AI engineering plan synthesis.
- **AI Code Review Workspace**: AST inspection, vulnerability detection, complexity profiling, and line-level refactoring diffs.
- **AI Debugging Workbench**: Root-cause analysis from raw exception stack traces with actionable patches.
- **Project Knowledge Assistant (RAG)**: Query project architecture, database models, and Spring Security boundaries using repository context.
- **AI Documentation & Test Generators**: Generate OpenAPI specs, architecture guides, and comprehensive JUnit 5 / Jest test suites with boundary condition checks.
- **GitHub Intelligence**: Repository synchronization, pull request status monitoring, and automated code health scoring (with clear demo/mock state indicators).

---

## 2. Features

### Core Modules
1. **Authentication & RBAC**:
   - Stateless JWT architecture ready for RS256 token validation.
   - User roles: `ADMIN`, `DEVELOPER`, `VIEWER` with live role-switching for UI boundary verification.
   - Pre-configured demo accounts for immediate access.
2. **Executive Engineering Dashboard**:
   - Real-time metrics: active repositories, sprint deliverables, open incidents, and review quality score.
   - Active microservices status cards.
   - Urgent P0/P1 incident alerts.
   - Live activity stream recording team actions.
3. **Project Management (`/projects` & `/projects/:id`)**:
   - 8-tab project hub: Overview, Tasks, Issues, Repository, Documentation, Scoped Project AI, Code Reviews, and Event Stream.
   - Support for multiple service categories: Backend, Frontend, Full-Stack, Infrastructure/Cache, and AI Services.
4. **Task & Sprint Management (`/tasks`)**:
   - Kanban board (To Do, In Progress, Review, Completed) with drag-free directional shift controls.
   - Filter by project, priority (Critical, High, Medium, Low), and text search.
   - Dual view modes: Kanban lanes and Sortable List table.
5. **Issue & Incident Management (`/issues`)**:
   - P0 Critical to P3 Low severity categorization.
   - Stack trace viewer with environment context tags.
   - Discussion threads with real-time comments.
   - **AI Issue Planner**: Generates structured engineering execution roadmaps.

### AI Engineering Workbenches
1. **AI Code Review (`/code-review`)**:
   - Language support: Java, TypeScript, Python, SQL, Go.
   - Evaluates: correctness, security vulnerabilities, performance bottlenecks, readability, code smells, and complexity.
   - Severity tags with line numbers, explanations, and improved code output.
   - Built-in real-world vulnerability samples (e.g. Insecure JWT Filter, SQL concatenation, React state closure bug).
2. **AI Debugging Assistant (`/debugging`)**:
   - Input: Error message, environment, stack trace, code snippet, expected vs actual behavior.
   - Returns: Probable cause, explanation, step-by-step reproduction guide, suggested code patch, and prevention advice.
3. **Project Knowledge Assistant (`/ai-assistant`)**:
   - Project-scoped RAG assistant indexed with project READMEs, architecture specifications, and Spring Boot filter chains.
   - Cites specific architecture documentation and repository classes.
4. **AI Documentation Generator (`/documentation`)**:
   - Generates README, Architecture Specifications, REST API Specs, Developer Onboarding Guides, and Tech Notes directly into project docs.
5. **AI Test Suite Generator**:
   - Synthesizes unit tests, boundary edge-cases, and Testcontainers integration suggestions with high branch coverage.

---

## 3. Architecture

NEXUS AI is built with a decoupled, clean-architecture approach:

```
[ Browser / React 19 Client SPA ]
           │
     HTTPS / REST (/api/*)
     Authorization: Bearer <jwt>
           │
           ▼
[ Express API Gateway / Server Proxy (server.ts) ]
    ├── /api/ai/code-review    ──────────► [ Google Gemini 3.8 Flash SDK ]
    ├── /api/ai/debug          ──────────► [ Google Gemini 3.8 Flash SDK ]
    ├── /api/ai/project-chat   ──────────► [ Google Gemini 3.8 Flash SDK ]
    ├── /api/ai/plan-issue     ──────────► [ Google Gemini 3.8 Flash SDK ]
    ├── /api/ai/generate-docs  ──────────► [ Google Gemini 3.8 Flash SDK ]
    └── Vite Middlewares (Dev Mode)
           │
           ▼  (Future Production Backend Connection)
[ Java 21 / Spring Boot 3.3.x Microservice ]
    ├── Spring Security 6 (Stateless JwtAuthenticationFilter)
    ├── REST Controllers (/api/v1/projects, /api/v1/tasks, etc.)
    ├── @Transactional Service Layer
    └── Spring Data JPA / Hibernate 6.5
           │
           ▼
[ PostgreSQL 16 ACID Database ]
    ├── Versioned Flyway Migrations
    └── HikariCP Connection Pooling
```

---

## 4. Tech Stack

### Frontend Client
- **Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (`^7.0.2` / Strict mode)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with JetBrains Mono / Inter typography
- **Icons**: Lucide React (`lucide-react`)
- **Animations & Layout**: Motion (`motion`)

### Server & AI Gateway
- **Runtime**: Node.js 22 LTS with `tsx` execution
- **Server Framework**: Express 4.21.2
- **AI SDK**: `@google/genai` (Gemini 3.8 Flash with structured JSON schemas)
- **Bundler**: Vite 8.3 with SPA middleware mode

### Production Backend Target (Spring Boot)
- **Language**: Java 21 LTS (Eclipse Temurin)
- **Framework**: Spring Boot 3.3.x
- **Security**: Spring Security 6 + Nimbus JOSE JWT
- **ORM & Data**: Spring Data JPA + Hibernate 6.5
- **Database**: PostgreSQL 16 + Flyway Migrations
- **Cache**: Redis Cluster + Lettuce

---

## 5. Folder Structure

```
├── .env.example                     # Environment variable declarations
├── index.html                       # HTML5 entry with fonts and metadata
├── metadata.json                    # AI Studio applet configuration & permissions
├── package.json                     # NPM script definitions and dependencies
├── server.ts                        # Express server with server-side Gemini AI & Vite middlewares
├── tsconfig.json                    # TypeScript compiler options
├── vite.config.ts                   # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── main.tsx                     # React root DOM initialization
│   ├── App.tsx                      # Top-level router and state orchestrator
│   ├── index.css                    # Tailwind CSS imports and developer code fonts
│   ├── types/
│   │   └── index.ts                 # Domain models (User, Project, Task, Issue, Review, etc.)
│   ├── data/
│   │   ├── seedData.ts              # Realistic enterprise initial seed data
│   │   └── mockStore.ts             # Persistent mock client store with localStorage sync
│   ├── services/
│   │   ├── api/
│   │   │   └── client.ts            # Fetch wrapper with Bearer JWT interceptor
│   │   ├── auth/
│   │   │   └── authService.ts       # Auth operations, roles, and profile management
│   │   ├── projects/
│   │   │   └── projectService.ts    # Projects CRUD and team membership
│   │   ├── tasks/
│   │   │   └── taskService.ts       # Tasks and status transitions
│   │   ├── issues/
│   │   │   └── issueService.ts      # Incident tracking and engineering plan attachment
│   │   ├── code-review/
│   │   │   └── codeReviewService.ts # Review persistence and retrieval
│   │   ├── debugging/
│   │   │   └── debuggingService.ts  # Debug session telemetry
│   │   ├── documentation/
│   │   │   └── docService.ts        # Technical specs and markdown docs
│   │   ├── ai/
│   │   │   └── aiService.ts         # Secure client-to-server AI endpoints
│   │   └── github/
│   │       └── githubService.ts     # Git repository abstraction with demo mode notice
│   ├── components/
│   │   ├── common/                  # Badge, CodeEditor, Modal, CommandPalette, etc.
│   │   ├── layout/                  # AppLayout, Navbar, Sidebar
│   │   ├── projects/                # CreateProjectModal
│   │   ├── tasks/                   # CreateTaskModal
│   │   ├── issues/                  # CreateIssueModal, EngineeringPlanModal
│   │   ├── docs/                    # AiDocGenModal
│   │   └── tests/                   # AiTestGenModal
│   └── pages/
│       ├── LandingPage.tsx          # Public marketing & architecture overview
│       ├── LoginPage.tsx            # Login with demo persona quick-fill
│       ├── RegisterPage.tsx         # Account creation
│       ├── DashboardPage.tsx        # High-level metrics and activity feed
│       ├── ProjectsPage.tsx         # Repositories list and management
│       ├── ProjectDetailPage.tsx    # 8-tab project hub
│       ├── TasksPage.tsx            # Sprint Kanban & List view
│       ├── IssuesPage.tsx           # Incident tracker & AI Issue Planner
│       ├── CodeReviewPage.tsx       # AST code review workbench
│       ├── DebuggingPage.tsx        # Stack trace root-cause workbench
│       ├── AiAssistantPage.tsx      # Project-scoped RAG assistant
│       ├── DocumentationPage.tsx    # Specifications & AI doc generator
│       ├── GithubPage.tsx           # Repository intelligence (with demo tag)
│       ├── SettingsPage.tsx         # Spring Boot & PostgreSQL backend specs
│       ├── ProfilePage.tsx          # Developer stats and assigned deliverables
│       └── NotFoundPage.tsx         # 404 handler
```

---

## 6. Local Setup

### Prerequisites
- Node.js 20+ or 22 LTS
- npm 10+

### Steps
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` in `.env`.
3. Launch the full-stack developer server:
   ```bash
   npm run dev
   ```
4. Access the workbench at `http://localhost:3000`.

---

## 7. Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key (server-side only, never sent to browser) | Injected by AI Studio |
| `PORT` | Local dev and production server port | `3000` |
| `NODE_ENV` | Application environment mode | `development` / `production` |
| `VITE_SPRING_BACKEND_URL` | Optional URL for Java Spring Boot backend proxy | `http://localhost:8080/api/v1` |

---

## 8. AI Architecture

NEXUS AI adheres strictly to modern full-stack LLM security practices:
1. **Server-Side Exclusivity**: The browser bundle never imports `@google/genai` or accesses raw secret keys. All AI queries pass through Express endpoints in `server.ts`.
2. **Model Selection**: Uses `gemini-3.8-flash` for high throughput, low latency, and deterministic reasoning.
3. **Structured Schemas**: Leverages `responseMimeType: "application/json"` and `responseSchema` with `@google/genai` `Type` definitions for predictable JSON output.
4. **Resilient Fallback**: If the external Gemini API is unreachable or unconfigured, the server returns an intelligent, structured static analysis response so the application remains 100% operational.

---

## 9. Future Java/Spring Boot Backend Architecture

The frontend is architected so that replacing mock adapters with the production Spring Boot service requires zero refactoring of UI components. The target backend consists of:
- **`SecurityConfig.java`**: Spring Security 6 filter chain configuring `JwtAuthenticationFilter`, `CorsConfigurationSource`, and `@EnableMethodSecurity`.
- **`ProjectController.java`**: Exposes `/api/v1/projects` with `@PreAuthorize("hasRole('DEVELOPER')")`.
- **`TaskController.java`**: Exposes `/api/v1/tasks` with patch operations for status updates.
- **`IssueController.java`**: Exposes `/api/v1/issues` with stack trace ingestion.
- **`AiOrchestrationService.java`**: Invokes Google GenAI Java SDK or REST endpoints.

---

## 10. Database Design (PostgreSQL 16)

```sql
-- Core users table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'DEVELOPER',
    department VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects repository table
CREATE TABLE projects (
    id VARCHAR(64) PRIMARY KEY,
    key VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(32) NOT NULL,
    repository_url VARCHAR(512),
    default_branch VARCHAR(64) DEFAULT 'main',
    health VARCHAR(32) DEFAULT 'HEALTHY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    assignee_id VARCHAR(64) REFERENCES users(id),
    reporter_id VARCHAR(64) REFERENCES users(id),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issues & exceptions table
CREATE TABLE issues (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    priority VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    environment VARCHAR(255),
    stack_trace TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 11. Security Considerations

- **Stateless Authentication**: Zero HTTP sessions on the backend; all requests authenticate via RSA-256 signed JWTs.
- **Role-Based Authorization (RBAC)**: Strict role boundaries (`ADMIN`, `DEVELOPER`, `VIEWER`). Administrative actions (e.g. deleting repositories) are gated in both UI and API contracts.
- **Input Sanitization**: All form inputs, stack traces, and code review payloads are sanitized against XSS and injection.
- **Safe Error Boundaries**: Exception traces presented to users never reveal internal infrastructure credentials.

---

## 12. Testing Strategy

1. **Unit Testing**: JUnit 5 + Mockito for Java backend services; Vitest + React Testing Library for frontend component validation.
2. **Integration Testing**: Testcontainers spinning up genuine PostgreSQL 16 and Redis instances during `mvn verify`.
3. **AI Verification**: Unit test generation endpoint validates boundary edge cases and expected branch coverage.

---

## 13. Deployment

- **Containerized Build**: Multi-stage Dockerfile packaging Vite frontend and Spring Boot microservice.
- **Health Checks**: Monitored via Spring Boot Actuator (`/actuator/health` and `/actuator/prometheus`).
- **Cloud Run / Container Engine**: Hosted on managed container services with auto-scaling.

---

## 14. GitHub Setup

In this version, GitHub repository integration is clearly marked as **Demo / Mock Mode** to maintain software engineering honesty. In the production deployment:
1. Register a GitHub OAuth App with scopes: `read:user`, `repo`.
2. Configure client secrets securely in backend environment variables.
3. Replace `githubService.ts` mock responses with live Octokit REST endpoints.

---

## 15. Future Improvements

- [ ] Webhook listener for automatic PR code review on every pull request creation.
- [ ] Distributed vector database (e.g. pgvector) for automated embedding indexing of all repository source files.
- [ ] WebSocket streaming for real-time live code review diff generation.
- [ ] Integration with Jira and Linear issue trackers.
