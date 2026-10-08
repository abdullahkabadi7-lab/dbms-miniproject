import {
  Category,
  Supplier,
  Product,
  Inventory,
  StockTransaction,
  Order,
  OrderItem,
  User,
  ProductWithInventory,
  CartItem,
  UserRole
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  DEMO_USERS
} from '../data/mockData';
import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  CATEGORIES: 'smartmart_categories',
  SUPPLIERS: 'smartmart_suppliers',
  PRODUCTS: 'smartmart_products',
  INVENTORY: 'smartmart_inventory',
  ORDERS: 'smartmart_orders',
  TRANSACTIONS: 'smartmart_transactions',
  CART: 'smartmart_cart',
  CURRENT_USER: 'smartmart_current_user',
  CINEMATIC_SHOWN: 'smartmart_cinematic_completed',
};

type Listener = () => void;

class MockStore {
  private categories: Category[] = [];
  private suppliers: Supplier[] = [];
  private products: Product[] = [];
  private inventory: Inventory[] = [];
  private orders: Order[] = [];
  private transactions: StockTransaction[] = [];
  private cart: CartItem[] = [];
  private currentUser: User | null = null;
  private listeners: Set<Listener> = new Set();
  private backendSynced = false;

  constructor() {
    this.loadFromStorage();
    this.syncWithBackend();
  }

  private loadFromStorage() {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = storedCategories ? JSON.parse(storedCategories) : [...INITIAL_CATEGORIES];

      const storedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      this.suppliers = storedSuppliers ? JSON.parse(storedSuppliers) : [...INITIAL_SUPPLIERS];

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      this.products = storedProducts ? JSON.parse(storedProducts) : [...INITIAL_PRODUCTS];

      const storedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      this.inventory = storedInventory ? JSON.parse(storedInventory) : [...INITIAL_INVENTORY];

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : [...INITIAL_ORDERS];

      const storedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      this.transactions = storedTxns ? JSON.parse(storedTxns) : [...INITIAL_TRANSACTIONS];

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      this.cart = storedCart ? JSON.parse(storedCart) : [];

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      this.categories = [...INITIAL_CATEGORIES];
      this.suppliers = [...INITIAL_SUPPLIERS];
      this.products = [...INITIAL_PRODUCTS];
      this.inventory = [...INITIAL_INVENTORY];
      this.orders = [...INITIAL_ORDERS];
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.cart = [];
      this.currentUser = null;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(this.suppliers));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(this.inventory));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Real PostgreSQL Backend Synchronization ---
  public async syncWithBackend(): Promise<void> {
    try {
      const isOnline = await apiClient.isBackendHealthy();
      if (!isOnline) {
        return;
      }

      const [prodRes, catRes, supRes, ordRes, txRes] = await Promise.all([
        apiClient.get<{ success: boolean; products: ProductWithInventory[] }>('/products').catch(() => null),
        apiClient.get<{ success: boolean; categories: Category[] }>('/categories').catch(() => null),
        apiClient.get<{ success: boolean; suppliers: Supplier[] }>('/suppliers').catch(() => null),
        apiClient.get<{ success: boolean; orders: Order[] }>('/orders').catch(() => null),
        apiClient.get<{ success: boolean; transactions: StockTransaction[] }>('/transactions').catch(() => null)
      ]);

      let changed = false;

      if (prodRes?.success && Array.isArray(prodRes.products) && prodRes.products.length > 0) {
        this.products = prodRes.products.map((p: any) => ({
          ...p,
          product_id: String(p.product_id),
          category_id: String(p.category_id),
          supplier_id: String(p.supplier_id),
          sku: p.sku || `SKU-${p.product_id}`,
          name: p.product_name || p.name,
          image_url: p.image_url || ''
        }));

        this.inventory = prodRes.products.map((p: any) => ({
          inventory_id: `inv-${p.product_id}`,
          product_id: String(p.product_id),
          current_stock: p.current_stock ?? 0,
          reorder_level: p.reorder_level ?? 5,
          status: p.stock_status || 'IN_STOCK',
          last_updated: new Date().toISOString()
        }));
        changed = true;
      }

      if (catRes?.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
        this.categories = catRes.categories.map((c: any) => ({
          ...c,
          category_id: String(c.category_id),
          name: c.category_name || c.name,
          slug: c.slug || (c.category_name || c.name).toLowerCase().replace(/\s+/g, '-'),
          image_url: c.image_url || ''
        }));
        changed = true;
      }

      if (supRes?.success && Array.isArray(supRes.suppliers) && supRes.suppliers.length > 0) {
        this.suppliers = supRes.suppliers.map((s: any) => ({
          ...s,
          supplier_id: String(s.supplier_id)
        }));
        changed = true;
      }

      if (ordRes?.success && Array.isArray(ordRes.orders)) {
        this.orders = ordRes.orders.map((o: any) => ({
          ...o,
          order_id: String(o.order_id),
          customer_id: String(o.customer_id || o.user_id),
          customer_name: o.customer_name || 'Customer',
          customer_email: o.customer_email || '',
          customer_phone: o.customer_phone || '',
          tax: o.tax ?? +(Number(o.total || o.total_amount || 0) * 0.08).toFixed(2),
          shipping_fee: o.shipping_fee ?? 0,
          total: parseFloat(String(o.total || o.total_amount || 0))
        }));
        changed = true;
      }

      if (txRes?.success && Array.isArray(txRes.transactions)) {
        this.transactions = txRes.transactions.map((t: any) => ({
          ...t,
          transaction_id: String(t.transaction_id),
          product_id: String(t.product_id),
          product_name: t.product_name || t.name || 'Product',
          transaction_date: t.transaction_date || t.created_at || new Date().toISOString()
        }));
        changed = true;
      }

      this.backendSynced = true;
      if (changed) {
        this.persist();
      }
    } catch (err) {
      console.warn('Backend sync error:', err);
    }
  }

  // --- Products & Inventory Queries ---

  public getProductsWithInventory(): ProductWithInventory[] {
    const categoryMap = new Map(this.categories.map(c => [String(c.category_id), c.name]));
    const supplierMap = new Map(this.suppliers.map(s => [String(s.supplier_id), s.supplier_name]));
    const invMap = new Map(this.inventory.map(i => [String(i.product_id), i]));

    return this.products.map(p => {
      const inv = invMap.get(String(p.product_id));
      const stock = inv ? inv.current_stock : 0;
      const reorder = inv ? inv.reorder_level : 5;
      const status = stock === 0 ? 'OUT_OF_STOCK' : stock <= reorder ? 'LOW_STOCK' : 'IN_STOCK';

      return {
        ...p,
        current_stock: stock,
        reorder_level: reorder,
        stock_status: status,
        category_name: categoryMap.get(String(p.category_id)) || 'Uncategorized',
        supplier_name: supplierMap.get(String(p.supplier_id)) || 'Unknown Supplier'
      };
    });
  }

  public getProductById(productId: string | number): ProductWithInventory | undefined {
    const sId = String(productId);
    return this.getProductsWithInventory().find(p => String(p.product_id) === sId);
  }

  public getCategories(): Category[] {
    return this.categories.map(cat => ({
      ...cat,
      product_count: this.products.filter(p => String(p.category_id) === String(cat.category_id)).length
    }));
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public getInventory(): Inventory[] {
    return [...this.inventory];
  }

  public getOrders(): Order[] {
    return [...this.orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getOrderById(orderId: string | number): Order | undefined {
    const sId = String(orderId);
    return this.orders.find(o => String(o.order_id) === sId);
  }

  public getCustomerOrders(customerId?: string | number): Order[] {
    const targetId = customerId ? String(customerId) : (this.currentUser ? String(this.currentUser.user_id) : '');
    const userEmail = this.currentUser?.email || '';
    return this.orders
      .filter(o => (targetId && String(o.customer_id) === targetId) || (userEmail && o.customer_email === userEmail))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getTransactions(): StockTransaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }

  // --- Cart Management ---

  public getCart(): CartItem[] {
    const allProducts = this.getProductsWithInventory();
    const prodMap = new Map(allProducts.map(p => [String(p.product_id), p]));

    return this.cart
      .map(item => {
        const live = prodMap.get(String(item.product.product_id));
        if (!live) return null;
        return {
          product: live,
          quantity: Math.min(item.quantity, Math.max(live.current_stock, 1))
        };
      })
      .filter((item): item is CartItem => item !== null);
  }

  public addToCart(productId: string | number, quantity = 1): { success: boolean; message?: string } {
    const prod = this.getProductById(productId);
    if (!prod) return { success: false, message: 'Product not found' };
    if (prod.current_stock <= 0) return { success: false, message: 'Product is currently out of stock' };

    const sId = String(productId);
    const existingIndex = this.cart.findIndex(i => String(i.product.product_id) === sId);
    if (existingIndex > -1) {
      const currentQty = this.cart[existingIndex].quantity;
      if (currentQty + quantity > prod.current_stock) {
        return { success: false, message: `Only ${prod.current_stock} units available in stock.` };
      }
      this.cart[existingIndex].quantity += quantity;
    } else {
      if (quantity > prod.current_stock) {
        return { success: false, message: `Only ${prod.current_stock} units available in stock.` };
      }
      this.cart.push({ product: prod, quantity });
    }

    this.persist();
    return { success: true };
  }

  public updateCartQuantity(productId: string | number, quantity: number) {
    const sId = String(productId);
    if (quantity <= 0) {
      this.removeFromCart(sId);
      return;
    }
    const prod = this.getProductById(sId);
    if (!prod) return;

    const targetQty = Math.min(quantity, prod.current_stock);
    const existing = this.cart.find(i => String(i.product.product_id) === sId);
    if (existing) {
      existing.quantity = targetQty;
      this.persist();
    }
  }

  public removeFromCart(productId: string | number) {
    const sId = String(productId);
    this.cart = this.cart.filter(i => String(i.product.product_id) !== sId);
    this.persist();
  }

  public clearCart() {
    this.cart = [];
    this.persist();
  }

  // --- Transactional Order Placement (PostgreSQL ACID Transaction) ---
  public async placeOrder(customerData: {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    const cartItems = this.getCart();
    if (cartItems.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty cart.' };
    }

    const userId = this.currentUser ? this.currentUser.user_id : 'usr-cust-01';
    try {
      const payload = {
        userId: userId,
        user_id: userId,
        fullName: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
        shipping_address: customerData.shippingAddress,
        shippingAddress: customerData.shippingAddress,
        items: cartItems.map(item => ({
          product_id: item.product.product_id,
          quantity: item.quantity
        }))
      };

      const res = await apiClient.post<{ success: boolean; order?: Order; error?: string }>('/orders', payload);
      if (res.success && res.order) {
        this.cart = [];
        this.orders.unshift(res.order);
        await this.syncWithBackend();
        this.persist();
        return { success: true, order: res.order };
      } else if (res.error) {
        return { success: false, error: res.error };
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (errorObj?.message && errorObj.message.includes('Rolled Back')) {
        return { success: false, error: errorObj.message };
      }
      console.warn('Backend order transaction unreachable, executing local ACID fallback:', err);
    }

    // Local atomic fallback
    for (const item of cartItems) {
      const inv = this.inventory.find(i => String(i.product_id) === String(item.product.product_id));
      if (!inv || inv.current_stock < item.quantity) {
        return {
          success: false,
          error: `Transaction Rolled Back: Insufficient inventory for "${item.product.name}". Available: ${inv ? inv.current_stock : 0}, Requested: ${item.quantity}.`
        };
      }
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    cartItems.forEach((item, index) => {
      const itemSubtotal = +(item.product.selling_price * item.quantity).toFixed(2);
      subtotal += itemSubtotal;

      orderItems.push({
        order_item_id: `item-${orderId}-${index + 1}`,
        order_id: orderId,
        product_id: item.product.product_id,
        product_name: item.product.name,
        unit_price: item.product.selling_price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        image_url: item.product.image_url
      });

      const invIndex = this.inventory.findIndex(i => String(i.product_id) === String(item.product.product_id));
      if (invIndex > -1) {
        const newStock = this.inventory[invIndex].current_stock - item.quantity;
        this.inventory[invIndex].current_stock = newStock;
        this.inventory[invIndex].last_updated = timestamp;
        this.inventory[invIndex].status =
          newStock === 0
            ? 'OUT_OF_STOCK'
            : newStock <= this.inventory[invIndex].reorder_level
            ? 'LOW_STOCK'
            : 'IN_STOCK';
      }

      this.transactions.unshift({
        transaction_id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        product_id: item.product.product_id,
        product_name: item.product.name,
        transaction_type: 'STOCK_OUT',
        quantity: -item.quantity,
        reference_id: orderId,
        transaction_date: timestamp,
        notes: `Customer Order: ${orderId}`
      });
    });

    const tax = +(subtotal * 0.08).toFixed(2);
    const shippingFee = subtotal > 50 ? 0 : 5.00;
    const total = +(subtotal + tax + shippingFee).toFixed(2);

    const newOrder: Order = {
      order_id: orderId,
      customer_id: this.currentUser ? this.currentUser.user_id : 'usr-cust-01',
      customer_name: customerData.fullName,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      shipping_address: customerData.shippingAddress,
      subtotal: +subtotal.toFixed(2),
      tax,
      shipping_fee: shippingFee,
      total,
      status: 'CONFIRMED',
      created_at: timestamp,
      items: orderItems
    };

    this.orders.unshift(newOrder);
    this.cart = [];
    this.persist();
    return { success: true, order: newOrder };
  }

  // --- Admin CRUD Operations ---

  public addProduct(data: {
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
  }): ProductWithInventory {
    const productId = `prod-${Date.now().toString().slice(-4)}`;
    const timestamp = new Date().toISOString();

    const newProduct: Product = {
      product_id: productId,
      name: data.name,
      sku: data.sku,
      description: data.description,
      category_id: String(data.category_id),
      supplier_id: String(data.supplier_id),
      selling_price: data.selling_price,
      cost_price: data.cost_price,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      created_at: timestamp
    };

    const initialStock = Number(data.initial_stock) || 0;
    const reorderLevel = Number(data.reorder_level) || 5;
    const status = initialStock === 0 ? 'OUT_OF_STOCK' : initialStock <= reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';

    const newInventory: Inventory = {
      inventory_id: `inv-${Date.now().toString().slice(-4)}`,
      product_id: productId,
      current_stock: initialStock,
      reorder_level: reorderLevel,
      status,
      last_updated: timestamp
    };

    this.products.unshift(newProduct);
    this.inventory.unshift(newInventory);

    if (initialStock > 0) {
      this.transactions.unshift({
        transaction_id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        product_id: productId,
        product_name: data.name,
        transaction_type: 'STOCK_IN',
        quantity: initialStock,
        reference_id: `INIT-${productId}`,
        transaction_date: timestamp,
        notes: 'Initial inventory intake upon product creation'
      });
    }

    this.persist();

    // Asynchronously notify backend
    apiClient.post('/products', {
      product_name: data.name,
      description: data.description,
      category_id: data.category_id,
      supplier_id: data.supplier_id,
      selling_price: data.selling_price,
      cost_price: data.cost_price,
      image_url: data.image_url,
      initial_stock: data.initial_stock,
      reorder_level: data.reorder_level
    }).then(() => this.syncWithBackend()).catch(() => {});

    return this.getProductById(productId)!;
  }

  public updateProduct(productId: string | number, data: Partial<Product>) {
    const sId = String(productId);
    const index = this.products.findIndex(p => String(p.product_id) === sId);
    if (index > -1) {
      this.products[index] = { ...this.products[index], ...data };
      this.persist();
    }

    apiClient.put(`/products/${sId}`, data).then(() => this.syncWithBackend()).catch(() => {});
  }

  public deleteProduct(productId: string | number) {
    const sId = String(productId);
    this.products = this.products.filter(p => String(p.product_id) !== sId);
    this.inventory = this.inventory.filter(i => String(i.product_id) !== sId);
    this.cart = this.cart.filter(c => String(c.product.product_id) !== sId);
    this.persist();

    apiClient.delete(`/products/${sId}`).then(() => this.syncWithBackend()).catch(() => {});
  }

  // Categories CRUD
  public addCategory(data: { name: string; slug: string; description: string; image_url?: string }): Category {
    const newCat: Category = {
      category_id: `cat-${Date.now().toString().slice(-4)}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      product_count: 0
    };
    this.categories.push(newCat);
    this.persist();

    apiClient.post('/categories', { category_name: data.name, description: data.description })
      .then(() => this.syncWithBackend()).catch(() => {});

    return newCat;
  }

  public updateCategory(categoryId: string | number, data: Partial<Category>) {
    const sId = String(categoryId);
    const index = this.categories.findIndex(c => String(c.category_id) === sId);
    if (index > -1) {
      this.categories[index] = { ...this.categories[index], ...data };
      this.persist();
    }

    apiClient.put(`/categories/${sId}`, { category_name: data.name, description: data.description })
      .then(() => this.syncWithBackend()).catch(() => {});
  }

  public deleteCategory(categoryId: string | number) {
    const sId = String(categoryId);
    this.categories = this.categories.filter(c => String(c.category_id) !== sId);
    this.persist();

    apiClient.delete(`/categories/${sId}`).then(() => this.syncWithBackend()).catch(() => {});
  }

  // Suppliers CRUD
  public addSupplier(data: Omit<Supplier, 'supplier_id' | 'created_at'>): Supplier {
    const newSup: Supplier = {
      supplier_id: `sup-${Date.now().toString().slice(-4)}`,
      ...data,
      created_at: new Date().toISOString()
    };
    this.suppliers.push(newSup);
    this.persist();

    apiClient.post('/suppliers', data).then(() => this.syncWithBackend()).catch(() => {});
    return newSup;
  }

  public updateSupplier(supplierId: string | number, data: Partial<Supplier>) {
    const sId = String(supplierId);
    const index = this.suppliers.findIndex(s => String(s.supplier_id) === sId);
    if (index > -1) {
      this.suppliers[index] = { ...this.suppliers[index], ...data };
      this.persist();
    }

    apiClient.put(`/suppliers/${sId}`, data).then(() => this.syncWithBackend()).catch(() => {});
  }

  public deleteSupplier(supplierId: string | number) {
    const sId = String(supplierId);
    this.suppliers = this.suppliers.filter(s => String(s.supplier_id) !== sId);
    this.persist();

    apiClient.delete(`/suppliers/${sId}`).then(() => this.syncWithBackend()).catch(() => {});
  }

  // Restock & Inventory Update
  public restockProduct(productId: string | number, quantityToAdd: number, notes?: string) {
    const sId = String(productId);
    const invIndex = this.inventory.findIndex(i => String(i.product_id) === sId);
    const prod = this.products.find(p => String(p.product_id) === sId);
    if (invIndex === -1 || !prod) return;

    const timestamp = new Date().toISOString();
    const newStock = this.inventory[invIndex].current_stock + quantityToAdd;
    this.inventory[invIndex].current_stock = newStock;
    this.inventory[invIndex].last_updated = timestamp;
    this.inventory[invIndex].status =
      newStock === 0
        ? 'OUT_OF_STOCK'
        : newStock <= this.inventory[invIndex].reorder_level
        ? 'LOW_STOCK'
        : 'IN_STOCK';

    this.transactions.unshift({
      transaction_id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      product_id: sId,
      product_name: prod.name,
      transaction_type: 'STOCK_IN',
      quantity: quantityToAdd,
      reference_id: `RESTOCK-${Date.now().toString().slice(-6)}`,
      transaction_date: timestamp,
      notes: notes || 'Admin restock replenishment'
    });

    this.persist();

    apiClient.put(`/inventory/${sId}`, { restockAmount: quantityToAdd, notes })
      .then(() => this.syncWithBackend()).catch(() => {});
  }

  // Auth / Role State
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  public setCurrentUser(user: User | null): User | null {
    this.currentUser = user;
    this.persist();
    return user;
  }

  public switchRole(role: UserRole) {
    if (role === 'admin') {
      this.currentUser = DEMO_USERS[0]; // admin
    } else {
      this.currentUser = DEMO_USERS[1]; // Alex Morgan
    }
    this.persist();
  }

  public async loginWithCredentials(identifier: string, pass: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const id = identifier.trim().toLowerCase();
    const password = pass.trim();

    // 1. Try real PostgreSQL API
    try {
      const res = await apiClient.post<{ success: boolean; user?: User; message?: string }>('/auth/login', {
        username: identifier,
        email: identifier,
        password: password
      });
      if (res.success && res.user) {
        this.currentUser = res.user;
        this.persist();
        return { success: true, user: res.user };
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('Invalid') || e.message.includes('password'))) {
        return { success: false, message: e.message };
      }
    }

    // 2. Demo credentials fallback:
    // A. Customer: Alex Morgan / 123456
    if ((id === 'alex morgan' || id === 'alex.morgan@example.com' || id === 'alex') && password === '123456') {
      const user = DEMO_USERS[1];
      this.currentUser = user;
      this.persist();
      return { success: true, user };
    }

    // B. Admin: admin / 889842
    if ((id === 'admin' || id === 'admin@smartmart.com') && password === '889842') {
      const user = DEMO_USERS[0];
      this.currentUser = user;
      this.persist();
      return { success: true, user };
    }

    return { success: false, message: 'Invalid username/email or password.' };
  }

  public login(email: string, role: UserRole = 'customer'): User {
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
    } else {
      this.currentUser = {
        user_id: `usr-${Date.now().toString().slice(-4)}`,
        email,
        full_name: email.split('@')[0].replace('.', ' '),
        phone: '+1 (555) 000-0000',
        address: '123 Default Street, Seattle, WA',
        role,
        created_at: new Date().toISOString()
      };
    }
    this.persist();

    apiClient.post<{ success: boolean; user: User }>('/auth/login', { email, role })
      .then(res => {
        if (res.success && res.user) {
          this.currentUser = res.user;
          this.persist();
        }
      }).catch(() => {});

    return this.currentUser;
  }

  public register(data: { fullName: string; email: string; phone: string; address: string; role?: UserRole }): User {
    this.currentUser = {
      user_id: `usr-${Date.now().toString().slice(-4)}`,
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      address: data.address,
      role: data.role || 'customer',
      created_at: new Date().toISOString()
    };
    this.persist();

    apiClient.post<{ success: boolean; user: User }>('/auth/register', {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role || 'customer'
    }).then(res => {
      if (res.success && res.user) {
        this.currentUser = res.user;
        this.persist();
      }
    }).catch(() => {});

    return this.currentUser;
  }

  public logout() {
    this.currentUser = null;
    this.persist();
  }

  public resetAllToDefaults() {
    localStorage.clear();
    this.categories = [...INITIAL_CATEGORIES];
    this.suppliers = [...INITIAL_SUPPLIERS];
    this.products = [...INITIAL_PRODUCTS];
    this.inventory = [...INITIAL_INVENTORY];
    this.orders = [...INITIAL_ORDERS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.cart = [];
    this.currentUser = DEMO_USERS[1];
    this.persist();
  }
}

export const mockStore = new MockStore();
