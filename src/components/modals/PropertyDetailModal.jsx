import React from 'react';
import { X, MapPin, Building2, CheckCircle, XCircle, ArrowRight, Phone, Calendar, Image as ImageIcon, Edit3 } from 'lucide-react';

export default function PropertyDetailModal({ isOpen, onClose, property, onUpdateStatus, onEditProperty, showToast }) {
  if (!isOpen || !property) return null;

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(property.id, newStatus);
    showToast(`Property "${property.name}" status updated to ${newStatus.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#171722] text-[#1C1D24] dark:text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 dark:border-[#2D2D3F] relative animate-fade-in my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2D2D3F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#C99029]/20 text-[#8a6a1f] dark:text-[#C99029] flex items-center justify-center font-bold text-xl">
              🏢
            </div>
            <div>
              <h2 className="text-base font-bold leading-snug">{property.name}</h2>
              <p className="text-xs text-gray-500 dark:text-[#8B8CA0]">
                {property.city} • {property.locality}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                onClose();
                onEditProperty(property);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2D2D3F] text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#232333] flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C99029]" /> Edit Owner Info
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#232333] flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-[#232333] rounded-xl">
              <div className="text-[11px] text-gray-500 dark:text-[#8B8CA0]">Carpet Area</div>
              <div className="text-sm font-bold mt-0.5">{property.sqft ? property.sqft.toLocaleString() : '3,000'} sq.ft</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#232333] rounded-xl">
              <div className="text-[11px] text-gray-500 dark:text-[#8B8CA0]">Rent / Terms</div>
              <div className="text-sm font-bold text-[#C99029] mt-0.5">{property.rent}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#232333] rounded-xl">
              <div className="text-[11px] text-gray-500 dark:text-[#8B8CA0]">Current Status</div>
              <div className="text-xs font-bold capitalize mt-1 text-[#1E9E5A]">
                {property.status}
              </div>
            </div>
          </div>

          <div className="p-3.5 border border-gray-100 dark:border-[#2D2D3F] rounded-xl space-y-2">
            <div className="text-xs font-semibold flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#C99029]" />
                Submission Source & Contact
              </span>
              <button 
                onClick={() => {
                  onClose();
                  onEditProperty(property);
                }}
                className="text-[11px] text-[#C99029] font-bold hover:underline"
              >
                Edit Name / Contact
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-[#8B8CA0]">
              Submitted by: <b className="text-black dark:text-white">{property.submittedBy}</b>
            </div>
            <div className="text-xs text-gray-600 dark:text-[#8B8CA0] flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" />
              Contact Info: <span className="font-mono text-black dark:text-white font-semibold">{property.contact}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Description & Notes</div>
            <p className="text-xs text-gray-600 dark:text-[#8B8CA0] bg-gray-50 dark:bg-[#232333] p-3 rounded-xl leading-relaxed">
              {property.details || 'Ground floor commercial layout pre-checked for Mystery Rooms theme escape requirements.'}
            </p>
          </div>

          {/* Media Attachments Preview */}
          <div className="p-3 border border-gray-100 dark:border-[#2D2D3F] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#8B8CA0]">
              <ImageIcon className="w-4 h-4 text-[#C99029]" />
              <span>Photos Attached: <b>{property.photosCount || 4} High-Res Photos</b></span>
            </div>
            <a 
              href={property.mapLink || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold text-[#C99029] flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" /> View on Google Maps
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-[#2D2D3F] flex items-center justify-between">
          <button
            onClick={() => handleStatusChange('rejected')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#D64545] border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" /> Reject Property
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('under-review')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333]"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => handleStatusChange('shortlisted')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C99029] hover:bg-[#a97a20] text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" /> Shortlist Property
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
