import { Document } from '../../types';
import { mockStore } from '../../data/mockStore';

class DocumentationService {
  async getDocuments(projectId?: string): Promise<Document[]> {
    return mockStore.getDocuments(projectId);
  }

  async getDocumentById(id: string): Promise<Document | null> {
    const doc = mockStore.getDocumentById(id);
    return doc || null;
  }

  async saveDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    return mockStore.saveDocument(data);
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    return mockStore.updateDocument(id, updates);
  }
}

export const docService = new DocumentationService();
