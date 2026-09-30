import { Issue, IssueStatus, EngineeringPlan } from '../../types';
import { mockStore } from '../../data/mockStore';

class IssueService {
  async getIssues(projectId?: string): Promise<Issue[]> {
    await new Promise(r => setTimeout(r, 120));
    return mockStore.getIssues(projectId);
  }

  async getIssueById(id: string): Promise<Issue | null> {
    const issue = mockStore.getIssueById(id);
    return issue || null;
  }

  async createIssue(data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Issue> {
    await new Promise(r => setTimeout(r, 200));
    return mockStore.createIssue(data);
  }

  async updateIssueStatus(id: string, status: IssueStatus): Promise<Issue | null> {
    return mockStore.updateIssueStatus(id, status);
  }

  async attachEngineeringPlan(issueId: string, plan: EngineeringPlan): Promise<Issue | null> {
    return mockStore.attachEngineeringPlan(issueId, plan);
  }

  async addComment(issueId: string, content: string): Promise<Issue | null> {
    return mockStore.addIssueComment(issueId, content);
  }
}

export const issueService = new IssueService();
