import { mockStore } from './mockStore';
import { apiClient } from './apiClient';
import { User, UserRole } from '../types';

export const authService = {
  getCurrentUser(): User {
    return mockStore.getCurrentUser();
  },

  switchRole(role: UserRole) {
    mockStore.switchRole(role);
  },

  async login(email: string, role: UserRole = 'customer'): Promise<User> {
    try {
      const res = await apiClient.post<{ success: boolean; user: User }>('/auth/login', { email, role });
      if (res.success && res.user) {
        return mockStore.setCurrentUser(res.user);
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.login(email, role);
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
        return mockStore.setCurrentUser(res.user);
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
