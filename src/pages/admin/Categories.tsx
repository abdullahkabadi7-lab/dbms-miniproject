import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, ExternalLink } from 'lucide-react';
import { Category } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Modal } from '../../components/Modal';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  });

  const loadCategories = () => {
    setCategories(mockStore.getCategories());
  };

  useEffect(() => {
    loadCategories();
    const unsub = mockStore.subscribe(loadCategories);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete department/category "${name}"? Existing products may be affected.`)) {
      mockStore.deleteCategory(id);
      loadCategories();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      mockStore.updateCategory(editingCategory.category_id, {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image_url: formData.image_url
      });
    } else {
      mockStore.addCategory({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image_url: formData.image_url
      });
    }
    setIsModalOpen(false);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>RELATIONAL TAXONOMY</span>
            <span>•</span>
            <span>TABLE: categories</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            CATEGORY AISLES
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          NEW CATEGORY
        </button>
      </div>

      {/* Categories Grid/Table */}
      <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#050505] border-b border-neutral-900 text-[10px] text-neutral-400 uppercase">
                <th className="p-4">DEPARTMENT</th>
                <th className="p-4">SLUG</th>
                <th className="p-4">DESCRIPTION</th>
                <th className="p-4 text-center">ASSIGNED SKUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {categories.map((cat) => (
                <tr key={cat.category_id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image_url}
                        alt=""
                        className="w-10 h-10 object-cover bg-black border border-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="text-white font-sans font-medium">{cat.name}</div>
                        <div className="text-[10px] text-[#00A8FF]">ID: {cat.category_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-400">{cat.slug}</td>
                  <td className="p-4 text-neutral-300 max-w-xs font-sans text-xs">
                    {cat.description}
                  </td>
                  <td className="p-4 text-center font-bold text-white">
                    {cat.product_count ?? 0}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-neutral-400 hover:text-[#00A8FF] hover:bg-neutral-900 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id, cat.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                        title="Delete Category"
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

      {/* Modal Form */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
          subtitle="Table: categories"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Organic Produce & Greens"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. organic-produce"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
                {editingCategory ? 'SAVE CHANGES' : 'CREATE CATEGORY'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
