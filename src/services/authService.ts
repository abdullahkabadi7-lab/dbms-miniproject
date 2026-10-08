import { mockStore } from './mockStore';
import { apiClient } from './apiClient';
import { User, UserRole } from '../types';

export const authService = {
  getCurrentUser(): User | null {
    return mockStore.getCurrentUser();
  },

  isAuthenticated(): boolean {
    return mockStore.isAuthenticated();
  },

  isAdmin(): boolean {
    return mockStore.isAdmin();
  },

  switchRole(role: UserRole) {
    mockStore.switchRole(role);
  },

  async login(identifier: string, password = ''): Promise<{ success: boolean; user?: User; message?: string }> {
    return mockStore.loginWithCredentials(identifier, password);
  },

  async register(data: { fullName: string; email: string; phone: string; address: string; role?: UserRole }): Promise<User> {
    try {
      const res = await apiClient.post<{ success: boolean; user: User }>('/auth/register', {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role || 'customer'
      });
      if (res.success && res.user) {
        mockStore.setCurrentUser(res.user);
        return res.user;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.register(data);
  },

  logout(): Promise<void> {
    mockStore.logout();
    return Promise.resolve();
  }
};
