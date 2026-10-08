import { mockStore } from './mockStore';
import { apiClient } from './apiClient';
import { ProductWithInventory, Category, Supplier, Product } from '../types';

export const productService = {
  async getProducts(): Promise<ProductWithInventory[]> {
    try {
      const res = await apiClient.get<{ success: boolean; products: ProductWithInventory[] }>('/products');
      if (res.success && res.products) {
        return res.products;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getProductsWithInventory();
  },

  async getProductById(id: string | number): Promise<ProductWithInventory | undefined> {
    try {
      const res = await apiClient.get<{ success: boolean; product: ProductWithInventory }>(`/products/${id}`);
      if (res.success && res.product) {
        return res.product;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getProductById(id);
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<{ success: boolean; categories: Category[] }>('/categories');
      if (res.success && res.categories) {
        return res.categories;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getCategories();
  },

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const res = await apiClient.get<{ success: boolean; suppliers: Supplier[] }>('/suppliers');
      if (res.success && res.suppliers) {
        return res.suppliers;
      }
    } catch {
      // Backend not running, fallback to store
    }
    return mockStore.getSuppliers();
  },

  async addProduct(data: {
    name: string;
    sku: string;
    description: string;
    category_id: string | number;
    supplier_id: string | number;
    selling_price: number;
    cost_price: number;
    image_url: string;
    initial_stock: number;
    reorder_level: number;
  }): Promise<ProductWithInventory> {
    return mockStore.addProduct(data);
  },

  async updateProduct(id: string | number, data: Partial<Product>): Promise<void> {
    mockStore.updateProduct(id, data);
  },

  async deleteProduct(id: string | number): Promise<void> {
    mockStore.deleteProduct(id);
  },

  // Category CRUD
  async addCategory(data: { name: string; slug: string; description: string; image_url?: string }): Promise<Category> {
    return mockStore.addCategory(data);
  },

  async updateCategory(id: string | number, data: Partial<Category>): Promise<void> {
    mockStore.updateCategory(id, data);
  },

  async deleteCategory(id: string | number): Promise<void> {
    mockStore.deleteCategory(id);
  },

  // Supplier CRUD
  async addSupplier(data: Omit<Supplier, 'supplier_id' | 'created_at'>): Promise<Supplier> {
    return mockStore.addSupplier(data);
  },

  async updateSupplier(id: string | number, data: Partial<Supplier>): Promise<void> {
    mockStore.updateSupplier(id, data);
  },

  async deleteSupplier(id: string | number): Promise<void> {
    mockStore.deleteSupplier(id);
  }
};
