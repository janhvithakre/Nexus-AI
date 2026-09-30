import { DebugSession } from '../../types';
import { mockStore } from '../../data/mockStore';

class DebuggingService {
  async getSessions(projectId?: string): Promise<DebugSession[]> {
    return mockStore.getDebugSessions(projectId);
  }

  async saveSession(session: DebugSession): Promise<void> {
    mockStore.saveDebugSession(session);
  }
}

export const debuggingService = new DebuggingService();
