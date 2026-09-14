import React, { useState, useEffect } from 'react';
import { X, UserCheck, Phone, Building2, Save } from 'lucide-react';

export default function EditPropertyModal({ isOpen, onClose, property, onSaveProperty, showToast }) {
  const [name, setName] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [contact, setContact] = useState('');
  const [rent, setRent] = useState('');
  const [sqft, setSqft] = useState(3000);

  useEffect(() => {
    if (property) {
      setName(property.name || '');
      setSubmittedBy(property.submittedBy || '');
      setContact(property.contact || '');
      setRent(property.rent || '');
      setSqft(property.sqft || 3000);
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProperty(property.id, {
      name,
      submittedBy,
      contact,
      rent,
      sqft: Number(sqft)
    });
    showToast(`Updated property details for ${name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171722] text-[#1C1D24] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-[#2D2D3F] relative animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2D2D3F]">
          <div>
            <h3 className="text-base font-bold">Edit Random Property</h3>
            <p className="text-xs text-gray-500 dark:text-[#8B8CA0]">
              Update submitter name and property information
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#232333] flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Owner / Submitter Name *</label>
            <input 
              type="text" 
              required 
              value={contact} 
              onChange={e => setContact(e.target.value)} 
              placeholder="e.g. Vikram Oberoi (+91 98110 33412)"
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Submitter Category / Source</label>
            <input 
              type="text" 
              value={submittedBy} 
              onChange={e => setSubmittedBy(e.target.value)} 
              placeholder="e.g. Vikram Oberoi (Owner)"
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Title</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Rent / Lease</label>
              <input 
                type="text" 
                value={rent} 
                onChange={e => setRent(e.target.value)} 
                className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Carpet Area (sq.ft)</label>
              <input 
                type="number" 
                value={sqft} 
                onChange={e => setSqft(e.target.value)} 
                className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-[#2D2D3F] flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-[#2D2D3F]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#C99029] text-white hover:bg-[#a97a20] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
