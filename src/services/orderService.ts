import { mockStore } from './mockStore';
import { apiClient } from './apiClient';
import { Order } from '../types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const res = await apiClient.get<{ success: boolean; orders: Order[] }>('/orders');
      if (res.success && res.orders) {
        return res.orders;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getOrders();
  },

  async getOrderById(id: string | number): Promise<Order | undefined> {
    try {
      const res = await apiClient.get<{ success: boolean; order: Order }>(`/orders/${id}`);
      if (res.success && res.order) {
        return res.order;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getOrderById(id);
  },

  async getCustomerOrders(customerId?: string | number): Promise<Order[]> {
    try {
      const param = customerId ? `?userId=${customerId}` : '';
      const res = await apiClient.get<{ success: boolean; orders: Order[] }>(`/orders${param}`);
      if (res.success && res.orders) {
        return res.orders;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getCustomerOrders(customerId);
  },

  async createOrder(customerData: {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    return mockStore.placeOrder(customerData);
  }
};
