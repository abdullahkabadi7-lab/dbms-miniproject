import { mockStore } from './mockStore';
import { Inventory, StockTransaction } from '../types';

export const inventoryService = {
  getInventory(): Promise<Inventory[]> {
    return Promise.resolve(mockStore.getInventory());
  },

  getTransactions(): Promise<StockTransaction[]> {
    return Promise.resolve(mockStore.getTransactions());
  },

  restockProduct(productId: string, quantity: number, notes?: string): Promise<void> {
    mockStore.restockProduct(productId, quantity, notes);
    return Promise.resolve();
  }
};
