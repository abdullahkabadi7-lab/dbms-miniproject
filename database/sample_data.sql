-- ============================================================================
-- SMARTMART: SAMPLE DATA FOR POSTGRESQL
-- Seeds realistic records across all 8 tables for demonstration & grading
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS
-- ----------------------------------------------------------------------------
INSERT INTO users (user_id, full_name, email, password, role, phone, address) VALUES
(1, 'admin', 'admin@smartmart.com', '889842', 'admin', '+1 (555) 019-2831', 'SmartMart Operations Hub, 100 Logistics Blvd, Seattle, WA'),
(2, 'Alex Morgan', 'alex.morgan@example.com', '123456', 'customer', '+1 (555) 789-0123', '742 Evergreen Terrace, Springfield, OR 97477'),
(3, 'Jordan Lee', 'jordan.lee@example.com', '123456', 'customer', '+1 (555) 456-7890', '1088 Point Reyes Station, Marin County, CA 94956');

SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Groceries & Staples', 'Farm-fresh pulses, organic grains, premium cooking oils, and artisanal spices.'),
(2, 'Beverages & Cold Brews', 'Cold-pressed botanical juices, single-origin coffees, and sparkling mineral waters.'),
(3, 'Dairy & Chilled Foods', 'Aged farm cheddar, pasteurized whole cream milk, Greek yogurts, and butter.'),
(4, 'Artisanal Bakery', 'Naturally leavened sourdough, brioche buns, golden croissants, and rye bread.'),
(5, 'Gourmet Snacks', 'Kettle-cooked sea salt crisps, roasted smoked almonds, and dark cocoa truffles.'),
(6, 'Household & Eco Care', 'Biodegradable detergents, botanical surface sanitizers, and natural cleansers.'),
(7, 'Personal Wellness', 'Sulfate-free botanical shampoos, mineral sunscreens, and organic hydration balms.');

SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));

-- ----------------------------------------------------------------------------
-- 3. SUPPLIERS
-- ----------------------------------------------------------------------------
INSERT INTO suppliers (supplier_id, supplier_name, contact_person, phone, email, address) VALUES
(1, 'Apex Harvest Agritech', 'Marcus Vance', '+1 (555) 234-8901', 'm.vance@apexharvest.com', '440 Industrial Parkway, Salinas Valley, CA'),
(2, 'Alpine Springs Bottling Co.', 'Elena Rostova', '+1 (555) 982-1144', 'supply@alpinesprings.org', '120 Glacier Way, Boulder, CO'),
(3, 'Verdant Meadow Creamery', 'Thomas Sterling', '+1 (555) 431-7782', 'tsterling@verdantdairy.com', '88 Pasture Road, Lancaster, PA'),
(4, 'Levain Hearth Bakers Guild', 'Sophie Laurent', '+1 (555) 781-9920', 'orders@levainhearth.com', '502 Mill Street, Portland, OR'),
(5, 'BioClean Logistics & Labs', 'David Chen', '+1 (555) 604-3321', 'chen.d@biocleanlogistics.com', '77 Commerce Loop, Austin, TX');

SELECT setval('suppliers_supplier_id_seq', (SELECT MAX(supplier_id) FROM suppliers));

-- ----------------------------------------------------------------------------
-- 4. PRODUCTS
-- ----------------------------------------------------------------------------
INSERT INTO products (product_id, category_id, supplier_id, product_name, description, selling_price, cost_price, unit, image_url) VALUES
(1, 1, 1, 'Cold-Pressed Sicilian Extra Virgin Olive Oil 750ml', 'First cold-pressed single estate extra virgin olive oil harvested from centuries-old Nocellara del Belice olive groves. Unfiltered, fruity, and peppery finish.', 24.99, 14.50, 'bottle', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'),
(2, 1, 1, 'Himalayan Organic Pink Salt Fine Grain 1kg', 'Pure, unrefined mineral salt harvested by hand from ancient sea salt deposits deep in the Himalayan mountains. Contains 84 essential trace minerals.', 8.50, 3.20, 'pouch', 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&w=800&q=80'),
(3, 1, 1, 'Aged Basmati Reserve Grain Rice 5kg', 'Matured for two full harvest seasons to yield exceptional fluffiness, aroma, and extra-long slender grains that double in size upon cooking.', 29.00, 18.00, 'bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'),
(4, 2, 2, 'Ethiopian Yirgacheffe Single-Origin Cold Brew 330ml', 'Slow steeped for 20 hours in pure alpine spring water. Notes of bergamot, candied lemon zest, and delicate jasmine with velvety zero-bitterness clarity.', 5.75, 2.40, 'can', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'),
(5, 2, 2, 'Ceremonial Grade Uji Matcha Elixir 250ml', 'First spring harvest green tea tencha stone-ground in Kyoto, blended with oat milk and Madagascar vanilla pods.', 6.95, 3.10, 'bottle', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80'),
(6, 2, 2, 'Sparkling Sicilian Blood Orange Mineral Water 4x330ml', 'Naturally effervescent mineral water infused with sun-ripened Tarocco blood oranges and volcanic citrus blossom extract.', 9.50, 4.80, 'pack', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'),
(7, 3, 3, 'Aged Farmhouse Cheddar 18-Month 300g', 'Clothbound unpasteurized grass-fed cows milk cheddar slowly cave-aged for profound crumbly sharpness and crystalline tyrosine crunches.', 14.50, 8.20, 'wedge', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80'),
(8, 3, 3, 'Greek Organic Strained Sheep Milk Yogurt 500g', 'Authentic triple-strained mountain valley yogurt with 10% natural butterfat. Lusciously thick with live probiotic cultures.', 7.25, 3.80, 'tub', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'),
(9, 4, 4, 'San Francisco Heritage Sourdough Batard 700g', 'Naturally leavened using a 90-year-old wild yeast starter culture. Blistering bronze crust, airy open crumb, and deep fermented lactic tang.', 9.00, 3.20, 'loaf', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80'),
(10, 4, 4, 'French Butter Brioche Buns (4-Pack)', 'Enriched with 84% churned Normandy butter and golden pasture-raised egg yolks for feathery softness and caramelized sheen.', 8.50, 3.90, 'pack', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80'),
(11, 5, 1, 'Truffle & Rosemary Kettle Crisps 150g', 'Thick-cut russet potatoes slow-cooked in small batches, dusted with hand-gathered black winter truffle and wild mountain rosemary.', 5.95, 2.10, 'bag', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80'),
(12, 6, 5, 'Botanical Surface Cleanser Concentrate 500ml', 'Plant-derived antimicrobial formula with eucalyptus, thyme, and tea tree extracts. 100% biodegradable and zero harsh residues.', 11.25, 4.50, 'bottle', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80');

SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products));

-- ----------------------------------------------------------------------------
-- 5. INVENTORY
-- Initial stock levels (some healthy stock, some low stock for demonstration)
-- ----------------------------------------------------------------------------
INSERT INTO inventory (inventory_id, product_id, quantity_in_stock, reorder_level, last_updated) VALUES
(1, 1, 48, 10, CURRENT_TIMESTAMP),
(2, 2, 75, 15, CURRENT_TIMESTAMP),
(3, 3, 22, 10, CURRENT_TIMESTAMP),
(4, 4, 14, 15, CURRENT_TIMESTAMP),  -- Low stock!
(5, 5, 30, 8, CURRENT_TIMESTAMP),
(6, 6, 40, 10, CURRENT_TIMESTAMP),
(7, 7, 3, 8, CURRENT_TIMESTAMP),   -- Very low stock!
(8, 8, 25, 6, CURRENT_TIMESTAMP),
(9, 9, 18, 5, CURRENT_TIMESTAMP),
(10, 10, 20, 5, CURRENT_TIMESTAMP),
(11, 11, 60, 12, CURRENT_TIMESTAMP),
(12, 12, 35, 10, CURRENT_TIMESTAMP);

SELECT setval('inventory_inventory_id_seq', (SELECT MAX(inventory_id) FROM inventory));

-- ----------------------------------------------------------------------------
-- 6. ORDERS
-- ----------------------------------------------------------------------------
INSERT INTO orders (order_id, user_id, order_date, total_amount, status, shipping_address) VALUES
(1, 2, CURRENT_TIMESTAMP - INTERVAL '3 days', 53.98, 'CONFIRMED', '742 Evergreen Terrace, Springfield, OR 97477'),
(2, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', 43.45, 'CONFIRMED', '742 Evergreen Terrace, Springfield, OR 97477'),
(3, 3, CURRENT_TIMESTAMP - INTERVAL '5 hours', 33.49, 'CONFIRMED', '1088 Point Reyes Station, Marin County, CA 94956');

SELECT setval('orders_order_id_seq', (SELECT MAX(order_id) FROM orders));

-- ----------------------------------------------------------------------------
-- 7. ORDER_ITEMS
-- ----------------------------------------------------------------------------
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, subtotal) VALUES
-- Order 1 items
(1, 1, 1, 2, 24.99, 49.98),
(2, 1, 4, 1, 5.75, 5.75),
-- Order 2 items
(3, 2, 3, 1, 29.00, 29.00),
(4, 2, 7, 1, 14.50, 14.50),
-- Order 3 items
(5, 3, 1, 1, 24.99, 24.99),
(6, 3, 2, 1, 8.50, 8.50);

SELECT setval('order_items_order_item_id_seq', (SELECT MAX(order_item_id) FROM order_items));

-- ----------------------------------------------------------------------------
-- 8. STOCK_TRANSACTIONS
-- ----------------------------------------------------------------------------
INSERT INTO stock_transactions (transaction_id, product_id, supplier_id, transaction_type, quantity, unit_price, total_amount, reference_id, reference_type, created_at) VALUES
-- Inward wholesale shipments (STOCK_IN)
(1, 1, 1, 'STOCK_IN', 50, 14.50, 725.00, 'BATCH-2026-001', 'RESTOCK', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, 2, 1, 'STOCK_IN', 80, 3.20, 256.00, 'BATCH-2026-001', 'RESTOCK', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(3, 3, 1, 'STOCK_IN', 25, 18.00, 450.00, 'BATCH-2026-002', 'RESTOCK', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(4, 4, 2, 'STOCK_IN', 20, 2.40, 48.00, 'BATCH-2026-003', 'RESTOCK', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(5, 7, 3, 'STOCK_IN', 15, 8.20, 123.00, 'BATCH-2026-004', 'RESTOCK', CURRENT_TIMESTAMP - INTERVAL '5 days'),
-- Outward order fulfillment deductions (STOCK_OUT)
(6, 1, NULL, 'STOCK_OUT', -2, 24.99, 49.98, '1', 'ORDER', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(7, 4, NULL, 'STOCK_OUT', -1, 5.75, 5.75, '1', 'ORDER', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(8, 3, NULL, 'STOCK_OUT', -1, 29.00, 29.00, '2', 'ORDER', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(9, 7, NULL, 'STOCK_OUT', -1, 14.50, 14.50, '2', 'ORDER', CURRENT_TIMESTAMP - INTERVAL '1 day');

SELECT setval('stock_transactions_transaction_id_seq', (SELECT MAX(transaction_id) FROM stock_transactions));
