import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { ProductWithInventory, Category, Supplier } from '../../types';
import { mockStore } from '../../services/mockStore';
import { StockBadge } from '../../components/StockBadge';
import { Modal } from '../../components/Modal';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithInventory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    supplier_id: '',
    selling_price: 19.99,
    cost_price: 10.50,
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    initial_stock: 30,
    reorder_level: 8
  });

  const loadAll = () => {
    setProducts(mockStore.getProductsWithInventory());
    setCategories(mockStore.getCategories());
    setSuppliers(mockStore.getSuppliers());
  };

  useEffect(() => {
    loadAll();
    const unsub = mockStore.subscribe(loadAll);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-5)}`,
      description: '',
      category_id: categories[0]?.category_id || '',
      supplier_id: suppliers[0]?.supplier_id || '',
      selling_price: 15.00,
      cost_price: 8.00,
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      initial_stock: 25,
      reorder_level: 5
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductWithInventory) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description,
      category_id: p.category_id,
      supplier_id: p.supplier_id,
      selling_price: p.selling_price,
      cost_price: p.cost_price,
      image_url: p.image_url,
      initial_stock: p.current_stock,
      reorder_level: p.reorder_level
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}" from PostgreSQL catalog?`)) {
      mockStore.deleteProduct(id);
      loadAll();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      mockStore.updateProduct(editingProduct.product_id, {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category_id: formData.category_id,
        supplier_id: formData.supplier_id,
        selling_price: Number(formData.selling_price),
        cost_price: Number(formData.cost_price),
        image_url: formData.image_url
      });
    } else {
      mockStore.addProduct({
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category_id: formData.category_id,
        supplier_id: formData.supplier_id,
        selling_price: Number(formData.selling_price),
        cost_price: Number(formData.cost_price),
        image_url: formData.image_url,
        initial_stock: Number(formData.initial_stock),
        reorder_level: Number(formData.reorder_level)
      });
    }
    setIsModalOpen(false);
    loadAll();
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>RELATIONAL INVENTORY</span>
            <span>•</span>
            <span>TABLE: products</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            PRODUCT CATALOG
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          NEW PRODUCT ENTRY
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU..."
            className="w-full bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
          />
        </div>

        <div className="flex items-center bg-[#0A0A0A] border border-neutral-800 text-xs font-mono">
          <span className="px-3 text-neutral-400 border-r border-neutral-800 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A8FF]" />
            CATEGORY:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-white px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0A0A0A]">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id} className="bg-[#0A0A0A]">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#050505] border-b border-neutral-900 text-[10px] text-neutral-400 uppercase">
                <th className="p-4">PRODUCT / SKU</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">SUPPLIER</th>
                <th className="p-4 text-right">SELLING</th>
                <th className="p-4 text-right">COST</th>
                <th className="p-4 text-center">STOCK STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filtered.map((prod) => (
                <tr key={prod.product_id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image_url}
                        alt=""
                        className="w-10 h-10 object-cover bg-black border border-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="text-white font-sans font-medium">{prod.name}</div>
                        <div className="text-[10px] text-[#00A8FF]">{prod.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-300">{prod.category_name}</td>
                  <td className="p-4 text-neutral-400">{prod.supplier_name}</td>
                  <td className="p-4 text-right font-bold text-white">
                    ${prod.selling_price.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-neutral-400">
                    ${prod.cost_price.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <StockBadge status={prod.stock_status} stockCount={prod.current_stock} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-neutral-400 hover:text-[#00A8FF] hover:bg-neutral-900 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.product_id, prod.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Product */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'EDIT PRODUCT RECORD' : 'CREATE NEW PRODUCT RECORD'}
          subtitle="Direct PostgreSQL table: products & inventory"
          maxWidth="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Organic Raw Forest Honey 500g"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Selling Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Cost Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: Number(e.target.value) })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Supplier *
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
                >
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.supplier_name}
                    </option>
                  ))}
                </select>
              </div>

              {!editingProduct && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Initial Stock Level *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.initial_stock}
                    onChange={(e) => setFormData({ ...formData, initial_stock: Number(e.target.value) })}
                    className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Reorder Level Threshold *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.reorder_level}
                  onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Product Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Aisle description and provenance..."
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-neutral-900 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00A8FF] text-black font-mono font-bold text-xs uppercase hover:bg-[#29C5FF]"
              >
                {editingProduct ? 'UPDATE PRODUCT' : 'INSERT RECORD'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
