import { mockStore } from './mockStore';
import { ProductWithInventory, Category, Supplier, Product } from '../types';

export const productService = {
  getProducts(): Promise<ProductWithInventory[]> {
    return Promise.resolve(mockStore.getProductsWithInventory());
  },

  getProductById(id: string): Promise<ProductWithInventory | undefined> {
    return Promise.resolve(mockStore.getProductById(id));
  },

  getCategories(): Promise<Category[]> {
    return Promise.resolve(mockStore.getCategories());
  },

  getSuppliers(): Promise<Supplier[]> {
    return Promise.resolve(mockStore.getSuppliers());
  },

  addProduct(data: {
    name: string;
    sku: string;
    description: string;
    category_id: string;
    supplier_id: string;
    selling_price: number;
    cost_price: number;
    image_url: string;
    initial_stock: number;
    reorder_level: number;
  }): Promise<ProductWithInventory> {
    return Promise.resolve(mockStore.addProduct(data));
  },

  updateProduct(id: string, data: Partial<Product>): Promise<void> {
    mockStore.updateProduct(id, data);
    return Promise.resolve();
  },

  deleteProduct(id: string): Promise<void> {
    mockStore.deleteProduct(id);
    return Promise.resolve();
  },

  // Category CRUD
  addCategory(data: { name: string; slug: string; description: string; image_url?: string }): Promise<Category> {
    return Promise.resolve(mockStore.addCategory(data));
  },

  updateCategory(id: string, data: Partial<Category>): Promise<void> {
    mockStore.updateCategory(id, data);
    return Promise.resolve();
  },

  deleteCategory(id: string): Promise<void> {
    mockStore.deleteCategory(id);
    return Promise.resolve();
  },

  // Supplier CRUD
  addSupplier(data: Omit<Supplier, 'supplier_id' | 'created_at'>): Promise<Supplier> {
    return Promise.resolve(mockStore.addSupplier(data));
  },

  updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
    mockStore.updateSupplier(id, data);
    return Promise.resolve();
  },

  deleteSupplier(id: string): Promise<void> {
    mockStore.deleteSupplier(id);
    return Promise.resolve();
  }
};
