-- ============================================================================
-- SMARTMART: DEMONSTRATION SQL QUERIES FOR DBMS PRESENTATION
-- Covers DML, Complex Joins, Aggregations, Search, and ACID Transactions
-- ============================================================================

-- ============================================================================
-- SECTION 1: BASIC DML OPERATIONS (SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- 1.1 SELECT with WHERE and ORDER BY
-- Retrieve all products priced under $20 sorted by price descending
SELECT 
    product_id, 
    product_name, 
    selling_price, 
    cost_price, 
    (selling_price - cost_price) AS profit_margin
FROM products
WHERE selling_price < 20.00
ORDER BY selling_price DESC;

-- 1.2 INSERT
-- Add a new supplier to the system
INSERT INTO suppliers (supplier_name, contact_person, phone, email, address)
VALUES ('Artisan Milling Co.', 'Lucas Bennett', '+1 (555) 303-9121', 'orders@artisanmilling.org', '710 Grain Elevator Way, Minneapolis, MN');

-- 1.3 UPDATE
-- Update supplier contact information
UPDATE suppliers
SET phone = '+1 (555) 303-9999', address = '710 Grain Way, Suite 400, Minneapolis, MN'
WHERE supplier_name = 'Artisan Milling Co.';

-- 1.4 DELETE
-- Delete the newly created supplier (safe deletion when no child products exist)
DELETE FROM suppliers
WHERE supplier_name = 'Artisan Milling Co.';


-- ============================================================================
-- SECTION 2: PRODUCT SEARCH & FILTERING QUERIES
-- ============================================================================

-- 2.1 Keyword search across product name and description
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    p.selling_price,
    i.quantity_in_stock
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN inventory i ON p.product_id = i.product_id
WHERE p.product_name ILIKE '%organic%' OR p.description ILIKE '%organic%'
ORDER BY p.selling_price ASC;

-- 2.2 Category & Price Range Filter
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    p.selling_price
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE c.category_name = 'Beverages & Cold Brews'
  AND p.selling_price BETWEEN 5.00 AND 10.00;


-- ============================================================================
-- SECTION 3: INVENTORY MONITORING (LOW-STOCK PRODUCTS)
-- ============================================================================

-- 3.1 Identify products needing urgent restocking (stock <= reorder_level)
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    s.supplier_name,
    s.contact_person AS supplier_contact,
    s.phone AS supplier_phone,
    i.quantity_in_stock,
    i.reorder_level,
    (i.reorder_level - i.quantity_in_stock) AS deficit_units,
    CASE 
        WHEN i.quantity_in_stock = 0 THEN 'OUT OF STOCK'
        WHEN i.quantity_in_stock <= i.reorder_level THEN 'LOW STOCK'
        ELSE 'OPTIMAL'
    END AS stock_status
FROM inventory i
JOIN products p ON i.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE i.quantity_in_stock <= i.reorder_level
ORDER BY i.quantity_in_stock ASC;


-- ============================================================================
-- SECTION 4: MULTI-TABLE RELATIONAL JOINS
-- ============================================================================

-- 4.1 Complete Product Catalog with Supplier and Stock Status (3-Table JOIN)
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    COALESCE(s.supplier_name, 'No Supplier') AS supplier_name,
    p.selling_price,
    p.cost_price,
    i.quantity_in_stock,
    i.reorder_level,
    i.last_updated
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
JOIN inventory i ON p.product_id = i.product_id
ORDER BY c.category_name, p.product_name;

-- 4.2 Detailed Order Breakdown with Customer and Line Items (4-Table JOIN)
SELECT 
    o.order_id,
    o.order_date,
    o.status AS order_status,
    u.full_name AS customer_name,
    u.email AS customer_email,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal,
    o.total_amount AS order_total_amount
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_id = 1
ORDER BY oi.order_item_id;


-- ============================================================================
-- SECTION 5: AGGREGATE QUERIES (COUNT, SUM, AVG, GROUP BY)
-- ============================================================================

-- 5.1 Sales & Revenue Summary by Customer
SELECT 
    u.user_id,
    u.full_name AS customer_name,
    u.email,
    COUNT(o.order_id) AS total_orders_placed,
    COALESCE(SUM(o.total_amount), 0.00) AS total_expenditure,
    COALESCE(ROUND(AVG(o.total_amount), 2), 0.00) AS average_order_value
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.role = 'customer'
GROUP BY u.user_id, u.full_name, u.email
ORDER BY total_expenditure DESC;

-- 5.2 Category Inventory Valuation & Statistics
SELECT 
    c.category_name,
    COUNT(p.product_id) AS product_count,
    COALESCE(SUM(i.quantity_in_stock), 0) AS total_units_in_stock,
    ROUND(AVG(p.selling_price), 2) AS avg_retail_price,
    ROUND(SUM(p.cost_price * i.quantity_in_stock), 2) AS total_inventory_cost_value,
    ROUND(SUM(p.selling_price * i.quantity_in_stock), 2) AS total_retail_valuation
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN inventory i ON p.product_id = i.product_id
GROUP BY c.category_name
ORDER BY total_retail_valuation DESC;

-- 5.3 Stock Transaction Ledger Summary by Transaction Type
SELECT 
    transaction_type,
    COUNT(*) AS total_transactions,
    SUM(ABS(quantity)) AS total_units_moved,
    ROUND(SUM(total_amount), 2) AS total_financial_value
FROM stock_transactions
GROUP BY transaction_type;


-- ============================================================================
-- SECTION 6: INVENTORY REPLENISHMENT (RESTOCKING)
-- ============================================================================

-- When a wholesale batch arrives, update stock and insert journal transaction:
BEGIN;

-- 1. Increase current stock in inventory
UPDATE inventory
SET quantity_in_stock = quantity_in_stock + 20,
    last_updated = CURRENT_TIMESTAMP
WHERE product_id = 7;

-- 2. Insert STOCK_IN audit transaction record
INSERT INTO stock_transactions (
    product_id, 
    supplier_id, 
    transaction_type, 
    quantity, 
    unit_price, 
    total_amount, 
    reference_id, 
    reference_type
) VALUES (
    7, 
    3, 
    'STOCK_IN', 
    20, 
    8.20, 
    164.00, 
    'RESTOCK-2026-99', 
    'RESTOCK'
);

COMMIT;


-- ============================================================================
-- SECTION 7: DEMONSTRATION ACID TRANSACTION (ORDER PLACEMENT)
-- Demonstrates atomic BEGIN, FOR UPDATE row locking, stock validation,
-- multi-table synchronization, and COMMIT / ROLLBACK.
-- ============================================================================

-- Scenario A: Successful Order Execution (Customer orders 2 units of product 1)
BEGIN;

-- Step 1: Lock the inventory row to prevent concurrent race conditions
SELECT quantity_in_stock 
FROM inventory 
WHERE product_id = 1 
FOR UPDATE;

-- Step 2: (Application validates stock >= 2. If valid, proceed:)

-- Step 3: Insert the header into `orders`
INSERT INTO orders (user_id, total_amount, status, shipping_address)
VALUES (2, 49.98, 'CONFIRMED', '742 Evergreen Terrace, Springfield, OR 97477')
RETURNING order_id;

-- Assume returned order_id is 4:

-- Step 4: Insert line item into `order_items`
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
VALUES (4, 1, 2, 24.99, 49.98);

-- Step 5: Atomically reduce inventory
UPDATE inventory
SET quantity_in_stock = quantity_in_stock - 2,
    last_updated = CURRENT_TIMESTAMP
WHERE product_id = 1;

-- Step 6: Create immutable audit trail in `stock_transactions`
INSERT INTO stock_transactions (
    product_id, 
    supplier_id, 
    transaction_type, 
    quantity, 
    unit_price, 
    total_amount, 
    reference_id, 
    reference_type
) VALUES (
    1, 
    NULL, 
    'STOCK_OUT', 
    -2, 
    24.99, 
    49.98, 
    '4', 
    'ORDER'
);

-- Step 7: Commit transaction
COMMIT;


-- Scenario B: Rollback Demonstration (Insufficient Stock)
BEGIN;

-- Check inventory with row lock
SELECT quantity_in_stock 
FROM inventory 
WHERE product_id = 7 
FOR UPDATE;

-- If requested quantity (e.g. 50 units) exceeds quantity_in_stock (e.g. 3 units),
-- the transaction must be aborted to guarantee ACID consistency:
ROLLBACK;
