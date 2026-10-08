import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Truck, Mail, Phone, MapPin, Search } from 'lucide-react';
import { Supplier } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Modal } from '../../components/Modal';

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: ''
  });

  const loadSuppliers = () => {
    setSuppliers(mockStore.getSuppliers());
  };

  useEffect(() => {
    loadSuppliers();
    const unsub = mockStore.subscribe(loadSuppliers);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingSupplier(null);
    setFormData({
      supplier_name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      supplier_name: s.supplier_name,
      contact_person: s.contact_person,
      phone: s.phone,
      email: s.email,
      address: s.address
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete supplier "${name}" from PostgreSQL records?`)) {
      mockStore.deleteSupplier(id);
      loadSuppliers();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      mockStore.updateSupplier(editingSupplier.supplier_id, formData);
    } else {
      mockStore.addSupplier(formData);
    }
    setIsModalOpen(false);
    loadSuppliers();
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.supplier_name.toLowerCase().includes(q) ||
      s.contact_person.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.supplier_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-wider mb-1 font-semibold">
            <span>SUPPLY CHAIN ENTITIES</span>
            <span className="text-neutral-600">•</span>
            <span>PRODUCERS & DISTRIBUTORS</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
            Supplier Network
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-black font-mono font-bold text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suppliers by name, contact, email..."
          className="w-full bg-surface-900 border border-white/10 rounded-xl text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
        />
      </div>

      {/* Suppliers Table */}
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-950 border-b border-white/[0.08] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="p-4">Supplier / ID</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Communication</th>
                <th className="p-4">Facility Address</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-400">
                    <Truck className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="font-sans text-sm text-neutral-300 font-medium">No suppliers found</p>
                    <p className="text-xs font-mono text-neutral-400 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup) => (
                  <tr key={sup.supplier_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="text-white font-sans font-medium text-sm">{sup.supplier_name}</div>
                      <div className="text-[11px] text-[#00A8FF] font-mono mt-0.5">{sup.supplier_id}</div>
                    </td>
                    <td className="p-4 text-neutral-300 font-sans text-sm">{sup.contact_person}</td>
                    <td className="p-4 space-y-1.5 font-mono text-xs">
                      <div className="text-neutral-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{sup.email}</span>
                      </div>
                      <div className="text-neutral-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{sup.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-400 max-w-xs font-sans text-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                        <span>{sup.address}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-2 text-neutral-400 hover:text-[#00A8FF] hover:bg-white/[0.05] rounded-lg transition-colors"
                          title="Edit Supplier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sup.supplier_id, sup.supplier_name)}
                          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/[0.05] rounded-lg transition-colors"
                          title="Delete Supplier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingSupplier ? 'Edit Supplier Record' : 'Register New Supplier'}
          subtitle="Table: suppliers"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Supplier / Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                placeholder="e.g. Apex Harvest Agritech"
                className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="e.g. Marcus Vance"
                className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@supplier.com"
                  className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Warehouse / Headquarters Address *
              </label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, State, ZIP"
                className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 border border-white/10 rounded-lg text-neutral-400 hover:text-white text-xs font-mono uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-black font-mono font-bold text-xs uppercase rounded-lg transition-colors"
              >
                {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
