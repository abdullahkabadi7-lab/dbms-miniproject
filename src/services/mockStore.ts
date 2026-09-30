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
  private currentUser: User = DEMO_USERS[1]; // Alex Morgan (customer) by default
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
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
      this.currentUser = storedUser ? JSON.parse(storedUser) : DEMO_USERS[1];
    } catch {
      this.categories = [...INITIAL_CATEGORIES];
      this.suppliers = [...INITIAL_SUPPLIERS];
      this.products = [...INITIAL_PRODUCTS];
      this.inventory = [...INITIAL_INVENTORY];
      this.orders = [...INITIAL_ORDERS];
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.cart = [];
      this.currentUser = DEMO_USERS[1];
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

  // --- Products & Inventory Queries ---

  public getProductsWithInventory(): ProductWithInventory[] {
    const categoryMap = new Map(this.categories.map(c => [c.category_id, c.name]));
    const supplierMap = new Map(this.suppliers.map(s => [s.supplier_id, s.supplier_name]));
    const invMap = new Map(this.inventory.map(i => [i.product_id, i]));

    return this.products.map(p => {
      const inv = invMap.get(p.product_id);
      const stock = inv ? inv.current_stock : 0;
      const reorder = inv ? inv.reorder_level : 5;
      const status = stock === 0 ? 'OUT_OF_STOCK' : stock <= reorder ? 'LOW_STOCK' : 'IN_STOCK';

      return {
        ...p,
        current_stock: stock,
        reorder_level: reorder,
        stock_status: status,
        category_name: categoryMap.get(p.category_id) || 'Uncategorized',
        supplier_name: supplierMap.get(p.supplier_id) || 'Unknown Supplier'
      };
    });
  }

  public getProductById(productId: string): ProductWithInventory | undefined {
    return this.getProductsWithInventory().find(p => p.product_id === productId);
  }

  public getCategories(): Category[] {
    return this.categories.map(cat => ({
      ...cat,
      product_count: this.products.filter(p => p.category_id === cat.category_id).length
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

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find(o => o.order_id === orderId);
  }

  public getCustomerOrders(customerId?: string): Order[] {
    const targetId = customerId || this.currentUser.user_id;
    return this.orders
      .filter(o => o.customer_id === targetId || o.customer_email === this.currentUser.email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getTransactions(): StockTransaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }

  // --- Cart Management ---

  public getCart(): CartItem[] {
    // Re-sync cart items with live product & inventory data
    const allProducts = this.getProductsWithInventory();
    const prodMap = new Map(allProducts.map(p => [p.product_id, p]));

    return this.cart
      .map(item => {
        const live = prodMap.get(item.product.product_id);
        if (!live) return null;
        return {
          product: live,
          quantity: Math.min(item.quantity, Math.max(live.current_stock, 1))
        };
      })
      .filter((item): item is CartItem => item !== null);
  }

  public addToCart(productId: string, quantity = 1): { success: boolean; message?: string } {
    const prod = this.getProductById(productId);
    if (!prod) return { success: false, message: 'Product not found' };
    if (prod.current_stock <= 0) return { success: false, message: 'Product is currently out of stock' };

    const existingIndex = this.cart.findIndex(i => i.product.product_id === productId);
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

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const prod = this.getProductById(productId);
    if (!prod) return;

    const targetQty = Math.min(quantity, prod.current_stock);
    const existing = this.cart.find(i => i.product.product_id === productId);
    if (existing) {
      existing.quantity = targetQty;
      this.persist();
    }
  }

  public removeFromCart(productId: string) {
    this.cart = this.cart.filter(i => i.product.product_id !== productId);
    this.persist();
  }

  public clearCart() {
    this.cart = [];
    this.persist();
  }

  // --- Real Transactional Order Placement ---
  // Mirrors PostgreSQL ACID Transaction:
  // BEGIN;
  // SELECT current_stock FROM inventory WHERE product_id = ... FOR UPDATE;
  // Check stock >= requested;
  // UPDATE inventory SET current_stock = current_stock - quantity;
  // INSERT INTO orders ...;
  // INSERT INTO order_items ...;
  // INSERT INTO stock_transactions ...;
  // COMMIT;

  public placeOrder(customerData: {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
  }): { success: boolean; order?: Order; error?: string } {
    const cartItems = this.getCart();
    if (cartItems.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty cart.' };
    }

    // Step 1: Stock verification check
    for (const item of cartItems) {
      const inv = this.inventory.find(i => i.product_id === item.product.product_id);
      if (!inv || inv.current_stock < item.quantity) {
        return {
          success: false,
          error: `Transaction Rolled Back: Insufficient inventory for "${item.product.name}". Available: ${inv ? inv.current_stock : 0}, Requested: ${item.quantity}.`
        };
      }
    }

    // Step 2: Atomic Execution
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    cartItems.forEach((item, index) => {
      const itemSubtotal = +(item.product.selling_price * item.quantity).toFixed(2);
      subtotal += itemSubtotal;

      // 2a. Order Item creation
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

      // 2b. Deduct stock from inventory
      const invIndex = this.inventory.findIndex(i => i.product_id === item.product.product_id);
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

      // 2c. Log Stock Transaction (SALE)
      this.transactions.unshift({
        transaction_id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        product_id: item.product.product_id,
        product_name: item.product.name,
        transaction_type: 'SALE',
        quantity: -item.quantity,
        reference_id: orderId,
        transaction_date: timestamp,
        notes: `Customer Order: ${orderId}`
      });
    });

    const tax = +(subtotal * 0.08).toFixed(2);
    const shippingFee = subtotal > 50 ? 0 : 5.00;
    const total = +(subtotal + tax + shippingFee).toFixed(2);

    // 2d. Create Order
    const newOrder: Order = {
      order_id: orderId,
      customer_id: this.currentUser.user_id,
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

    // 2e. Clear cart
    this.cart = [];

    this.persist();
    return { success: true, order: newOrder };
  }

  // --- Admin CRUD Operations ---

  public addProduct(data: {
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
  }): ProductWithInventory {
    const productId = `prod-${Date.now().toString().slice(-4)}`;
    const timestamp = new Date().toISOString();

    const newProduct: Product = {
      product_id: productId,
      name: data.name,
      sku: data.sku,
      description: data.description,
      category_id: data.category_id,
      supplier_id: data.supplier_id,
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
        transaction_type: 'RESTOCK',
        quantity: initialStock,
        reference_id: `INIT-${productId}`,
        transaction_date: timestamp,
        notes: 'Initial inventory intake upon product creation'
      });
    }

    this.persist();
    return this.getProductById(productId)!;
  }

  public updateProduct(productId: string, data: Partial<Product>) {
    const index = this.products.findIndex(p => p.product_id === productId);
    if (index > -1) {
      this.products[index] = { ...this.products[index], ...data };
      this.persist();
    }
  }

  public deleteProduct(productId: string) {
    this.products = this.products.filter(p => p.product_id !== productId);
    this.inventory = this.inventory.filter(i => i.product_id !== productId);
    this.cart = this.cart.filter(c => c.product.product_id !== productId);
    this.persist();
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
    return newCat;
  }

  public updateCategory(categoryId: string, data: Partial<Category>) {
    const index = this.categories.findIndex(c => c.category_id === categoryId);
    if (index > -1) {
      this.categories[index] = { ...this.categories[index], ...data };
      this.persist();
    }
  }

  public deleteCategory(categoryId: string) {
    this.categories = this.categories.filter(c => c.category_id !== categoryId);
    this.persist();
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
    return newSup;
  }

  public updateSupplier(supplierId: string, data: Partial<Supplier>) {
    const index = this.suppliers.findIndex(s => s.supplier_id === supplierId);
    if (index > -1) {
      this.suppliers[index] = { ...this.suppliers[index], ...data };
      this.persist();
    }
  }

  public deleteSupplier(supplierId: string) {
    this.suppliers = this.suppliers.filter(s => s.supplier_id !== supplierId);
    this.persist();
  }

  // Restock & Inventory Update
  public restockProduct(productId: string, quantityToAdd: number, notes?: string) {
    const invIndex = this.inventory.findIndex(i => i.product_id === productId);
    const prod = this.products.find(p => p.product_id === productId);
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

    // Log RESTOCK transaction
    this.transactions.unshift({
      transaction_id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      product_id: productId,
      product_name: prod.name,
      transaction_type: 'RESTOCK',
      quantity: quantityToAdd,
      reference_id: `RESTOCK-${Date.now().toString().slice(-6)}`,
      transaction_date: timestamp,
      notes: notes || 'Admin restock replenishment'
    });

    this.persist();
  }

  // Auth / Role State
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.persist();
  }

  public switchRole(role: UserRole) {
    if (role === 'admin') {
      this.currentUser = DEMO_USERS[0]; // Sarah Connor (admin)
    } else {
      this.currentUser = DEMO_USERS[1]; // Alex Morgan (customer)
    }
    this.persist();
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
    return this.currentUser;
  }

  public logout() {
    this.currentUser = DEMO_USERS[1]; // Fallback to demo customer
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
