import { Task, TaskStatus } from '../../types';
import { mockStore } from '../../data/mockStore';

class TaskService {
  async getTasks(projectId?: string): Promise<Task[]> {
    await new Promise(r => setTimeout(r, 120));
    return mockStore.getTasks(projectId);
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = mockStore.getTaskById(id);
    return task || null;
  }

  async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await new Promise(r => setTimeout(r, 200));
    return mockStore.createTask(data);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return mockStore.updateTaskStatus(id, status);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    return mockStore.updateTask(id, updates);
  }

  async deleteTask(id: string): Promise<boolean> {
    return mockStore.deleteTask(id);
  }
}

export const taskService = new TaskService();
