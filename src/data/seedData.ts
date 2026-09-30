import {
  User,
  Project,
  Task,
  Issue,
  Document,
  Repository,
  PullRequest,
  Commit,
  CodeReviewResult,
  DebugSession,
  ActivityLog,
  DashboardMetrics,
} from '../types';

export const CURRENT_DEMO_USER: User = {
  id: 'usr-001',
  name: 'Alex Chen',
  email: 'alex.chen@nexusai.dev',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  department: 'Core Platform Engineering',
  githubUsername: 'alexchen-dev',
  createdAt: '2026-01-15T08:00:00Z',
};

export const DEMO_TEAM_MEMBERS: User[] = [
  CURRENT_DEMO_USER,
  {
    id: 'usr-002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@nexusai.dev',
    role: 'DEVELOPER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    department: 'Backend Architecture',
    githubUsername: 'sarah-j-tech',
    createdAt: '2026-01-20T09:30:00Z',
  },
  {
    id: 'usr-003',
    name: 'Marcus Vance',
    email: 'marcus.v@nexusai.dev',
    role: 'DEVELOPER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    department: 'Frontend Infrastructure',
    githubUsername: 'marcus-vance',
    createdAt: '2026-02-01T10:15:00Z',
  },
  {
    id: 'usr-004',
    name: 'Elena Rostova',
    email: 'elena.r@nexusai.dev',
    role: 'VIEWER',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    department: 'Product Management',
    githubUsername: 'elena-rostova',
    createdAt: '2026-02-10T11:00:00Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    key: 'CORE',
    name: 'Nexus Core Backend',
    description: 'Enterprise Java 21 / Spring Boot 3.3 microservice providing JWT auth, tenant isolation, and REST APIs.',
    category: 'BACKEND',
    repositoryUrl: 'https://github.com/nexus-org/nexus-core-backend',
    defaultBranch: 'main',
    members: [
      { userId: 'usr-001', userName: 'Alex Chen', userEmail: 'alex.chen@nexusai.dev', role: 'ADMIN', joinedAt: '2026-01-15' },
      { userId: 'usr-002', userName: 'Sarah Jenkins', userEmail: 'sarah.j@nexusai.dev', role: 'DEVELOPER', joinedAt: '2026-01-20' },
      { userId: 'usr-004', userName: 'Elena Rostova', userEmail: 'elena.r@nexusai.dev', role: 'VIEWER', joinedAt: '2026-02-10' },
    ],
    health: 'HEALTHY',
    openIssuesCount: 4,
    pendingTasksCount: 6,
    recentReviewsCount: 12,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-09-28T14:20:00Z',
  },
  {
    id: 'proj-02',
    key: 'WEB',
    name: 'Nexus Developer Portal',
    description: 'Modern React 19 + TypeScript engineering workbench, code intelligence dashboard, and telemetry frontend.',
    category: 'FRONTEND',
    repositoryUrl: 'https://github.com/nexus-org/nexus-web-portal',
    defaultBranch: 'main',
    members: [
      { userId: 'usr-001', userName: 'Alex Chen', userEmail: 'alex.chen@nexusai.dev', role: 'ADMIN', joinedAt: '2026-01-15' },
      { userId: 'usr-003', userName: 'Marcus Vance', userEmail: 'marcus.v@nexusai.dev', role: 'DEVELOPER', joinedAt: '2026-02-01' },
    ],
    health: 'HEALTHY',
    openIssuesCount: 2,
    pendingTasksCount: 5,
    recentReviewsCount: 8,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-09-29T16:45:00Z',
  },
  {
    id: 'proj-03',
    key: 'CACHE',
    name: 'Distributed Cache Layer',
    description: 'Low-latency Redis cluster manager with write-through PostgreSQL synchronization and auto-eviction policy.',
    category: 'INFRASTRUCTURE',
    repositoryUrl: 'https://github.com/nexus-org/nexus-cache-engine',
    defaultBranch: 'master',
    members: [
      { userId: 'usr-002', userName: 'Sarah Jenkins', userEmail: 'sarah.j@nexusai.dev', role: 'DEVELOPER', joinedAt: '2026-02-15' },
    ],
    health: 'NEEDS_ATTENTION',
    openIssuesCount: 3,
    pendingTasksCount: 4,
    recentReviewsCount: 5,
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-09-27T10:10:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    title: 'Migrate Spring Security to Stateless Bearer JWT Filter Chain',
    description: 'Ensure all /api/v1/* routes enforce JWT claims validation with RSA public key verification and expired token handling.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: DEMO_TEAM_MEMBERS[1], // Sarah
    reporter: CURRENT_DEMO_USER,
    labels: ['security', 'spring-boot', 'jwt'],
    dueDate: '2026-10-05',
    estimatedHours: 12,
    createdAt: '2026-09-24T09:00:00Z',
    updatedAt: '2026-09-29T11:30:00Z',
  },
  {
    id: 'task-102',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    title: 'Implement HikariCP connection pool monitoring endpoint',
    description: 'Expose micrometer metric for active, idle, and max pool connections in PostgreSQL cluster.',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: DEMO_TEAM_MEMBERS[1],
    reporter: CURRENT_DEMO_USER,
    labels: ['monitoring', 'postgresql', 'metrics'],
    dueDate: '2026-10-12',
    estimatedHours: 8,
    createdAt: '2026-09-26T14:00:00Z',
    updatedAt: '2026-09-26T14:00:00Z',
  },
  {
    id: 'task-103',
    projectId: 'proj-02',
    projectName: 'Nexus Developer Portal',
    title: 'Build Code Review diff highlighting and suggestion card',
    description: 'Add line number gutter, syntax highlighting, and inline AI suggested replacements.',
    status: 'REVIEW',
    priority: 'HIGH',
    assignee: DEMO_TEAM_MEMBERS[2], // Marcus
    reporter: CURRENT_DEMO_USER,
    labels: ['ui', 'react', 'code-review'],
    dueDate: '2026-10-02',
    estimatedHours: 16,
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'task-104',
    projectId: 'proj-02',
    projectName: 'Nexus Developer Portal',
    title: 'Command Palette (Cmd+K) global shortcut navigation',
    description: 'Allow engineers to quick-jump to projects, issues, code reviews, and debug sessions.',
    status: 'DONE',
    priority: 'MEDIUM',
    assignee: CURRENT_DEMO_USER,
    reporter: CURRENT_DEMO_USER,
    labels: ['productivity', 'navigation', 'ux'],
    dueDate: '2026-09-28',
    estimatedHours: 6,
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-28T18:00:00Z',
  },
  {
    id: 'task-105',
    projectId: 'proj-03',
    projectName: 'Distributed Cache Layer',
    title: 'Prevent cache stampede on tenant permission invalidation',
    description: 'Implement distributed locking with Redlock during token revocation cache refreshes.',
    status: 'TODO',
    priority: 'CRITICAL',
    assignee: DEMO_TEAM_MEMBERS[1],
    reporter: CURRENT_DEMO_USER,
    labels: ['redis', 'concurrency', 'p0'],
    dueDate: '2026-10-04',
    estimatedHours: 14,
    createdAt: '2026-09-27T11:00:00Z',
    updatedAt: '2026-09-27T11:00:00Z',
  },
  {
    id: 'task-106',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    title: 'Flyway migration script for audit_logs table partition',
    description: 'Partition audit_logs table by monthly range to maintain sub-10ms query times.',
    status: 'DONE',
    priority: 'LOW',
    assignee: DEMO_TEAM_MEMBERS[1],
    reporter: CURRENT_DEMO_USER,
    labels: ['database', 'flyway', 'postgresql'],
    dueDate: '2026-09-25',
    estimatedHours: 4,
    createdAt: '2026-09-18T13:00:00Z',
    updatedAt: '2026-09-25T17:00:00Z',
  },
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-201',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    title: 'LazyInitializationException in UserService.getUserWithProjects()',
    description: 'When accessing user.getProjects() outside transaction boundary, Hibernate throws LazyInitializationException during JSON serialization.',
    severity: 'HIGH',
    priority: 'HIGH',
    status: 'OPEN',
    assignee: DEMO_TEAM_MEMBERS[1],
    reporter: CURRENT_DEMO_USER,
    labels: ['hibernate', 'jpa', 'spring-boot'],
    environment: 'Spring Boot 3.3.0, PostgreSQL 16, Java 21',
    stackTrace: `org.hibernate.LazyInitializationException: could not initialize proxy [com.nexus.entity.Project#42] - no Session
    at org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:169)
    at com.nexus.service.UserService.getUserWithProjects(UserService.java:87)
    at com.nexus.controller.UserController.getUserProfile(UserController.java:45)`,
    comments: [
      {
        id: 'comm-1',
        issueId: 'iss-201',
        author: DEMO_TEAM_MEMBERS[1],
        content: 'We need to either use a `@EntityGraph(attributePaths = {"projects"})` on the repository method or return a projected DTO instead of the raw entity.',
        createdAt: '2026-09-28T12:00:00Z',
      },
    ],
    createdAt: '2026-09-28T10:15:00Z',
    updatedAt: '2026-09-28T12:00:00Z',
  },
  {
    id: 'iss-202',
    projectId: 'proj-03',
    projectName: 'Distributed Cache Layer',
    title: 'RedisConnectionFailureException during failover switch',
    description: 'Lettuce client fails to refresh topology when AWS ElastiCache replica promotes to primary.',
    severity: 'CRITICAL',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    assignee: DEMO_TEAM_MEMBERS[1],
    reporter: CURRENT_DEMO_USER,
    labels: ['redis', 'lettuce', 'infrastructure'],
    environment: 'Redis 7.2 Cluster, Lettuce 6.3',
    stackTrace: `io.lettuce.core.RedisConnectionException: Unable to connect to redis-cluster-node-01:6379
    at io.lettuce.core.RedisClient.connect(RedisClient.java:214)
    at com.nexus.cache.RedisClusterManager.acquireLock(RedisClusterManager.java:94)`,
    comments: [],
    createdAt: '2026-09-27T08:45:00Z',
    updatedAt: '2026-09-29T09:30:00Z',
  },
  {
    id: 'iss-203',
    projectId: 'proj-02',
    projectName: 'Nexus Developer Portal',
    title: 'CORS Preflight rejection on custom X-Nexus-Tenant header',
    description: 'Browser blocks OPTIONS preflight when frontend includes tenant headers in non-simple requests.',
    severity: 'MEDIUM',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignee: DEMO_TEAM_MEMBERS[2],
    reporter: CURRENT_DEMO_USER,
    labels: ['cors', 'security', 'frontend'],
    environment: 'Chrome 128, Vite Dev Server, Express Gateway',
    comments: [
      {
        id: 'comm-2',
        issueId: 'iss-203',
        author: DEMO_TEAM_MEMBERS[2],
        content: 'Added `X-Nexus-Tenant` to `allowedHeaders` in CorsConfigurationSource. Resolved.',
        createdAt: '2026-09-29T14:10:00Z',
      }
    ],
    createdAt: '2026-09-26T15:20:00Z',
    updatedAt: '2026-09-29T14:10:00Z',
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    projectId: 'proj-01',
    title: 'NEXUS Architecture Specification (Spring Boot & PostgreSQL)',
    type: 'ARCHITECTURE',
    content: `# NEXUS Core System Architecture

## Overview
NEXUS Core is architected as an enterprise-grade backend service built on **Java 21** and **Spring Boot 3.3.x**, backed by **PostgreSQL 16**.

\`\`\`
[ Client / Web Portal ]
           |
     HTTPS / REST
           v
[ Spring Security Filter Chain ]
    - JwtAuthenticationFilter (RSA-256)
    - TenantContextFilter
    - RateLimitFilter (Bucket4j)
           |
           v
[ REST Controller Layer ]
    - AuthController (/api/auth)
    - ProjectController (/api/projects)
    - TaskController (/api/tasks)
    - CodeReviewController (/api/code-reviews)
           |
           v
[ Domain Service Layer (@Transactional) ]
    - ProjectService
    - TaskManagementService
    - AiOrchestrationService
           |
           v
[ Spring Data JPA Repositories ]
           |
     HikariCP Pool
           v
[ PostgreSQL 16 (ACID Relational Store) ]
\`\`\`

## Key Architectural Principles
1. **Stateless Security**: Zero HTTP sessions. JWT tokens signed with RS256 algorithm.
2. **Domain-Driven Isolation**: Business logic encapsulated in service transactions.
3. **Repository Abstraction**: Clean JPA interfaces ready for read replicas and audit listeners.
4. **API First**: OpenAPI 3.0 specs generated from Springdoc for client parity.`,
    author: CURRENT_DEMO_USER,
    tags: ['architecture', 'spring-boot', 'postgresql', 'security'],
    version: '1.2.0',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'doc-002',
    projectId: 'proj-01',
    title: 'REST API Specification v1.0',
    type: 'API_SPEC',
    content: `# NEXUS Core REST API Specification

Base URL: \`/api/v1\`
Authorization Header: \`Bearer <jwt_token>\`

## Authentication
- \`POST /api/auth/login\` - User authentication, returns JWT and user profile
- \`POST /api/auth/register\` - Create new developer account
- \`POST /api/auth/refresh\` - Refresh expired token with rotating refresh token
- \`GET  /api/auth/me\` - Retrieve current authenticated principal

## Projects
- \`GET  /api/projects\` - List all accessible projects for current tenant
- \`POST /api/projects\` - Create new project
- \`GET  /api/projects/{id}\` - Get project overview, members, and health
- \`PUT  /api/projects/{id}\` - Update project details
- \`DELETE /api/projects/{id}\` - Soft-delete project (Admin only)

## Tasks & Issues
- \`GET  /api/tasks?projectId={id}&status={status}\` - Query tasks
- \`POST /api/tasks\` - Create new task
- \`PATCH /api/tasks/{id}/status\` - Update task status
- \`GET  /api/issues\` - Query repository issues with stack traces

## AI Workbenches
- \`POST /api/ai/code-review\` - Static code analysis & LLM review
- \`POST /api/ai/debug\` - Root cause analysis from stack trace
- \`POST /api/ai/plan-issue\` - Structured engineering implementation plan`,
    author: CURRENT_DEMO_USER,
    tags: ['api', 'rest', 'specs'],
    version: '1.0.0',
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'doc-003',
    projectId: 'proj-01',
    title: 'Developer Onboarding & Local Environment Guide',
    type: 'ONBOARDING',
    content: `# Engineer Onboarding Guide

Welcome to the NEXUS engineering team! Follow this guide to bootstrap your local workstation.

## Prerequisites
- JDK 21 (Eclipse Temurin recommended)
- Node.js 22 LTS & npm 10+
- Docker Engine & Docker Compose
- Maven 3.9+

## 1. Clone & Bootstrap Infrastructure
\`\`\`bash
git clone https://github.com/nexus-org/nexus-core-backend.git
cd nexus-core-backend
docker compose up -d postgres redis
\`\`\`

## 2. Configure Environment Variables
Copy \`.env.example\` to \`.env\`.
Ensure \`DATABASE_URL=jdbc:postgresql://localhost:5432/nexus_db\` and \`GEMINI_API_KEY\` is configured.

## 3. Run Database Migrations
\`\`\`bash
mvn flyway:migrate
\`\`\`

## 4. Run Test Suite
\`\`\`bash
mvn clean verify
\`\`\`

## 5. Coding Standards
- Format with Google Java Format before PR submission.
- Ensure all public REST endpoints have corresponding integration tests using \`@SpringBootTest\` and \`Testcontainers\`.`,
    author: DEMO_TEAM_MEMBERS[1],
    tags: ['onboarding', 'setup', 'guide'],
    version: '1.1.0',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-09-15T16:00:00Z',
  },
];

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'repo-01',
    name: 'nexus-core-backend',
    fullName: 'nexus-org/nexus-core-backend',
    description: 'Enterprise Java Spring Boot microservice handling OAuth2, JWT verification, and API routing.',
    url: 'https://github.com/nexus-org/nexus-core-backend',
    isPrivate: true,
    defaultBranch: 'main',
    starsCount: 38,
    forksCount: 12,
    openIssuesCount: 4,
    updatedAt: '2026-09-29T14:30:00Z',
    isMockData: true,
  },
  {
    id: 'repo-02',
    name: 'nexus-web-portal',
    fullName: 'nexus-org/nexus-web-portal',
    description: 'React 19 + TypeScript developer workstation, AI assistant integration, and project manager.',
    url: 'https://github.com/nexus-org/nexus-web-portal',
    isPrivate: true,
    defaultBranch: 'main',
    starsCount: 45,
    forksCount: 9,
    openIssuesCount: 2,
    updatedAt: '2026-09-30T02:15:00Z',
    isMockData: true,
  },
  {
    id: 'repo-03',
    name: 'nexus-cache-engine',
    fullName: 'nexus-org/nexus-cache-engine',
    description: 'Redis cluster synchronization daemon with PostgreSQL CDC (Change Data Capture) pipeline.',
    url: 'https://github.com/nexus-org/nexus-cache-engine',
    isPrivate: false,
    defaultBranch: 'master',
    starsCount: 19,
    forksCount: 3,
    openIssuesCount: 3,
    updatedAt: '2026-09-28T09:00:00Z',
    isMockData: true,
  },
];

export const INITIAL_COMMITS: Commit[] = [
  {
    id: 'cmt-1',
    repositoryId: 'repo-01',
    sha: '8f3e2b1',
    message: 'feat(auth): add RSA-256 JWT claim verification and token blacklist in Redis',
    author: { name: 'Sarah Jenkins', email: 'sarah.j@nexusai.dev' },
    timestamp: '2026-09-29T13:40:00Z',
    additions: 142,
    deletions: 18,
    branch: 'main',
  },
  {
    id: 'cmt-2',
    repositoryId: 'repo-02',
    sha: '4a91c89',
    message: 'refactor(ui): streamline code-review editor with syntax highlighting and diff cards',
    author: { name: 'Marcus Vance', email: 'marcus.v@nexusai.dev' },
    timestamp: '2026-09-29T16:20:00Z',
    additions: 280,
    deletions: 64,
    branch: 'main',
  },
  {
    id: 'cmt-3',
    repositoryId: 'repo-01',
    sha: '2b77d44',
    message: 'fix(jpa): add EntityGraph to prevent N+1 query in project team query',
    author: { name: 'Alex Chen', email: 'alex.chen@nexusai.dev' },
    timestamp: '2026-09-28T11:15:00Z',
    additions: 24,
    deletions: 8,
    branch: 'main',
  },
  {
    id: 'cmt-4',
    repositoryId: 'repo-03',
    sha: '9c5e31a',
    message: 'chore(config): configure lettuce cluster topology refresh period to 30s',
    author: { name: 'Sarah Jenkins', email: 'sarah.j@nexusai.dev' },
    timestamp: '2026-09-27T15:00:00Z',
    additions: 12,
    deletions: 3,
    branch: 'master',
  },
];

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-1',
    repositoryId: 'repo-01',
    number: 42,
    title: 'feat: implement JWT token rotation and Spring Security filter chain',
    description: 'Replaces in-memory authentication with stateless JWT validation using RS256 keys. Includes unit tests for expired token responses.',
    author: DEMO_TEAM_MEMBERS[1],
    status: 'OPEN',
    sourceBranch: 'feat/jwt-security-filter',
    targetBranch: 'main',
    reviewStatus: 'APPROVED',
    createdAt: '2026-09-28T14:00:00Z',
    updatedAt: '2026-09-29T17:00:00Z',
  },
  {
    id: 'pr-2',
    repositoryId: 'repo-02',
    number: 18,
    title: 'feat: AI Debugging workbench with error stack trace parsing',
    description: 'Allows developers to paste raw stack traces and extract probable cause, reproduction steps, and suggested patches.',
    author: CURRENT_DEMO_USER,
    status: 'OPEN',
    sourceBranch: 'feat/ai-debugging-workspace',
    targetBranch: 'main',
    reviewStatus: 'PENDING',
    createdAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-09-29T18:20:00Z',
  },
  {
    id: 'pr-3',
    repositoryId: 'repo-03',
    number: 9,
    title: 'fix: prevent Lettuce cluster timeout during failover elections',
    description: 'Enables dynamic refresh sources to ensure Lettuce detects promoted master instances in under 2 seconds.',
    author: DEMO_TEAM_MEMBERS[1],
    status: 'MERGED',
    sourceBranch: 'fix/cluster-topology-refresh',
    targetBranch: 'master',
    reviewStatus: 'APPROVED',
    createdAt: '2026-09-26T09:30:00Z',
    updatedAt: '2026-09-27T16:00:00Z',
  },
];

export const INITIAL_CODE_REVIEWS: CodeReviewResult[] = [
  {
    id: 'rev-01',
    projectId: 'proj-01',
    title: 'JwtAuthenticationFilter security review',
    language: 'java',
    originalCode: `public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Insecure: decoding without verifying signature
            Claims claims = Jwts.parser().parseClaimsJwt(token.substring(0, token.lastIndexOf('.') + 1)).getBody();
            String username = claims.getSubject();
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>()));
        }
        filterChain.doFilter(request, response);
    }
}`,
    summary: 'Critical security flaw detected: The filter parses the JWT payload without verifying its cryptographic signature (alg: none vulnerability), allowing arbitrary token forgery.',
    score: 42,
    findings: [
      {
        id: 'f-1',
        category: 'SECURITY',
        severity: 'CRITICAL',
        lineStart: 8,
        lineEnd: 9,
        filePath: 'JwtFilter.java',
        title: 'Unverified JWT signature vulnerability',
        explanation: 'The code calls parseClaimsJwt with stripped signature instead of verifyWith(publicKey).parseSignedClaims(token). Attackers can forge any username or role payload without the secret key.',
        suggestedImprovement: 'Use JwtParserBuilder with the signed RSA public key or secret key, and enforce expiration validation.',
      },
      {
        id: 'f-2',
        category: 'BEST_PRACTICE',
        severity: 'MEDIUM',
        lineStart: 11,
        lineEnd: 11,
        filePath: 'JwtFilter.java',
        title: 'Empty authorities assigned to authenticated principal',
        explanation: 'Passing new ArrayList<>() creates an authenticated principal with zero granted authorities, breaking @PreAuthorize and role checks.',
        suggestedImprovement: 'Extract granted roles from the JWT claims (e.g. "roles") and map them to SimpleGrantedAuthority.',
      },
    ],
    improvedCode: `public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenValidator tokenValidator;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenValidator tokenValidator, UserDetailsService userDetailsService) {
        this.tokenValidator = tokenValidator;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (tokenValidator.validateToken(token)) {
                    String username = tokenValidator.extractUsername(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (JwtException ex) {
                SecurityContextHolder.clearContext();
                logger.error("Cannot set user authentication: {}", ex.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}`,
    reviewer: 'AI_NEXUS',
    createdAt: '2026-09-29T14:00:00Z',
  },
];

export const INITIAL_DEBUG_SESSIONS: DebugSession[] = [
  {
    id: 'dbg-01',
    projectId: 'proj-01',
    title: 'LazyInitializationException in Spring Data JPA endpoint',
    errorMessage: 'org.hibernate.LazyInitializationException: could not initialize proxy [com.nexus.entity.Project#42] - no Session',
    stackTrace: `org.hibernate.LazyInitializationException: could not initialize proxy [com.nexus.entity.Project#42] - no Session
    at org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:169)
    at com.nexus.service.UserService.getUserWithProjects(UserService.java:87)
    at com.nexus.controller.UserController.getUserProfile(UserController.java:45)`,
    codeSnippet: `@GetMapping("/users/{id}")
public UserDTO getUser(@PathVariable String id) {
    User user = userRepository.findById(id).orElseThrow();
    // Throws exception here because session closed:
    return new UserDTO(user.getName(), user.getProjects().size());
}`,
    environment: 'Spring Boot 3.3.0, Java 21, Hibernate 6.5, PostgreSQL',
    expectedBehavior: 'Retrieve user and projects count without open session requirement.',
    actualBehavior: 'Hibernate throws LazyInitializationException during serialization.',
    probableCause: 'Lazy association accessed after the Hibernate EntityManager session is closed outside transaction context.',
    explanation: 'Spring Data JPA repositories close the persistence context when repository methods return unless wrapped in `@Transactional(readOnly = true)` or fetched eagerly via JOIN FETCH.',
    debuggingSteps: [
      'Check if the calling service method has `@Transactional(readOnly = true)`.',
      'Examine repository method query to see if JOIN FETCH or @EntityGraph is defined.',
      'Consider using a Spring Data Projection or DTO query to avoid pulling entities into memory.',
    ],
    suggestedFix: `@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @EntityGraph(attributePaths = {"projects"})
    Optional<User> findWithProjectsById(String id);
}

// Service:
@Transactional(readOnly = true)
public UserDTO getUserProfile(String id) {
    User user = userRepository.findWithProjectsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return UserMapper.toDTO(user);
}`,
    preventionAdvice: 'Never expose raw Hibernate entity graphs directly to JSON serializers. Always use DTO projections and read-only service transactions.',
    resolved: true,
    createdAt: '2026-09-28T10:30:00Z',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    user: DEMO_TEAM_MEMBERS[1],
    action: 'PR_SUBMITTED',
    summary: 'Opened PR #42: "feat: implement JWT token rotation and Spring Security filter chain"',
    timestamp: '2026-09-29T14:00:00Z',
  },
  {
    id: 'act-2',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    user: CURRENT_DEMO_USER,
    action: 'CODE_REVIEWED',
    summary: 'Triggered AI Code Review for JwtFilter.java (Score: 42/100, 1 Critical Security Finding)',
    timestamp: '2026-09-29T14:05:00Z',
  },
  {
    id: 'act-3',
    projectId: 'proj-02',
    projectName: 'Nexus Developer Portal',
    user: DEMO_TEAM_MEMBERS[2],
    action: 'TASK_STATUS_CHANGED',
    summary: 'Moved task "Build Code Review diff highlighting" to REVIEW',
    timestamp: '2026-09-28T16:00:00Z',
  },
  {
    id: 'act-4',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    user: CURRENT_DEMO_USER,
    action: 'DEBUG_SESSION',
    summary: 'Completed AI Debug Session for "LazyInitializationException in UserService"',
    timestamp: '2026-09-28T10:30:00Z',
  },
  {
    id: 'act-5',
    projectId: 'proj-01',
    projectName: 'Nexus Core Backend',
    user: CURRENT_DEMO_USER,
    action: 'ISSUE_FILED',
    summary: 'Logged issue #iss-201: "LazyInitializationException in UserService.getUserWithProjects()"',
    timestamp: '2026-09-28T10:15:00Z',
  },
];

export const INITIAL_DASHBOARD_METRICS: DashboardMetrics = {
  activeProjects: 3,
  openIssues: 9,
  pendingTasks: 15,
  completedTasksThisWeek: 8,
  codeReviewsCompleted: 24,
  avgReviewScore: 84,
  aiQueriesToday: 47,
  githubSyncStatus: 'CONNECTED_DEMO',
};
