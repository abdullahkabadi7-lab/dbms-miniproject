import { mockStore } from './mockStore';
import { User, UserRole } from '../types';

export const authService = {
  getCurrentUser(): User {
    return mockStore.getCurrentUser();
  },

  switchRole(role: UserRole) {
    mockStore.switchRole(role);
  },

  login(email: string, role: UserRole = 'customer'): Promise<User> {
    const user = mockStore.login(email, role);
    return Promise.resolve(user);
  },

  register(data: { fullName: string; email: string; phone: string; address: string; role?: UserRole }): Promise<User> {
    const user = mockStore.register(data);
    return Promise.resolve(user);
  },

  logout(): Promise<void> {
    mockStore.logout();
    return Promise.resolve();
  }
};
