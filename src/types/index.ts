// ==========================================
// SMARTMART - DATABASE ENTITY TYPES
// Designed around PostgreSQL Relational Schema
// ==========================================

export type UserRole = 'customer' | 'admin';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  category_id: string;
  name: string;
  category_name?: string;
  slug: string;
  description: string;
  image_url: string;
  product_count?: number;
}

export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  product_id: string;
  name: string;
  product_name?: string;
  sku: string;
  description: string;
  category_id: string;
  supplier_id: string;
  selling_price: number;
  cost_price: number;
  unit?: string;
  image_url: string;
  created_at: string;
}

export interface Inventory {
  inventory_id: string;
  product_id: string;
  current_stock: number;
  reorder_level: number;
  status: StockStatus;
  last_updated: string;
}

export interface ProductWithInventory extends Product {
  current_stock: number;
  reorder_level: number;
  stock_status: StockStatus;
  category_name?: string;
  supplier_name?: string;
}

export type OrderStatus = 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image_url?: string;
}

export interface Order {
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

export type TransactionType = 'SALE' | 'RESTOCK' | 'RETURN' | 'STOCK_IN' | 'STOCK_OUT';

export interface StockTransaction {
  transaction_id: string;
  product_id: string;
  product_name: string;
  transaction_type: TransactionType;
  quantity: number;
  reference_id: string; // e.g. Order ID or Restock Batch ID
  transaction_date: string;
  notes?: string;
}

// Shopping Cart Types
export interface CartItem {
  product: ProductWithInventory;
  quantity: number;
}
