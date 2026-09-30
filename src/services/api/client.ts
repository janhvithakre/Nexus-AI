/**
 * NEXUS AI - Enterprise API Client Abstraction
 * 
 * Designed to connect seamlessly to Java Spring Boot REST endpoints:
 * e.g., http://localhost:8080/api/v1/projects, /api/v1/auth, /api/v1/tasks
 * In this AI Studio runtime, requests route through the Express gateway/mock adapter
 * preserving exact DTO and header contract standards (Bearer JWT, X-Tenant-Id).
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string = '/api';
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('nexus_jwt_token') || 'mock-jwt-token-demo';
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('nexus_jwt_token', token);
    } else {
      localStorage.removeItem('nexus_jwt_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Platform': 'Nexus-Web-Workbench',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      // In standalone client mode when backend route is handled locally
      throw err;
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errDetails = '';
      try {
        const errorJson = await response.json();
        errDetails = errorJson.message || errorJson.error || response.statusText;
      } catch {
        errDetails = response.statusText;
      }
      throw new Error(`API error ${response.status}: ${errDetails}`);
    }

    return await response.json();
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`);
    return await response.json();
  }
}

export const apiClient = new ApiClient();
