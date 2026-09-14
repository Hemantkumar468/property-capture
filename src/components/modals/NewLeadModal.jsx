import React, { useState } from 'react';
import { X, User, Building, Home, Upload, Check } from 'lucide-react';

export default function NewLeadModal({ isOpen, onClose, onSubmitLead, showToast }) {
  const [type, setType] = useState('person'); // person, branch, property
  
  // Person form state
  const [personName, setPersonName] = useState('');
  const [personContact, setPersonContact] = useState('');
  const [personEmail, setPersonEmail] = useState('');
  const [personCity, setPersonCity] = useState('Delhi');
  const [personLocality, setPersonLocality] = useState('');
  const [personBudget, setPersonBudget] = useState('₹1–2 Cr');
  const [personTimeline, setPersonTimeline] = useState('1–3 months');

  // Single Property form state
  const [propName, setPropName] = useState('');
  const [propCity, setPropCity] = useState('Mumbai');
  const [propLocality, setPropLocality] = useState('');
  const [propSqft, setPropSqft] = useState(2500);
  const [propRent, setPropRent] = useState('₹1.5L / mo');
  const [propSubmitterType, setPropSubmitterType] = useState('Owner');
  const [propContact, setPropContact] = useState('');
  const [propDetails, setPropDetails] = useState('');

  // Branch form state
  const [branchName, setBranchName] = useState('');
  const [branchContact, setBranchContact] = useState('');
  const [branchCity, setBranchCity] = useState('Sagar');
  const [branchLocality, setBranchLocality] = useState('MP Nagar');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'person') {
      if (!personName) return;
      const initials = personName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) || 'LE';
      onSubmitLead('person', {
        id: 'person-' + Date.now(),
        name: personName,
        initials,
        contact: personContact || '98xxx xx' + Math.floor(100 + Math.random() * 900),
        email: personEmail || `${personName.toLowerCase().replace(/\s+/g,'')}@email.com`,
        city: personCity,
        locality: personLocality || 'Central',
        budget: personBudget,
        timeline: personTimeline,
        status: 'no-property',
        assignedTo: null,
        researchStatus: 'Pending Assignment',
        submittedDate: 'Just now',
        bgGradient: 'from-[#2F6FE0] to-[#1E40AF]'
      });
      showToast(`Lead created for ${personName}`);
    } else if (type === 'property') {
      if (!propName) return;
      onSubmitLead('property', {
        id: 'prop-' + Date.now(),
        name: propName,
        city: propCity,
        locality: propLocality || 'Prime Locality',
        sqft: Number(propSqft) || 2000,
        rent: propRent,
        type: 'Rent',
        submittedBy: `${propSubmitterType} (${propContact || 'Direct Submission'})`,
        submitterType: propSubmitterType,
        status: 'submitted',
        photosCount: 4,
        mapLink: 'https://maps.google.com',
        details: propDetails || 'Commercial unit submitted via Enquiry Portal.',
        contact: propContact || 'Contact Provided',
        date: 'Just now'
      });
      showToast(`Property "${propName}" added successfully`);
    } else if (type === 'branch') {
      if (!branchName) return;
      onSubmitLead('branch', {
        id: 'branch-' + Date.now(),
        name: branchName,
        contactPerson: branchContact || 'Branch Manager',
        city: branchCity,
        locality: branchLocality,
        propertiesCount: 2,
        submittedDate: 'Just now',
        status: 'Multiple Submitted',
        properties: [
          { id: 'bp-' + Date.now() + '-1', name: `${branchCity} Unit A`, sqft: 2200, terms: 'Rent ₹1.1L', status: 'submitted', icon: '🏬' },
          { id: 'bp-' + Date.now() + '-2', name: `${branchCity} Unit B`, sqft: 3100, terms: 'Lease ₹2.4L', status: 'submitted', icon: '🏢' }
        ]
      });
      showToast(`Branch "${branchName}" submitted with 2 properties`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#171722] text-[#1C1D24] dark:text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-[#2D2D3F] relative animate-fade-in my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2D2D3F]">
          <div>
            <h2 className="text-lg font-bold">Submit Property or Enquiry</h2>
            <p className="text-xs text-gray-500 dark:text-[#8B8CA0] mt-0.5">
              Select submission pathway for Property FMS Step 1
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#232333] flex items-center justify-center text-gray-500 dark:text-[#8B8CA0] hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-2 my-5">
          <button
            type="button"
            onClick={() => setType('person')}
            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
              type === 'person'
                ? 'border-[#C99029] bg-[#C99029]/10 font-bold text-[#C99029]'
                : 'border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] text-gray-600 dark:text-[#8B8CA0]'
            }`}
          >
            <User className="w-4 h-4 mt-0.5 text-[#C99029]" />
            <div>
              <div className="text-[13px] font-semibold">Person — No Property</div>
              <div className="text-[11px] opacity-80 font-normal leading-tight mt-0.5">No property yet</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('property')}
            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
              type === 'property'
                ? 'border-[#C99029] bg-[#C99029]/10 font-bold text-[#C99029]'
                : 'border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] text-gray-600 dark:text-[#8B8CA0]'
            }`}
          >
            <Home className="w-4 h-4 mt-0.5 text-[#C99029]" />
            <div>
              <div className="text-[13px] font-semibold">Random Property</div>
              <div className="text-[11px] opacity-80 font-normal leading-tight mt-0.5">Single / Direct submission</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setType('branch')}
            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
              type === 'branch'
                ? 'border-[#C99029] bg-[#C99029]/10 font-bold text-[#C99029]'
                : 'border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] text-gray-600 dark:text-[#8B8CA0]'
            }`}
          >
            <Building className="w-4 h-4 mt-0.5 text-[#C99029]" />
            <div>
              <div className="text-[13px] font-semibold">Person — Has Property</div>
              <div className="text-[11px] opacity-80 font-normal leading-tight mt-0.5">Has property options</div>
            </div>
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'person' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={personName} 
                  onChange={e=>setPersonName(e.target.value)} 
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input 
                  type="text" 
                  required 
                  value={personContact} 
                  onChange={e=>setPersonContact(e.target.value)} 
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={personEmail} 
                  onChange={e=>setPersonEmail(e.target.value)} 
                  placeholder="rahul@example.com"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred City *</label>
                <select 
                  value={personCity} 
                  onChange={e=>setPersonCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Locality</label>
                <input 
                  type="text" 
                  value={personLocality} 
                  onChange={e=>setPersonLocality(e.target.value)} 
                  placeholder="e.g. Dwarka, Connaught Place"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Investment Budget</label>
                <select 
                  value={personBudget} 
                  onChange={e=>setPersonBudget(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                >
                  <option value="₹50L–80L">₹50L–80L</option>
                  <option value="₹80L–1.2 Cr">₹80L–1.2 Cr</option>
                  <option value="₹1–2 Cr">₹1–2 Cr</option>
                  <option value="₹2 Cr+">₹2 Cr+</option>
                </select>
              </div>
            </div>
          )}

          {type === 'property' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Title / Name *</label>
                <input 
                  type="text" 
                  required 
                  value={propName} 
                  onChange={e=>setPropName(e.target.value)} 
                  placeholder="e.g. Connaught Place Outer Circle Retail"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                <select 
                  value={propCity} 
                  onChange={e=>setPropCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Sagar">Sagar</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Locality</label>
                <input 
                  type="text" 
                  value={propLocality} 
                  onChange={e=>setPropLocality(e.target.value)} 
                  placeholder="e.g. Andheri West"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Carpet Area (sq.ft)</label>
                <input 
                  type="number" 
                  value={propSqft} 
                  onChange={e=>setPropSqft(e.target.value)} 
                  placeholder="2500"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Expected Rent / Lease</label>
                <input 
                  type="text" 
                  value={propRent} 
                  onChange={e=>setPropRent(e.target.value)} 
                  placeholder="e.g. ₹1.8L / mo"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Submitted By</label>
                <select 
                  value={propSubmitterType} 
                  onChange={e=>setPropSubmitterType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                >
                  <option value="Owner">Owner</option>
                  <option value="Broker">Broker</option>
                  <option value="Referral">Employee Referral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Details</label>
                <input 
                  type="text" 
                  value={propContact} 
                  onChange={e=>setPropContact(e.target.value)} 
                  placeholder="Contact Name & Phone"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>
            </div>
          )}

          {type === 'branch' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Branch / Desk Name *</label>
                <input 
                  type="text" 
                  required 
                  value={branchName} 
                  onChange={e=>setBranchName(e.target.value)} 
                  placeholder="e.g. Jaipur Central Partner Desk"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                <input 
                  type="text" 
                  value={branchContact} 
                  onChange={e=>setBranchContact(e.target.value)} 
                  placeholder="Manager Name"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input 
                  type="text" 
                  value={branchCity} 
                  onChange={e=>setBranchCity(e.target.value)} 
                  placeholder="e.g. Jaipur"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-[#2D2D3F] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C99029] hover:bg-[#a97a20] text-white transition-colors shadow-sm"
            >
              Submit Lead
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
