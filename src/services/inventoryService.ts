import { mockStore } from './mockStore';
import { apiClient } from './apiClient';
import { Inventory, StockTransaction } from '../types';

export const inventoryService = {
  async getInventory(): Promise<Inventory[]> {
    try {
      const res = await apiClient.get<{ success: boolean; inventory: Inventory[] }>('/inventory');
      if (res.success && res.inventory) {
        return res.inventory;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getInventory();
  },

  async getTransactions(): Promise<StockTransaction[]> {
    try {
      const res = await apiClient.get<{ success: boolean; transactions: StockTransaction[] }>('/transactions');
      if (res.success && res.transactions) {
        return res.transactions;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getTransactions();
  },

  async restockProduct(productId: string | number, quantity: number, notes?: string): Promise<void> {
    mockStore.restockProduct(productId, quantity, notes);
  }
};
