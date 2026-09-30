import { CodeReviewResult } from '../../types';
import { mockStore } from '../../data/mockStore';

class CodeReviewService {
  async getReviews(projectId?: string): Promise<CodeReviewResult[]> {
    return mockStore.getCodeReviews(projectId);
  }

  async saveReview(review: CodeReviewResult): Promise<void> {
    mockStore.saveCodeReview(review);
  }
}

export const codeReviewService = new CodeReviewService();
