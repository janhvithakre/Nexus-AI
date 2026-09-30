import { Repository, Commit, PullRequest } from '../../types';
import { mockStore } from '../../data/mockStore';

export interface RepoAnalysisResult {
  repositoryName: string;
  codeHealthScore: number;
  testCoverageEstimate: string;
  securityRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  topRecommendations: string[];
  dependencyVulnerabilities: number;
  ciCdPipelineStatus: 'PASSING' | 'FAILING' | 'NOT_CONFIGURED';
}

class GithubService {
  isConfiguredWithOAuth(): boolean {
    return false; // Clearly demarcated as demo mode until GitHub OAuth is provisioned
  }

  async getRepositories(): Promise<Repository[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockStore.getRepositories();
  }

  async getCommits(repositoryId?: string): Promise<Commit[]> {
    await new Promise(r => setTimeout(r, 150));
    return mockStore.getCommits(repositoryId);
  }

  async getPullRequests(repositoryId?: string): Promise<PullRequest[]> {
    await new Promise(r => setTimeout(r, 150));
    return mockStore.getPullRequests(repositoryId);
  }

  async analyzeRepository(repoName: string): Promise<RepoAnalysisResult> {
    await new Promise(r => setTimeout(r, 600));
    return {
      repositoryName: repoName,
      codeHealthScore: repoName.includes('cache') ? 78 : 91,
      testCoverageEstimate: repoName.includes('core') ? '84.2%' : '76.8%',
      securityRiskLevel: repoName.includes('cache') ? 'MEDIUM' : 'LOW',
      topRecommendations: [
        'Enforce branch protection rules requiring at least 1 approved pull request before merging to main',
        'Configure Dependabot or Snyk alerts for automated vulnerability detection in Maven/npm dependencies',
        'Add static application security testing (SAST) job with SonarQube in CI pipeline',
      ],
      dependencyVulnerabilities: repoName.includes('cache') ? 2 : 0,
      ciCdPipelineStatus: 'PASSING',
    };
  }
}

export const githubService = new GithubService();
