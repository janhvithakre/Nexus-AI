import React, { useState, useEffect } from 'react';
import { mockStore } from './data/mockStore';
import {
  User,
  Project,
  Task,
  Issue,
  Document,
  CodeReviewResult,
  DebugSession,
  ActivityLog,
  DashboardMetrics,
  UserRole,
  TaskStatus,
  IssueStatus,
  EngineeringPlan,
  DocumentType,
} from './types';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { IssuesPage } from './pages/IssuesPage';
import { CodeReviewPage } from './pages/CodeReviewPage';
import { DebuggingPage } from './pages/DebuggingPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { GithubPage } from './pages/GithubPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { CreateIssueModal } from './components/issues/CreateIssueModal';

export default function App() {
  // Navigation / Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Domain Store States
  const [currentUser, setCurrentUser] = useState<User>(() => mockStore.getCurrentUser());
  const [projects, setProjects] = useState<Project[]>(() => mockStore.getProjects());
  const [tasks, setTasks] = useState<Task[]>(() => mockStore.getTasks());
  const [issues, setIssues] = useState<Issue[]>(() => mockStore.getIssues());
  const [documents, setDocuments] = useState<Document[]>(() => mockStore.getDocuments());
  const [codeReviews, setCodeReviews] = useState<CodeReviewResult[]>(() => mockStore.getCodeReviews());
  const [debugSessions, setDebugSessions] = useState<DebugSession[]>(() => mockStore.getDebugSessions());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => mockStore.getActivityLogs());
  const [metrics, setMetrics] = useState<DashboardMetrics>(() => mockStore.getDashboardMetrics());

  // Global Project Selection Filter
  const [activeProjectId, setActiveProjectId] = useState<string>('all');

  // Modal States
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createIssueModalOpen, setCreateIssueModalOpen] = useState(false);
  const [modalDefaultProjectId, setModalDefaultProjectId] = useState<string | undefined>(undefined);

  // Sync browser URL history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshState = () => {
    setCurrentUser(mockStore.getCurrentUser());
    setProjects(mockStore.getProjects());
    setTasks(mockStore.getTasks());
    setIssues(mockStore.getIssues());
    setDocuments(mockStore.getDocuments());
    setCodeReviews(mockStore.getCodeReviews());
    setDebugSessions(mockStore.getDebugSessions());
    setActivityLogs(mockStore.getActivityLogs());
    setMetrics(mockStore.getDashboardMetrics());
  };

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    const updated = mockStore.setUserRole(role);
    setCurrentUser(updated);
  };

  const handleCreateProject = (projectData: any) => {
    mockStore.createProject(projectData);
    refreshState();
  };

  const handleDeleteProject = (id: string) => {
    mockStore.deleteProject(id);
    refreshState();
  };

  const handleCreateTask = (taskData: any) => {
    mockStore.createTask(taskData);
    refreshState();
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    mockStore.updateTaskStatus(taskId, status);
    refreshState();
  };

  const handleDeleteTask = (taskId: string) => {
    mockStore.deleteTask(taskId);
    refreshState();
  };

  const handleCreateIssue = (issueData: any) => {
    mockStore.createIssue(issueData);
    refreshState();
  };

  const handleUpdateIssueStatus = (issueId: string, status: IssueStatus) => {
    mockStore.updateIssueStatus(issueId, status);
    refreshState();
  };

  const handleAddIssueComment = (issueId: string, content: string) => {
    mockStore.addIssueComment(issueId, content);
    refreshState();
  };

  const handleAttachPlan = (issueId: string, plan: EngineeringPlan) => {
    mockStore.attachEngineeringPlan(issueId, plan);
    refreshState();
  };

  const handleSaveDocument = (doc: any) => {
    mockStore.saveDocument(doc);
    refreshState();
  };

  const handleSaveReview = (review: CodeReviewResult) => {
    mockStore.saveCodeReview(review);
    refreshState();
  };

  const handleSaveSession = (session: DebugSession) => {
    mockStore.saveDebugSession(session);
    refreshState();
  };

  // Pending counts for sidebar
  const pendingTasksCount = tasks.filter((t) => t.status !== 'DONE').length;
  const openIssuesCount = issues.filter((i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;

  // Unauthenticated / Landing & Auth Routes
  if (currentPath === '/') {
    return <LandingPage onNavigate={navigate} />;
  }

  if (currentPath === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          navigate('/dashboard');
        }}
        onNavigate={navigate}
      />
    );
  }

  if (currentPath === '/register') {
    return (
      <RegisterPage
        onRegisterSuccess={(u) => {
          setCurrentUser(u);
          navigate('/dashboard');
        }}
        onNavigate={navigate}
      />
    );
  }

  // Project Detail Page Route (/projects/:id)
  const projectDetailMatch = currentPath.match(/^\/projects\/([a-zA-Z0-9_-]+)$/);
  if (projectDetailMatch) {
    const projId = projectDetailMatch[1];
    const project = projects.find((p) => p.id === projId);

    return (
      <AppLayout
        user={currentUser}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        currentPath={currentPath}
        onNavigate={navigate}
        onLogout={() => navigate('/login')}
        onRoleChange={handleRoleChange}
        pendingTasksCount={pendingTasksCount}
        openIssuesCount={openIssuesCount}
      >
        {project ? (
          <ProjectDetailPage
            project={project}
            tasks={tasks}
            issues={issues}
            documents={documents}
            codeReviews={codeReviews}
            activityLogs={activityLogs}
            currentUser={currentUser}
            onNavigate={navigate}
            onOpenCreateTask={(id) => {
              setModalDefaultProjectId(id);
              setCreateTaskModalOpen(true);
            }}
            onOpenCreateIssue={(id) => {
              setModalDefaultProjectId(id);
              setCreateIssueModalOpen(true);
            }}
          />
        ) : (
          <NotFoundPage onNavigate={navigate} />
        )}
      </AppLayout>
    );
  }

  // Protected App Pages
  return (
    <AppLayout
      user={currentUser}
      projects={projects}
      activeProjectId={activeProjectId}
      onSelectProject={setActiveProjectId}
      currentPath={currentPath}
      onNavigate={navigate}
      onLogout={() => navigate('/login')}
      onRoleChange={handleRoleChange}
      pendingTasksCount={pendingTasksCount}
      openIssuesCount={openIssuesCount}
    >
      {currentPath === '/dashboard' && (
        <DashboardPage
          metrics={metrics}
          projects={projects}
          tasks={tasks}
          issues={issues}
          codeReviews={codeReviews}
          activityLogs={activityLogs}
          currentUser={currentUser}
          onNavigate={navigate}
          onOpenCreateProject={() => setCreateProjectModalOpen(true)}
          onOpenCreateTask={() => {
            setModalDefaultProjectId(undefined);
            setCreateTaskModalOpen(true);
          }}
        />
      )}

      {currentPath === '/projects' && (
        <ProjectsPage
          projects={projects}
          currentUser={currentUser}
          onNavigate={navigate}
          onOpenCreateProject={() => setCreateProjectModalOpen(true)}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {currentPath === '/tasks' && (
        <TasksPage
          tasks={tasks}
          projects={projects}
          currentUser={currentUser}
          onOpenCreateTask={() => {
            setModalDefaultProjectId(undefined);
            setCreateTaskModalOpen(true);
          }}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {currentPath === '/issues' && (
        <IssuesPage
          issues={issues}
          projects={projects}
          currentUser={currentUser}
          onOpenCreateIssue={() => {
            setModalDefaultProjectId(undefined);
            setCreateIssueModalOpen(true);
          }}
          onUpdateIssueStatus={handleUpdateIssueStatus}
          onAddComment={handleAddIssueComment}
          onAttachPlan={handleAttachPlan}
        />
      )}

      {currentPath === '/code-review' && (
        <CodeReviewPage
          projects={projects}
          codeReviews={codeReviews}
          onSaveReview={handleSaveReview}
        />
      )}

      {currentPath === '/debugging' && (
        <DebuggingPage
          projects={projects}
          debugSessions={debugSessions}
          onSaveSession={handleSaveSession}
        />
      )}

      {currentPath === '/ai-assistant' && (
        <AiAssistantPage
          projects={projects}
          documents={documents}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
        />
      )}

      {currentPath === '/documentation' && (
        <DocumentationPage
          documents={documents}
          projects={projects}
          currentUser={currentUser}
          onSaveDocument={handleSaveDocument}
        />
      )}

      {currentPath === '/github' && (
        <GithubPage
          repositories={mockStore.getRepositories()}
          commits={mockStore.getCommits()}
          pullRequests={mockStore.getPullRequests()}
        />
      )}

      {currentPath === '/settings' && (
        <SettingsPage
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
        />
      )}

      {currentPath === '/profile' && (
        <ProfilePage
          currentUser={currentUser}
          tasks={tasks}
          onUpdateUser={(u) => {
            setCurrentUser(u);
            refreshState();
          }}
        />
      )}

      {![
        '/dashboard',
        '/projects',
        '/tasks',
        '/issues',
        '/code-review',
        '/debugging',
        '/ai-assistant',
        '/documentation',
        '/github',
        '/settings',
        '/profile',
      ].includes(currentPath) && <NotFoundPage onNavigate={navigate} />}

      {/* Global Modals */}
      <CreateProjectModal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        currentUser={currentUser}
        onCreate={handleCreateProject}
      />

      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        projects={projects}
        teamMembers={mockStore.getTeamMembers()}
        currentUser={currentUser}
        defaultProjectId={modalDefaultProjectId}
        onCreate={handleCreateTask}
      />

      <CreateIssueModal
        isOpen={createIssueModalOpen}
        onClose={() => setCreateIssueModalOpen(false)}
        projects={projects}
        teamMembers={mockStore.getTeamMembers()}
        currentUser={currentUser}
        defaultProjectId={modalDefaultProjectId}
        onCreate={handleCreateIssue}
      />
    </AppLayout>
  );
}
