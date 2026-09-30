import { User, UserRole } from '../../types';
import { mockStore } from '../../data/mockStore';
import { apiClient } from '../api/client';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  department?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // In production: calls POST /api/auth/login to Spring Security endpoint
    await new Promise(r => setTimeout(r, 400)); // Network simulation

    const allMembers = mockStore.getTeamMembers();
    const matched = allMembers.find(m => m.email.toLowerCase() === credentials.email.toLowerCase());
    const user = matched || {
      ...mockStore.getCurrentUser(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
    };

    const token = `nexus-jwt-${Date.now()}-${btoa(user.email)}`;
    apiClient.setToken(token);
    mockStore.updateProfile(user);
    return { user, token };
  }

  async register(data: RegisterPayload): Promise<{ user: User; token: string }> {
    await new Promise(r => setTimeout(r, 500));
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      role: data.role || 'DEVELOPER',
      department: data.department || 'Engineering',
      createdAt: new Date().toISOString(),
    };
    const token = `nexus-jwt-${Date.now()}-${btoa(newUser.email)}`;
    apiClient.setToken(token);
    mockStore.updateProfile(newUser);
    return { user: newUser, token };
  }

  async logout(): Promise<void> {
    apiClient.setToken(null);
  }

  getCurrentUser(): User {
    return mockStore.getCurrentUser();
  }

  switchRole(role: UserRole): User {
    return mockStore.setUserRole(role);
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 600));
    return true;
  }
}

export const authService = new AuthService();
