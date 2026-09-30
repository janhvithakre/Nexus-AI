export type UserRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  githubUsername?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProjectMember {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  role: UserRole;
  joinedAt: string;
}

export type ProjectHealth = 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';

export interface Project {
  id: string;
  key: string; // e.g. "NEX", "CORE"
  name: string;
  description: string;
  category: 'BACKEND' | 'FRONTEND' | 'FULLSTACK' | 'INFRASTRUCTURE' | 'AI_SERVICE';
  repositoryUrl: string;
  defaultBranch: string;
  members: ProjectMember[];
  health: ProjectHealth;
  openIssuesCount: number;
  pendingTasksCount: number;
  recentReviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  reporter: User;
  labels: string[];
  dueDate?: string;
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
}

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IssueComment {
  id: string;
  issueId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  priority: TaskPriority;
  status: IssueStatus;
  assignee?: User;
  reporter: User;
  labels: string[];
  environment?: string;
  stackTrace?: string;
  comments: IssueComment[];
  engineeringPlan?: EngineeringPlan;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 
  | 'README' 
  | 'ARCHITECTURE' 
  | 'API_SPEC' 
  | 'TECH_NOTE' 
  | 'ONBOARDING' 
  | 'FEATURE_SPEC';

export interface Document {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  content: string;
  author: User;
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export type FindingCategory = 
  | 'CORRECTNESS' 
  | 'BUG' 
  | 'SECURITY' 
  | 'PERFORMANCE' 
  | 'READABILITY' 
  | 'MAINTAINABILITY' 
  | 'CODE_SMELL' 
  | 'COMPLEXITY' 
  | 'BEST_PRACTICE';

export type FindingSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CodeReviewFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  lineStart?: number;
  lineEnd?: number;
  filePath?: string;
  title: string;
  explanation: string;
  suggestedImprovement: string;
  codeSnippet?: string;
}

export interface CodeReviewResult {
  id: string;
  projectId?: string;
  title: string;
  language: string;
  originalCode: string;
  summary: string;
  score: number; // 0-100
  findings: CodeReviewFinding[];
  improvedCode?: string;
  reviewer: 'AI_NEXUS' | string;
  createdAt: string;
}

export interface DebugSession {
  id: string;
  projectId?: string;
  title: string;
  errorMessage: string;
  stackTrace?: string;
  codeSnippet?: string;
  environment: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  probableCause: string;
  explanation: string;
  debuggingSteps: string[];
  suggestedFix: string;
  preventionAdvice: string;
  resolved: boolean;
  createdAt: string;
}

export interface EngineeringPlan {
  id: string;
  issueTitle: string;
  problemUnderstanding: string;
  assumptions: string[];
  affectedModules: string[];
  databaseChanges: string[];
  backendChanges: string[];
  frontendChanges: string[];
  apiChanges: string[];
  securityConsiderations: string[];
  testingRequirements: string[];
  implementationSteps: Array<{
    step: number;
    title: string;
    details: string;
  }>;
  createdAt: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  isPrivate: boolean;
  defaultBranch: string;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  updatedAt: string;
  isMockData: boolean;
}

export interface Commit {
  id: string;
  repositoryId: string;
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  timestamp: string;
  additions: number;
  deletions: number;
  branch: string;
}

export interface PullRequest {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  description: string;
  author: User;
  status: 'OPEN' | 'MERGED' | 'CLOSED';
  sourceBranch: string;
  targetBranch: string;
  reviewStatus: 'APPROVED' | 'CHANGES_REQUESTED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM';
  text: string;
  codeSnippets?: Array<{
    language: string;
    code: string;
    filename?: string;
  }>;
  citations?: string[];
  timestamp: string;
}

export interface AIConversation {
  id: string;
  projectId?: string;
  title: string;
  messages: AIMessage[];
  contextType: 'PROJECT_KNOWLEDGE' | 'CODE_ANALYSIS' | 'ARCHITECTURE' | 'GENERAL';
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  projectName?: string;
  user: User;
  action: 'TASK_CREATED' | 'TASK_STATUS_CHANGED' | 'ISSUE_FILED' | 'CODE_REVIEWED' | 'DEBUG_SESSION' | 'DOC_UPDATED' | 'PR_SUBMITTED';
  summary: string;
  timestamp: string;
}

export interface DashboardMetrics {
  activeProjects: number;
  openIssues: number;
  pendingTasks: number;
  completedTasksThisWeek: number;
  codeReviewsCompleted: number;
  avgReviewScore: number;
  aiQueriesToday: number;
  githubSyncStatus: 'CONNECTED_DEMO' | 'CONNECTED_LIVE' | 'DISCONNECTED';
}
