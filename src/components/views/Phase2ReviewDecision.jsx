import React, { useMemo, useState } from 'react';
import { 
  Filter, 
  Search, 
  Download, 
  ChevronDown, 
  Check, 
  Info, 
  X, 
  Building2, 
  User, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { initialSubmissions } from '../../data/fmsData';
import { computeSubmissionCounts } from '../../utils/submissions';

export default function Phase2ReviewDecision({ 
  setActivePhase, 
  showToast, 
  darkMode 
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [activeTab, setActiveTab] = useState('all'); // all, leads, interested_prop, opportunities
  const [selectedSubId, setSelectedSubId] = useState(3); // Default Arpit Jain (#3)
  const [rightPanelTab, setRightPanelTab] = useState('details'); // details, docs, notes, activity
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [needInfoModalOpen, setNeedInfoModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState('');

  // Selected Item for Right Panel
  const selectedItem = submissions.find(s => s.id === selectedSubId) || submissions[2] || submissions[0];

  // Real per-category counts, so the tab badges and footer never show numbers
  // unrelated to what's actually in the table.
  const counts = useMemo(() => computeSubmissionCounts(submissions), [submissions]);

  // Filter Submissions based on tab and search
  const filteredSubmissions = submissions.filter(sub => {
    // Tab filter
    if (activeTab === 'leads' && sub.type !== 'Interested Lead') return false;
    if (activeTab === 'interested_prop' && sub.type !== 'Interested + Property') return false;
    if (activeTab === 'opportunities' && sub.type !== 'Property Opportunity') return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        sub.personName.toLowerCase().includes(q) ||
        sub.location.toLowerCase().includes(q) ||
        sub.type.toLowerCase().includes(q) ||
        sub.status.toLowerCase().includes(q) ||
        sub.keyDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle MD Decision Action
  const handleDecision = (id, newDecision) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        let newStatus = s.status;
        if (newDecision === 'Approve') newStatus = 'Approved';
        if (newDecision === 'Need More Info') newStatus = 'Need More Info';
        if (newDecision === 'Reject') newStatus = 'Rejected';

        return {
          ...s,
          decision: newDecision,
          status: newStatus
        };
      }
      return s;
    }));

    const item = submissions.find(s => s.id === id);
    if (!item) return;

    if (newDecision === 'Approve') {
      if (item.type === 'Interested Lead') {
        showToast(`Approved ${item.personName}! Moving to Phase 3: Property Research.`);
        setTimeout(() => setActivePhase(3), 1200);
      } else {
        showToast(`Approved ${item.personName}! Has Property ➔ Moving directly to Phase 4: Assessment.`);
        setTimeout(() => setActivePhase(4), 1200);
      }
    } else if (newDecision === 'Need More Info') {
      showToast(`Requested more info for ${item.personName}. Status updated.`);
    } else if (newDecision === 'Reject') {
      showToast(`Rejected submission #${id} (${item.personName}).`);
    }
    setOpenDropdownId(null);
  };

  // Helper for Type Badges
  const renderTypeBadge = (type) => {
    if (type === 'Interested Lead') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EEEAFE] text-[#6C63C9] border border-[#D9D3F9]">
          <User className="w-3 h-3" />
          <span>Interested Lead</span>
        </span>
      );
    }
    if (type === 'Interested + Property') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FBF1DD] text-[#C88A18] border border-[#F4E1B5]">
          <Building2 className="w-3 h-3" />
          <span>Interested + Property</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4] border border-[#CCE0FA]">
        <Store className="w-3 h-3" />
        <span>Property Opportunity</span>
      </span>
    );
  };

  // Helper for Status Pills
  const renderStatusPill = (status) => {
    if (status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E3F5EC] text-[#1F9D6A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D6A]" />
          <span>Approved</span>
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDEBEC] text-[#E5484D]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
          <span>Rejected</span>
        </span>
      );
    }
    if (status === 'Need More Info') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Need Info</span>
        </span>
      );
    }
    if (status === 'New Lead') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82C4]" />
          <span>New Lead</span>
        </span>
      );
    }
    if (status === 'In Research') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBF1DD] text-[#C88A18]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C88A18]" />
          <span>In Research</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TABS AND TOOLBAR ROW */}
      <div className={`p-2.5 sm:p-3 rounded-2xl border shadow-sm transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* SUBMISSION TABS */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>All Submissions</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#C88A18]/20 text-[#C88A18]">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'leads'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Interested Leads</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.leads}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interested_prop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interested_prop'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Interested + Property</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.interestedProp}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'opportunities'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Property Opportunities</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.opportunities}
            </span>
          </button>
        </div>

        {/* TOOLBAR: FILTERS + SEARCH + EXPORT */}
        <div className="flex items-center gap-2 shrink-0">
          <button className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
            darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-[#E2E8F0] text-gray-700 hover:bg-gray-50'
          }`}>
            <Filter className="w-3.5 h-3.5 text-[#C88A18]" />
            <span>Filters</span>
          </button>

          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search submissions..." 
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                darkMode ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500' : 'bg-gray-50 border-[#E2E8F0] text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          <button className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
            darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-[#E2E8F0] text-gray-700 hover:bg-gray-50'
          }`}>
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (75% TABLE / 25% DETAILS PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT: SUBMISSIONS TABLE (Approx 75% -> 8 or 9 cols) */}
        <div className={`lg:col-span-8 xl:col-span-8 rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
        }`}>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  darkMode ? 'bg-[#111827] border-[#253046] text-[#94A3B8]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                }`}>
                  <th className="p-3 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#C88A18] focus:ring-[#C88A18]" />
                  </th>
                  <th className="py-3 px-2 w-8">#</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-3">Person / Property</th>
                  <th className="py-3 px-3">Key Details</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Submitted On</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-3 text-center">MD Decision</th>
                  <th className="py-3 px-2 w-10 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#253046] text-xs">
                {filteredSubmissions.map((row) => {
                  const isSelected = selectedSubId === row.id;

                  return (
                    <tr 
                      key={row.id}
                      onClick={() => setSelectedSubId(row.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? darkMode 
                            ? 'bg-[#1E293B] border-l-4 border-l-[#C88A18]' 
                            : 'bg-[#FFFBEB] border-l-4 border-l-[#C88A18]'
                          : darkMode 
                            ? 'hover:bg-[#1E293B]/50' 
                            : 'hover:bg-gray-50/80'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300 text-[#C88A18] focus:ring-[#C88A18]" />
                      </td>

                      {/* Number */}
                      <td className="py-3 px-2 font-bold text-gray-500">
                        {row.id}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-2 shrink-0">
                        {renderTypeBadge(row.type)}
                      </td>

                      {/* Person / Property */}
                      <td className="py-3 px-3 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          {row.photo ? (
                            <img 
                              src={row.photo} 
                              alt={row.personName} 
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                              {row.personName.split(' ').map(n=>n[0]).join('')}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {row.personName}
                              {row.roleLabel && (
                                <span className="ml-1 text-[10px] font-semibold text-gray-500">
                                  ({row.roleLabel})
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                              {row.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Key Details */}
                      <td className="py-3 px-3 min-w-[180px] max-w-[220px]">
                        <div className="text-gray-700 dark:text-gray-300 font-medium line-clamp-2 leading-tight">
                          {row.keyDetails}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                          <MapPin className="w-3.5 h-3.5 text-[#3B82C4]" />
                          <span>{row.location}</span>
                        </div>
                      </td>

                      {/* Submitted On */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                          <div>{row.submittedOn.split(' ')[0]} {row.submittedOn.split(' ')[1]} {row.submittedOn.split(' ')[2]}</div>
                          <div className="text-[10px] text-gray-400">{row.submittedOn.split(' ').slice(3).join(' ')}</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        {renderStatusPill(row.status)}
                      </td>

                      {/* MD Decision Dropdown */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center justify-between gap-1 shadow-sm transition-all ${
                              row.decision === 'Approve' 
                                ? 'bg-[#E3F5EC] text-[#1F9D6A] border-[#1F9D6A]/40' 
                                : row.decision === 'Reject'
                                  ? 'bg-[#FDEBEC] text-[#E5484D] border-[#E5484D]/40'
                                  : row.decision === 'Need More Info'
                                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                                    : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#C88A18]'
                            }`}
                          >
                            <span>{row.decision}</span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                          </button>

                          {/* DROPDOWN MENU */}
                          {openDropdownId === row.id && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xl z-30 py-1 text-xs">
                              <button
                                onClick={() => handleDecision(row.id, 'Approve')}
                                className="w-full px-3 py-1.5 text-left font-bold text-[#1F9D6A] hover:bg-[#E3F5EC] dark:hover:bg-[#1F9D6A]/20 flex items-center gap-2"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleDecision(row.id, 'Need More Info')}
                                className="w-full px-3 py-1.5 text-left font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                              >
                                <Info className="w-3.5 h-3.5" />
                                <span>Need More Info</span>
                              </button>
                              <button
                                onClick={() => handleDecision(row.id, 'Reject')}
                                className="w-full px-3 py-1.5 text-left font-bold text-[#E5484D] hover:bg-[#FDEBEC] dark:hover:bg-[#E5484D]/20 flex items-center gap-2"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className={`p-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
            darkMode ? 'bg-[#111827] border-[#253046] text-gray-400' : 'bg-gray-50 border-[#E2E8F0] text-gray-600'
          }`}>
            <div>
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredSubmissions.length ? 1 : 0} to {filteredSubmissions.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredSubmissions.length}</span> submissions
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-40">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#3B82C4] text-white">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-800">
                  2
                </button>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-800">
                  3
                </button>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-800">
                  4
                </button>
                <button className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <select className={`px-2 py-1 rounded-lg border text-xs font-bold ${
                darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <option>10 / page</option>
                <option>25 / page</option>
                <option>50 / page</option>
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT: DETAILS PANEL (Approx 25% -> 4 cols, Sticky Desktop) */}
        <div className={`lg:col-span-4 xl:col-span-4 rounded-2xl border shadow-md p-4 sticky top-16 space-y-4 transition-colors ${
          darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
        }`}>
          
          {/* PANEL TABS + CLOSE */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#253046] pb-2">
            <div className="flex items-center gap-3 text-xs font-bold">
              <button
                onClick={() => setRightPanelTab('details')}
                className={`pb-2 transition-colors relative ${
                  rightPanelTab === 'details'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Details</span>
                {rightPanelTab === 'details' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('docs')}
                className={`pb-2 transition-colors ${
                  rightPanelTab === 'docs' ? 'text-[#C88A18] font-extrabold' : 'text-gray-500'
                }`}
              >
                <span>Documents</span>
              </button>

              <button
                onClick={() => setRightPanelTab('notes')}
                className={`pb-2 transition-colors ${
                  rightPanelTab === 'notes' ? 'text-[#C88A18] font-extrabold' : 'text-gray-500'
                }`}
              >
                <span>Notes</span>
              </button>

              <button
                onClick={() => setRightPanelTab('activity')}
                className={`pb-2 transition-colors ${
                  rightPanelTab === 'activity' ? 'text-[#C88A18] font-extrabold' : 'text-gray-500'
                }`}
              >
                <span>Activity</span>
              </button>
            </div>

            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* PROPERTY DETAILS FOR RIGHT PANEL */}
          {selectedItem ? (
            <>
              {/* PROPERTY IMAGE THUMBNAIL WITH BADGE */}
              <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-900">
                {selectedItem.photo ? (
                  <img 
                    src={selectedItem.photo} 
                    alt={selectedItem.propertyName || selectedItem.personName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-4 text-center">
                    <Building2 className="w-8 h-8 opacity-60 mb-1" />
                    <span className="font-bold text-xs">{selectedItem.personName}</span>
                    <span className="text-[10px] text-gray-300">{selectedItem.location}</span>
                  </div>
                )}

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#1F9D6A] text-white shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    New Submission
                  </span>
                </div>
              </div>

              {/* PROPERTY TITLE & BADGES */}
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                  {selectedItem.propertyName || `${selectedItem.personName}'s Submission`}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  {renderTypeBadge(selectedItem.type)}
                  {selectedItem.sqft && selectedItem.sqft !== 'N/A' && (
                    <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {selectedItem.sqft}
                    </span>
                  )}
                </div>
              </div>

              {/* SUBMITTED BY */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Submitted By
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {selectedItem.personName ? selectedItem.personName.split(' ').map(n=>n[0]).join('') : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                      {selectedItem.personName}
                    </div>
                    <div className="text-[10.5px] text-gray-500 dark:text-gray-400">
                      {selectedItem.submittedRole || 'Franchise Partner'}
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700/60 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-[#3B82C4]" />
                    <span className="font-medium">{selectedItem.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="w-3.5 h-3.5 text-[#3B82C4]" />
                    <span className="font-medium">{selectedItem.email}</span>
                  </div>
                </div>
              </div>

              {/* PROPERTY DETAILS */}
              <div className="space-y-2 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Property Details
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                    <div className="text-[10px] text-gray-400 font-medium">Location</div>
                    <div className="font-bold text-gray-900 dark:text-white truncate">
                      {selectedItem.locality || selectedItem.location}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                    <div className="text-[10px] text-gray-400 font-medium">Property Type</div>
                    <div className="font-bold text-gray-900 dark:text-white truncate">
                      {selectedItem.propType || 'Commercial Space'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                    <div className="text-[10px] text-gray-400 font-medium">Area</div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {selectedItem.sqft || '3,000 sq.ft'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                    <div className="text-[10px] text-gray-400 font-medium">Expected Rent</div>
                    <div className="font-bold text-[#C88A18]">
                      {selectedItem.rent || '₹1.6L / month (Lease)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* INTEREST DETAILS */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Interest Details
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium text-[11.5px] leading-relaxed bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                  {selectedItem.interestText || 'Interested in opening Mystery Rooms. Has property available.'}
                </div>
              </div>

              {/* SUBMISSION DATE */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="font-medium">Submission Date:</span>
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedItem.submittedOn}</span>
                </span>
              </div>

              {/* RIGHT PANEL 3 LARGE MD DECISION BUTTONS */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                  MD Action Decision
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* BUTTON 1: APPROVE (GREEN) */}
                  <button
                    onClick={() => handleDecision(selectedItem.id, 'Approve')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1F9D6A] hover:bg-[#167b52] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Approve</span>
                  </button>

                  {/* BUTTON 2: NEED MORE INFO (GOLD/AMBER) */}
                  <button
                    onClick={() => handleDecision(selectedItem.id, 'Need More Info')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#C88A18] hover:bg-[#a57011] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <Info className="w-4 h-4 stroke-[2.5]" />
                    <span>Need More Info</span>
                  </button>

                  {/* BUTTON 3: REJECT (RED) */}
                  <button
                    onClick={() => handleDecision(selectedItem.id, 'Reject')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#E5484D] hover:bg-[#c93338] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs font-semibold">
              Select a submission to view details.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
