import { mockStore } from './mockStore';
import { Order } from '../types';

export const orderService = {
  getOrders(): Promise<Order[]> {
    return Promise.resolve(mockStore.getOrders());
  },

  getOrderById(id: string): Promise<Order | undefined> {
    return Promise.resolve(mockStore.getOrderById(id));
  },

  getCustomerOrders(customerId?: string): Promise<Order[]> {
    return Promise.resolve(mockStore.getCustomerOrders(customerId));
  },

  createOrder(customerData: {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    return Promise.resolve(mockStore.placeOrder(customerData));
  }
};
