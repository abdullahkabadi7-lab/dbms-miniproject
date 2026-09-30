import { Category, Supplier, Product, Inventory, StockTransaction, Order, OrderItem, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    category_id: 'cat-01',
    name: 'Groceries & Staples',
    slug: 'groceries',
    description: 'Farm-fresh pulses, organic grains, premium cooking oils, and artisanal spices.',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    product_count: 5
  },
  {
    category_id: 'cat-02',
    name: 'Beverages & Cold Brews',
    slug: 'beverages',
    description: 'Cold-pressed botanical juices, single-origin coffees, and sparkling mineral waters.',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    product_count: 4
  },
  {
    category_id: 'cat-03',
    name: 'Dairy & Chilled Foods',
    slug: 'dairy',
    description: 'Aged farm cheddar, pasteurized whole cream milk, Greek yogurts, and butter.',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    product_count: 4
  },
  {
    category_id: 'cat-04',
    name: 'Artisanal Bakery',
    slug: 'bakery',
    description: 'Naturally leavened sourdough, brioche buns, golden croissants, and rye bread.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    product_count: 3
  },
  {
    category_id: 'cat-05',
    name: 'Gourmet Snacks',
    slug: 'snacks',
    description: 'Kettle-cooked sea salt crisps, roasted smoked almonds, and dark cocoa truffles.',
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
    product_count: 3
  },
  {
    category_id: 'cat-06',
    name: 'Household & Eco Care',
    slug: 'household',
    description: 'Biodegradable detergents, botanical surface sanitizers, and natural cleansers.',
    image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    product_count: 3
  },
  {
    category_id: 'cat-07',
    name: 'Personal Wellness',
    slug: 'personal-care',
    description: 'Sulfate-free botanical shampoos, mineral sunscreens, and organic hydration balms.',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    product_count: 2
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    supplier_id: 'sup-01',
    supplier_name: 'Apex Harvest Agritech',
    contact_person: 'Marcus Vance',
    phone: '+1 (555) 234-8901',
    email: 'm.vance@apexharvest.com',
    address: '440 Industrial Parkway, Salinas Valley, CA',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    supplier_id: 'sup-02',
    supplier_name: 'Alpine Springs Bottling Co.',
    contact_person: 'Elena Rostova',
    phone: '+1 (555) 982-1144',
    email: 'supply@alpinesprings.org',
    address: '120 Glacier Way, Boulder, CO',
    created_at: '2026-01-12T09:30:00Z'
  },
  {
    supplier_id: 'sup-03',
    supplier_name: 'Verdant Meadow Creamery',
    contact_person: 'Thomas Sterling',
    phone: '+1 (555) 431-7782',
    email: 'tsterling@verdantdairy.com',
    address: '88 Pasture Road, Lancaster, PA',
    created_at: '2026-01-15T11:00:00Z'
  },
  {
    supplier_id: 'sup-04',
    supplier_name: 'Levain Hearth Bakers Guild',
    contact_person: 'Sophie Laurent',
    phone: '+1 (555) 781-9920',
    email: 'orders@levainhearth.com',
    address: '502 Mill Street, Portland, OR',
    created_at: '2026-01-18T14:15:00Z'
  },
  {
    supplier_id: 'sup-05',
    supplier_name: 'BioClean Logistics & Labs',
    contact_person: 'David Chen',
    phone: '+1 (555) 604-3321',
    email: 'chen.d@biocleanlogistics.com',
    address: '77 Commerce Loop, Austin, TX',
    created_at: '2026-01-20T16:45:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    product_id: 'prod-001',
    name: 'Cold-Pressed Sicilian Extra Virgin Olive Oil 750ml',
    sku: 'GRO-OIL-001',
    description: 'First cold-pressed single estate extra virgin olive oil harvested from centuries-old Nocellara del Belice olive groves. Unfiltered, fruity, and peppery finish.',
    category_id: 'cat-01',
    supplier_id: 'sup-01',
    selling_price: 24.99,
    cost_price: 14.50,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-01T10:00:00Z'
  },
  {
    product_id: 'prod-002',
    name: 'Himalayan Organic Pink Salt Fine Grain 1kg',
    sku: 'GRO-SLT-002',
    description: 'Pure, unrefined mineral salt harvested by hand from ancient sea salt deposits deep in the Himalayan mountains. Contains 84 essential trace minerals.',
    category_id: 'cat-01',
    supplier_id: 'sup-01',
    selling_price: 8.50,
    cost_price: 3.20,
    image_url: 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-01T10:15:00Z'
  },
  {
    product_id: 'prod-003',
    name: 'Aged Basmati Reserve Grain Rice 5kg',
    sku: 'GRO-RCE-003',
    description: 'Matured for two full harvest seasons to yield exceptional fluffiness, aroma, and extra-long slender grains that double in size upon cooking.',
    category_id: 'cat-01',
    supplier_id: 'sup-01',
    selling_price: 29.00,
    cost_price: 18.00,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-01T10:30:00Z'
  },
  {
    product_id: 'prod-004',
    name: 'Ethiopian Yirgacheffe Single-Origin Cold Brew 330ml',
    sku: 'BEV-CLD-004',
    description: 'Slow steeped for 20 hours in pure alpine spring water. Notes of bergamot, candied lemon zest, and delicate jasmine with velvety zero-bitterness clarity.',
    category_id: 'cat-02',
    supplier_id: 'sup-02',
    selling_price: 5.75,
    cost_price: 2.40,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-02T11:00:00Z'
  },
  {
    product_id: 'prod-005',
    name: 'Botanical Citrus Sparkling Tonic 4-Pack',
    sku: 'BEV-SPK-005',
    description: 'Infused with yuzu extract, Mediterranean rosemary distillate, and carbonated mountain spring water. Pure crisp effervescence with low natural sugar.',
    category_id: 'cat-02',
    supplier_id: 'sup-02',
    selling_price: 11.20,
    cost_price: 5.50,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-02T11:30:00Z'
  },
  {
    product_id: 'prod-006',
    name: 'Organic Ceremonial Grade Uji Matcha 50g',
    sku: 'BEV-MTC-006',
    description: 'Shade-grown in Kyoto and granite-stone ground. Ultra-vibrant emerald green with intense umami sweetness and sustained focused energy without jitter.',
    category_id: 'cat-02',
    supplier_id: 'sup-02',
    selling_price: 36.00,
    cost_price: 21.00,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-02T12:00:00Z'
  },
  {
    product_id: 'prod-007',
    name: 'Grass-Fed Pasture Butter Sea Salted 250g',
    sku: 'DAI-BTR-007',
    description: 'Slowly churned in small wooden vats from fresh grass-fed Jersey cow cream. Rich golden color, 84% butterfat, sprinkled with Brittany fleur de sel.',
    category_id: 'cat-03',
    supplier_id: 'sup-03',
    selling_price: 7.90,
    cost_price: 4.10,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-03T09:00:00Z'
  },
  {
    product_id: 'prod-008',
    name: 'Aged Farmhouse Cheddar 18-Month 300g',
    sku: 'DAI-CHD-008',
    description: 'Clothbound and cave-aged for eighteen months. Deeply savory with crunchy calcium lactate crystals and earthy hazelnut undertones.',
    category_id: 'cat-03',
    supplier_id: 'sup-03',
    selling_price: 14.50,
    cost_price: 8.00,
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-03T09:30:00Z'
  },
  {
    product_id: 'prod-009',
    name: 'Artisan Country Sourdough Boule 800g',
    sku: 'BAK-SRD-009',
    description: '48-hour wild-fermentation crusty round loaf made with freshly milled heirloom stoneground wheat flour and pure water. Crusty blistered dark crust with open aerated crumb.',
    category_id: 'cat-04',
    supplier_id: 'sup-04',
    selling_price: 9.50,
    cost_price: 3.50,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-04T07:00:00Z'
  },
  {
    product_id: 'prod-010',
    name: 'French Pure Butter Croissant Box (6-Pack)',
    sku: 'BAK-CRS-010',
    description: 'Laminated with 27 delicate golden layers of French Normandy churned butter. Honeycombed airy interior with paper-thin crisp flaky crust.',
    category_id: 'cat-04',
    supplier_id: 'sup-04',
    selling_price: 18.00,
    cost_price: 7.80,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-04T07:30:00Z'
  },
  {
    product_id: 'prod-011',
    name: 'Truffle & Rosemary Roasted Marcona Almonds 200g',
    sku: 'SNK-ALM-011',
    description: 'Queen of almonds sautéed in Spanish olive oil, seasoned with aromatic black summer truffle and crushed wild Mediterranean rosemary.',
    category_id: 'cat-05',
    supplier_id: 'sup-01',
    selling_price: 12.80,
    cost_price: 6.90,
    image_url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-05T13:00:00Z'
  },
  {
    product_id: 'prod-012',
    name: 'Single-Origin 85% Dark Madagascar Chocolate 90g',
    sku: 'SNK-CHC-012',
    description: 'Direct-trade heirloom cocoa beans from the Sambirano Valley. Tasting profile features tart red berries, roasted timber, and a silky clean finish.',
    category_id: 'cat-05',
    supplier_id: 'sup-04',
    selling_price: 7.25,
    cost_price: 3.10,
    image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-05T13:30:00Z'
  },
  {
    product_id: 'prod-013',
    name: 'Cedarwood & Bergamot Plant Dishwashing Fluid 500ml',
    sku: 'HOU-DSH-013',
    description: 'Concentrated biodegradable surfactants derived from coconut and palm kernels. Tough on grease yet ultra-gentle on hands, scented with pure cedarwood essential oils.',
    category_id: 'cat-06',
    supplier_id: 'sup-05',
    selling_price: 11.50,
    cost_price: 4.80,
    image_url: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-06T15:00:00Z'
  },
  {
    product_id: 'prod-014',
    name: 'Botanical Multi-Surface Sanitizing Mist 750ml',
    sku: 'HOU-SAN-014',
    description: 'Hospital-grade plant antibacterial sanitizing formula powered by thymol and tea tree extract. Kills 99.9% of bacteria streak-free without harsh chemical fumes.',
    category_id: 'cat-06',
    supplier_id: 'sup-05',
    selling_price: 9.80,
    cost_price: 4.00,
    image_url: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-06T15:30:00Z'
  },
  {
    product_id: 'prod-015',
    name: 'Nordic Pine & Vetiver Cleansing Body Wash 500ml',
    sku: 'PER-WSH-015',
    description: 'Sulfate-free formulation enriched with wild sea buckthorn oil and birch sap. Restores natural skin lipid barriers with a deep forest scent profile.',
    category_id: 'cat-07',
    supplier_id: 'sup-05',
    selling_price: 22.00,
    cost_price: 9.50,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-02-07T16:00:00Z'
  }
];

export const INITIAL_INVENTORY: Inventory[] = [
  { inventory_id: 'inv-001', product_id: 'prod-001', current_stock: 45, reorder_level: 10, status: 'IN_STOCK', last_updated: '2026-03-28T09:00:00Z' },
  { inventory_id: 'inv-002', product_id: 'prod-002', current_stock: 82, reorder_level: 15, status: 'IN_STOCK', last_updated: '2026-03-28T09:15:00Z' },
  { inventory_id: 'inv-003', product_id: 'prod-003', current_stock: 4, reorder_level: 10, status: 'LOW_STOCK', last_updated: '2026-03-29T10:00:00Z' }, // LOW STOCK
  { inventory_id: 'inv-004', product_id: 'prod-004', current_stock: 35, reorder_level: 12, status: 'IN_STOCK', last_updated: '2026-03-29T11:00:00Z' },
  { inventory_id: 'inv-005', product_id: 'prod-005', current_stock: 22, reorder_level: 8, status: 'IN_STOCK', last_updated: '2026-03-28T14:00:00Z' },
  { inventory_id: 'inv-006', product_id: 'prod-006', current_stock: 0, reorder_level: 5, status: 'OUT_OF_STOCK', last_updated: '2026-03-29T08:30:00Z' }, // OUT OF STOCK
  { inventory_id: 'inv-007', product_id: 'prod-007', current_stock: 18, reorder_level: 6, status: 'IN_STOCK', last_updated: '2026-03-29T07:00:00Z' },
  { inventory_id: 'inv-008', product_id: 'prod-008', current_stock: 5, reorder_level: 8, status: 'LOW_STOCK', last_updated: '2026-03-29T12:00:00Z' }, // LOW STOCK
  { inventory_id: 'inv-009', product_id: 'prod-009', current_stock: 14, reorder_level: 5, status: 'IN_STOCK', last_updated: '2026-03-29T06:30:00Z' },
  { inventory_id: 'inv-010', product_id: 'prod-010', current_stock: 9, reorder_level: 6, status: 'IN_STOCK', last_updated: '2026-03-29T07:15:00Z' },
  { inventory_id: 'inv-011', product_id: 'prod-011', current_stock: 26, reorder_level: 10, status: 'IN_STOCK', last_updated: '2026-03-27T16:00:00Z' },
  { inventory_id: 'inv-012', product_id: 'prod-012', current_stock: 3, reorder_level: 10, status: 'LOW_STOCK', last_updated: '2026-03-29T15:20:00Z' }, // LOW STOCK
  { inventory_id: 'inv-013', product_id: 'prod-013', current_stock: 38, reorder_level: 10, status: 'IN_STOCK', last_updated: '2026-03-25T11:00:00Z' },
  { inventory_id: 'inv-014', product_id: 'prod-014', current_stock: 29, reorder_level: 8, status: 'IN_STOCK', last_updated: '2026-03-26T10:45:00Z' },
  { inventory_id: 'inv-015', product_id: 'prod-015', current_stock: 0, reorder_level: 6, status: 'OUT_OF_STOCK', last_updated: '2026-03-29T14:10:00Z' } // OUT OF STOCK
];

export const INITIAL_ORDERS: Order[] = [
  {
    order_id: 'ORD-70912',
    customer_id: 'usr-cust-01',
    customer_name: 'Alex Morgan',
    customer_email: 'alex.morgan@example.com',
    customer_phone: '+1 (555) 789-0123',
    shipping_address: '742 Evergreen Terrace, Springfield, OR 97477',
    subtotal: 58.49,
    tax: 4.68,
    shipping_fee: 0,
    total: 63.17,
    status: 'CONFIRMED',
    created_at: '2026-03-28T16:45:00Z',
    items: [
      {
        order_item_id: 'item-01',
        order_id: 'ORD-70912',
        product_id: 'prod-001',
        product_name: 'Cold-Pressed Sicilian Extra Virgin Olive Oil 750ml',
        unit_price: 24.99,
        quantity: 2,
        subtotal: 49.98,
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
      },
      {
        order_item_id: 'item-02',
        order_id: 'ORD-70912',
        product_id: 'prod-002',
        product_name: 'Himalayan Organic Pink Salt Fine Grain 1kg',
        unit_price: 8.50,
        quantity: 1,
        subtotal: 8.50,
        image_url: 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    order_id: 'ORD-70884',
    customer_id: 'usr-cust-02',
    customer_name: 'Samantha Wu',
    customer_email: 'samantha.wu@domain.com',
    customer_phone: '+1 (555) 321-9988',
    shipping_address: '1088 Sansome St, San Francisco, CA 94111',
    subtotal: 39.50,
    tax: 3.16,
    shipping_fee: 4.99,
    total: 47.65,
    status: 'CONFIRMED',
    created_at: '2026-03-27T11:20:00Z',
    items: [
      {
        order_item_id: 'item-03',
        order_id: 'ORD-70884',
        product_id: 'prod-008',
        product_name: 'Aged Farmhouse Cheddar 18-Month 300g',
        unit_price: 14.50,
        quantity: 1,
        subtotal: 14.50,
        image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80'
      },
      {
        order_item_id: 'item-04',
        order_id: 'ORD-70884',
        product_id: 'prod-010',
        product_name: 'French Pure Butter Croissant Box (6-Pack)',
        unit_price: 18.00,
        quantity: 1,
        subtotal: 18.00,
        image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
      },
      {
        order_item_id: 'item-05',
        order_id: 'ORD-70884',
        product_id: 'prod-012',
        product_name: 'Single-Origin 85% Dark Madagascar Chocolate 90g',
        unit_price: 7.25,
        quantity: 1,
        subtotal: 7.25,
        image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    order_id: 'ORD-70821',
    customer_id: 'usr-cust-03',
    customer_name: 'David Keller',
    customer_email: 'keller.d@investments.io',
    customer_phone: '+1 (555) 441-2311',
    shipping_address: '350 5th Avenue, Fl 28, New York, NY 10118',
    subtotal: 72.00,
    tax: 5.76,
    shipping_fee: 0,
    total: 77.76,
    status: 'CONFIRMED',
    created_at: '2026-03-25T14:10:00Z',
    items: [
      {
        order_item_id: 'item-06',
        order_id: 'ORD-70821',
        product_id: 'prod-006',
        product_name: 'Organic Ceremonial Grade Uji Matcha 50g',
        unit_price: 36.00,
        quantity: 2,
        subtotal: 72.00,
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: StockTransaction[] = [
  {
    transaction_id: 'TXN-9982',
    product_id: 'prod-001',
    product_name: 'Cold-Pressed Sicilian Extra Virgin Olive Oil 750ml',
    transaction_type: 'SALE',
    quantity: -2,
    reference_id: 'ORD-70912',
    transaction_date: '2026-03-28T16:45:00Z',
    notes: 'Auto-deducted on order confirmation'
  },
  {
    transaction_id: 'TXN-9981',
    product_id: 'prod-002',
    product_name: 'Himalayan Organic Pink Salt Fine Grain 1kg',
    transaction_type: 'SALE',
    quantity: -1,
    reference_id: 'ORD-70912',
    transaction_date: '2026-03-28T16:45:00Z',
    notes: 'Auto-deducted on order confirmation'
  },
  {
    transaction_id: 'TXN-9975',
    product_id: 'prod-004',
    product_name: 'Ethiopian Yirgacheffe Single-Origin Cold Brew 330ml',
    transaction_type: 'RESTOCK',
    quantity: 40,
    reference_id: 'PO-2026-042',
    transaction_date: '2026-03-28T08:30:00Z',
    notes: 'Supplier shipment received from Alpine Springs'
  },
  {
    transaction_id: 'TXN-9964',
    product_id: 'prod-008',
    product_name: 'Aged Farmhouse Cheddar 18-Month 300g',
    transaction_type: 'SALE',
    quantity: -1,
    reference_id: 'ORD-70884',
    transaction_date: '2026-03-27T11:20:00Z',
    notes: 'Auto-deducted on order confirmation'
  },
  {
    transaction_id: 'TXN-9950',
    product_id: 'prod-003',
    product_name: 'Aged Basmati Reserve Grain Rice 5kg',
    transaction_type: 'RETURN',
    quantity: 1,
    reference_id: 'RET-0192',
    transaction_date: '2026-03-26T13:10:00Z',
    notes: 'Damaged outer bag replaced & restored to salvage inventory'
  }
];

export const DEMO_USERS: User[] = [
  {
    user_id: 'usr-admin-01',
    email: 'admin@smartmart.com',
    full_name: 'Sarah Connor',
    phone: '+1 (555) 019-2831',
    address: 'SmartMart Operations Hub, 100 Logistics Blvd, Seattle, WA',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    user_id: 'usr-cust-01',
    email: 'alex.morgan@example.com',
    full_name: 'Alex Morgan',
    phone: '+1 (555) 789-0123',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
    role: 'customer',
    created_at: '2026-02-14T10:00:00Z'
  }
];
