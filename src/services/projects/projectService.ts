import { Project, ProjectMember } from '../../types';
import { mockStore } from '../../data/mockStore';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    await new Promise(r => setTimeout(r, 150));
    return mockStore.getProjects();
  }

  async getProjectById(id: string): Promise<Project | null> {
    await new Promise(r => setTimeout(r, 100));
    const project = mockStore.getProjectById(id);
    return project || null;
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'openIssuesCount' | 'pendingTasksCount' | 'recentReviewsCount'>): Promise<Project> {
    await new Promise(r => setTimeout(r, 300));
    return mockStore.createProject(data);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    await new Promise(r => setTimeout(r, 200));
    return mockStore.updateProject(id, updates);
  }

  async deleteProject(id: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 250));
    return mockStore.deleteProject(id);
  }

  async addMember(projectId: string, member: ProjectMember): Promise<Project | null> {
    const project = mockStore.getProjectById(projectId);
    if (!project) return null;
    const existing = project.members.filter(m => m.userId !== member.userId);
    return mockStore.updateProject(projectId, {
      members: [...existing, member],
    });
  }

  async removeMember(projectId: string, userId: string): Promise<Project | null> {
    const project = mockStore.getProjectById(projectId);
    if (!project) return null;
    return mockStore.updateProject(projectId, {
      members: project.members.filter(m => m.userId !== userId),
    });
  }
}

export const projectService = new ProjectService();
