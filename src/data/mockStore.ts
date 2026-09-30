import {
  User,
  UserRole,
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
  TaskStatus,
  IssueStatus,
  EngineeringPlan,
} from '../types';
import {
  CURRENT_DEMO_USER,
  DEMO_TEAM_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ISSUES,
  INITIAL_DOCUMENTS,
  INITIAL_REPOSITORIES,
  INITIAL_COMMITS,
  INITIAL_PULL_REQUESTS,
  INITIAL_CODE_REVIEWS,
  INITIAL_DEBUG_SESSIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_DASHBOARD_METRICS,
} from './seedData';

const STORAGE_KEYS = {
  USER: 'nexus_user',
  TOKEN: 'nexus_jwt_token',
  PROJECTS: 'nexus_projects',
  TASKS: 'nexus_tasks',
  ISSUES: 'nexus_issues',
  DOCUMENTS: 'nexus_documents',
  CODE_REVIEWS: 'nexus_code_reviews',
  DEBUG_SESSIONS: 'nexus_debug_sessions',
  ACTIVITY: 'nexus_activity',
  METRICS: 'nexus_metrics',
  REPOSITORIES: 'nexus_repositories',
};

class MockDataStore {
  private user: User = CURRENT_DEMO_USER;
  private token: string = 'mock-jwt-header.eyJzdWIiOiJ1c3ItMDAxIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxODkzNDU2MDAwfQ.signature';
  private projects: Project[] = INITIAL_PROJECTS;
  private tasks: Task[] = INITIAL_TASKS;
  private issues: Issue[] = INITIAL_ISSUES;
  private documents: Document[] = INITIAL_DOCUMENTS;
  private codeReviews: CodeReviewResult[] = INITIAL_CODE_REVIEWS;
  private debugSessions: DebugSession[] = INITIAL_DEBUG_SESSIONS;
  private activityLogs: ActivityLog[] = INITIAL_ACTIVITY_LOGS;
  private repositories: Repository[] = INITIAL_REPOSITORIES;
  private commits: Commit[] = INITIAL_COMMITS;
  private pullRequests: PullRequest[] = INITIAL_PULL_REQUESTS;
  private metrics: DashboardMetrics = INITIAL_DASHBOARD_METRICS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) this.projects = JSON.parse(storedProjects);

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) this.tasks = JSON.parse(storedTasks);

      const storedIssues = localStorage.getItem(STORAGE_KEYS.ISSUES);
      if (storedIssues) this.issues = JSON.parse(storedIssues);

      const storedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (storedDocs) this.documents = JSON.parse(storedDocs);

      const storedReviews = localStorage.getItem(STORAGE_KEYS.CODE_REVIEWS);
      if (storedReviews) this.codeReviews = JSON.parse(storedReviews);

      const storedDebug = localStorage.getItem(STORAGE_KEYS.DEBUG_SESSIONS);
      if (storedDebug) this.debugSessions = JSON.parse(storedDebug);

      const storedActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (storedActivity) this.activityLogs = JSON.parse(storedActivity);
    } catch (e) {
      console.warn('Failed to load mock data from localStorage, using initial seeds', e);
    }
  }

  private save(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage`, e);
    }
  }

  // User & Auth
  getCurrentUser(): User {
    return this.user;
  }

  getToken(): string {
    return this.token;
  }

  setUserRole(role: UserRole): User {
    this.user = { ...this.user, role };
    this.save(STORAGE_KEYS.USER, this.user);
    return this.user;
  }

  updateProfile(updates: Partial<User>): User {
    this.user = { ...this.user, ...updates };
    this.save(STORAGE_KEYS.USER, this.user);
    return this.user;
  }

  getTeamMembers(): User[] {
    return DEMO_TEAM_MEMBERS;
  }

  // Projects
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'openIssuesCount' | 'pendingTasksCount' | 'recentReviewsCount'>): Project {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now().toString().slice(-4)}`,
      openIssuesCount: 0,
      pendingTasksCount: 0,
      recentReviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects = [newProject, ...this.projects];
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    this.logActivity('TASK_CREATED', `Created new project "${newProject.name}"`, newProject.id, newProject.name);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const project = this.projects.find(p => p.id === id);
    if (!project) return false;
    this.projects = this.projects.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PROJECTS, this.projects);
    return true;
  }

  // Tasks
  getTasks(projectId?: string): Task[] {
    if (projectId) return this.tasks.filter(t => t.projectId === projectId);
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const project = this.projects.find(p => p.id === taskData.projectId);
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now().toString().slice(-4)}`,
      projectName: project?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks = [newTask, ...this.tasks];
    this.save(STORAGE_KEYS.TASKS, this.tasks);

    // Update project metrics
    if (project) {
      project.pendingTasksCount += 1;
      this.updateProject(project.id, { pendingTasksCount: project.pendingTasksCount });
    }

    this.logActivity('TASK_CREATED', `Created task "${newTask.title}"`, newTask.projectId, newTask.projectName);
    return newTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const task = this.tasks[index];
    const prevStatus = task.status;
    task.status = status;
    task.updatedAt = new Date().toISOString();
    this.save(STORAGE_KEYS.TASKS, this.tasks);

    this.logActivity('TASK_STATUS_CHANGED', `Changed task "${task.title}" status from ${prevStatus} to ${status}`, task.projectId, task.projectName);
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString() };
    this.save(STORAGE_KEYS.TASKS, this.tasks);
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save(STORAGE_KEYS.TASKS, this.tasks);
    return true;
  }

  // Issues
  getIssues(projectId?: string): Issue[] {
    if (projectId) return this.issues.filter(i => i.projectId === projectId);
    return [...this.issues];
  }

  getIssueById(id: string): Issue | undefined {
    return this.issues.find(i => i.id === id);
  }

  createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Issue {
    const project = this.projects.find(p => p.id === issueData.projectId);
    const newIssue: Issue = {
      ...issueData,
      id: `iss-${Date.now().toString().slice(-4)}`,
      projectName: project?.name,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.issues = [newIssue, ...this.issues];
    this.save(STORAGE_KEYS.ISSUES, this.issues);

    if (project) {
      project.openIssuesCount += 1;
      this.updateProject(project.id, { openIssuesCount: project.openIssuesCount });
    }

    this.logActivity('ISSUE_FILED', `Reported issue #${newIssue.id}: "${newIssue.title}"`, newIssue.projectId, newIssue.projectName);
    return newIssue;
  }

  updateIssueStatus(id: string, status: IssueStatus): Issue | null {
    const index = this.issues.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.issues[index].status = status;
    this.issues[index].updatedAt = new Date().toISOString();
    this.save(STORAGE_KEYS.ISSUES, this.issues);
    return this.issues[index];
  }

  attachEngineeringPlan(issueId: string, plan: EngineeringPlan): Issue | null {
    const index = this.issues.findIndex(i => i.id === issueId);
    if (index === -1) return null;
    this.issues[index].engineeringPlan = plan;
    this.issues[index].updatedAt = new Date().toISOString();
    this.save(STORAGE_KEYS.ISSUES, this.issues);
    return this.issues[index];
  }

  addIssueComment(issueId: string, content: string): Issue | null {
    const index = this.issues.findIndex(i => i.id === issueId);
    if (index === -1) return null;
    const comment = {
      id: `comm-${Date.now()}`,
      issueId,
      author: this.user,
      content,
      createdAt: new Date().toISOString(),
    };
    this.issues[index].comments.push(comment);
    this.issues[index].updatedAt = new Date().toISOString();
    this.save(STORAGE_KEYS.ISSUES, this.issues);
    return this.issues[index];
  }

  // Documents
  getDocuments(projectId?: string): Document[] {
    if (projectId) return this.documents.filter(d => d.projectId === projectId);
    return [...this.documents];
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.find(d => d.id === id);
  }

  saveDocument(docData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document {
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.documents = [newDoc, ...this.documents];
    this.save(STORAGE_KEYS.DOCUMENTS, this.documents);
    this.logActivity('DOC_UPDATED', `Published document "${newDoc.title}"`, newDoc.projectId);
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.documents[index] = {
      ...this.documents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.DOCUMENTS, this.documents);
    return this.documents[index];
  }

  // Code Reviews
  getCodeReviews(projectId?: string): CodeReviewResult[] {
    if (projectId) return this.codeReviews.filter(r => r.projectId === projectId);
    return [...this.codeReviews];
  }

  saveCodeReview(review: CodeReviewResult): void {
    this.codeReviews = [review, ...this.codeReviews];
    this.save(STORAGE_KEYS.CODE_REVIEWS, this.codeReviews);
    this.logActivity('CODE_REVIEWED', `Completed AI Code Review for "${review.title}" (Score: ${review.score}/100)`, review.projectId);
  }

  // Debugging
  getDebugSessions(projectId?: string): DebugSession[] {
    if (projectId) return this.debugSessions.filter(d => d.projectId === projectId);
    return [...this.debugSessions];
  }

  saveDebugSession(session: DebugSession): void {
    this.debugSessions = [session, ...this.debugSessions];
    this.save(STORAGE_KEYS.DEBUG_SESSIONS, this.debugSessions);
    this.logActivity('DEBUG_SESSION', `Ran AI Debug Analysis for "${session.title}"`, session.projectId);
  }

  // GitHub Data (clearly mock/demo)
  getRepositories(): Repository[] {
    return [...this.repositories];
  }

  getCommits(repositoryId?: string): Commit[] {
    if (repositoryId) return this.commits.filter(c => c.repositoryId === repositoryId);
    return [...this.commits];
  }

  getPullRequests(repositoryId?: string): PullRequest[] {
    if (repositoryId) return this.pullRequests.filter(pr => pr.repositoryId === repositoryId);
    return [...this.pullRequests];
  }

  // Activity & Metrics
  getActivityLogs(): ActivityLog[] {
    return [...this.activityLogs];
  }

  private logActivity(
    action: ActivityLog['action'],
    summary: string,
    projectId?: string,
    projectName?: string
  ): void {
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId,
      projectName,
      user: this.user,
      action,
      summary,
      timestamp: new Date().toISOString(),
    };
    this.activityLogs = [log, ...this.activityLogs].slice(0, 50);
    this.save(STORAGE_KEYS.ACTIVITY, this.activityLogs);
  }

  getDashboardMetrics(): DashboardMetrics {
    const activeTasks = this.tasks.filter(t => t.status !== 'DONE').length;
    const completedTasks = this.tasks.filter(t => t.status === 'DONE').length;
    const openIssues = this.issues.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;

    return {
      ...this.metrics,
      activeProjects: this.projects.length,
      pendingTasks: activeTasks,
      completedTasksThisWeek: completedTasks,
      openIssues: openIssues,
      codeReviewsCompleted: this.codeReviews.length + 15,
    };
  }

  resetToDefaults(): void {
    localStorage.clear();
    this.user = CURRENT_DEMO_USER;
    this.projects = INITIAL_PROJECTS;
    this.tasks = INITIAL_TASKS;
    this.issues = INITIAL_ISSUES;
    this.documents = INITIAL_DOCUMENTS;
    this.codeReviews = INITIAL_CODE_REVIEWS;
    this.debugSessions = INITIAL_DEBUG_SESSIONS;
    this.activityLogs = INITIAL_ACTIVITY_LOGS;
    this.repositories = INITIAL_REPOSITORIES;
    this.commits = INITIAL_COMMITS;
    this.pullRequests = INITIAL_PULL_REQUESTS;
    this.metrics = INITIAL_DASHBOARD_METRICS;
  }
}

export const mockStore = new MockDataStore();
