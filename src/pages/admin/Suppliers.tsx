import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { Supplier } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Modal } from '../../components/Modal';

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
    if (window.confirm(`Delete supplier "${name}"?`)) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>SUPPLY CHAIN ENTITIES</span>
            <span>•</span>
            <span>TABLE: suppliers</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            SUPPLIER NETWORK
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          NEW SUPPLIER
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#050505] border-b border-neutral-900 text-[10px] text-neutral-400 uppercase">
                <th className="p-4">SUPPLIER / ID</th>
                <th className="p-4">CONTACT PERSON</th>
                <th className="p-4">COMMUNICATION</th>
                <th className="p-4">FACILITY ADDRESS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {suppliers.map((sup) => (
                <tr key={sup.supplier_id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-sans font-medium">{sup.supplier_name}</div>
                    <div className="text-[10px] text-[#00A8FF]">{sup.supplier_id}</div>
                  </td>
                  <td className="p-4 text-neutral-300 font-sans">{sup.contact_person}</td>
                  <td className="p-4 space-y-1">
                    <div className="text-neutral-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      {sup.email}
                    </div>
                    <div className="text-neutral-400 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      {sup.phone}
                    </div>
                  </td>
                  <td className="p-4 text-neutral-400 max-w-xs font-sans text-xs">
                    {sup.address}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(sup)}
                        className="p-1.5 text-neutral-400 hover:text-[#00A8FF] hover:bg-neutral-900 transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sup.supplier_id, sup.supplier_name)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                        title="Delete Supplier"
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
          title={editingSupplier ? 'EDIT SUPPLIER RECORD' : 'CREATE SUPPLIER RECORD'}
          subtitle="Table: suppliers"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Supplier / Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                placeholder="e.g. Apex Harvest Agritech"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="e.g. Marcus Vance"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@supplier.com"
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#00A8FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Warehouse / Headquarters Address *
              </label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, State, ZIP"
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
                {editingSupplier ? 'UPDATE SUPPLIER' : 'SAVE SUPPLIER'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
