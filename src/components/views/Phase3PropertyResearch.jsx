import React, { useMemo, useState } from 'react';
import { 
  Filter, 
  Search, 
  Download, 
  ChevronDown, 
  MapPin, 
  Calendar, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  ArrowRight,
  X,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  FileText,
  Share2,
  Check,
  Briefcase
} from 'lucide-react';
import { initialResearchLeads } from '../../data/fmsData';
import { computeResearchLeadCounts } from '../../utils/researchLeads';

export default function Phase3PropertyResearch({ 
  setActivePhase, 
  showToast, 
  darkMode 
}) {
  const [leads, setLeads] = useState(initialResearchLeads);
  const [activeTab, setActiveTab] = useState('active'); // active, suggested, site_visits, ready, closed
  const [selectedLeadId, setSelectedLeadId] = useState(1); // Default Hemant Sharma (#1)
  const [rightPanelTab, setRightPanelTab] = useState('details'); // details, properties, notes, activity
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [newPropData, setNewPropData] = useState({ name: '', location: '', area: '', rent: '', status: 'Shortlisted' });
  
  const [isMarkReviewOpen, setIsMarkReviewOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetLead, setAssignTargetLead] = useState(null);
  const [newAssignee, setNewAssignee] = useState('Rohit Kumar');
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Note addition state
  const [newNoteText, setNewNoteText] = useState('');

  // Selected Lead for Right Details Panel
  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Real per-category counts, so the tab badges and footer never show
  // numbers unrelated to what's actually in the table.
  const counts = useMemo(() => computeResearchLeadCounts(leads), [leads]);

  // Filter leads based on tab and search query
  const filteredLeads = leads.filter(l => {
    if (activeTab === 'ready' && l.status !== 'Ready for Review') return false;
    if (activeTab === 'site_visits' && !l.status.includes('Site Visit')) return false;
    if (activeTab === 'suggested' && l.propertiesCount === 0) return false;
    if (activeTab === 'closed' && l.status !== 'Closed') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.personName.toLowerCase().includes(q) ||
        l.preferredLocation.toLowerCase().includes(q) ||
        l.assignedTo.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handler: Add Suggested Property
  const handleAddPropertySubmit = (e) => {
    e.preventDefault();
    if (!newPropData.name || !newPropData.location) return;

    const newProp = {
      id: `p-${Date.now()}`,
      name: newPropData.name,
      location: newPropData.location,
      area: newPropData.area || '3,000 sq.ft',
      rent: newPropData.rent || '₹1.5L / mo',
      status: newPropData.status
    };

    setLeads(prev => prev.map(lead => {
      if (lead.id === selectedLeadId) {
        return {
          ...lead,
          propertiesCount: lead.propertiesCount + 1,
          properties: [newProp, ...(lead.properties || [])],
          activity: [
            { id: `act-${Date.now()}`, text: `Added suggested property: ${newProp.name}`, date: 'Today' },
            ...(lead.activity || [])
          ]
        };
      }
      return lead;
    }));

    showToast(`Added property "${newProp.name}" for ${selectedLead?.personName || 'lead'}!`);
    setIsAddPropertyOpen(false);
    setNewPropData({ name: '', location: '', area: '', rent: '', status: 'Shortlisted' });
  };

  // Handler: Mark for Review Confirmation
  const handleConfirmMarkForReview = () => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === selectedLeadId) {
        return {
          ...lead,
          status: 'Ready for Review',
          statusType: 'green',
          nextAction: 'MD Evaluation'
        };
      }
      return lead;
    }));

    showToast(`${selectedLead?.personName || 'Lead'} marked as "Ready for MD Review"!`);
    setIsMarkReviewOpen(false);
  };

  // Handler: Reassign Researcher
  const handleSaveAssignee = () => {
    if (!assignTargetLead) return;
    
    let initials = 'RK';
    let bg = 'bg-[#E5484D]';
    if (newAssignee === 'Suresh Singh') { initials = 'SS'; bg = 'bg-[#3B82C4]'; }
    if (newAssignee === 'Alka Mishra') { initials = 'AM'; bg = 'bg-[#6C63C9]'; }

    setLeads(prev => prev.map(l => {
      if (l.id === assignTargetLead.id) {
        return {
          ...l,
          assignedTo: newAssignee,
          assignedInitials: initials,
          assignedBg: bg
        };
      }
      return l;
    }));

    showToast(`Reassigned ${assignTargetLead.personName} to ${newAssignee}`);
    setIsAssignModalOpen(false);
    setAssignTargetLead(null);
  };

  // Handler: Add Note
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    setLeads(prev => prev.map(l => {
      if (l.id === selectedLeadId) {
        return {
          ...l,
          notes: [
            { id: `note-${Date.now()}`, text: newNoteText.trim(), date: 'Today' },
            ...(l.notes || [])
          ]
        };
      }
      return l;
    }));

    showToast('Research note saved!');
    setNewNoteText('');
  };

  // Helper for Status Badge
  const renderStatusBadge = (status, statusType) => {
    if (status === 'Ready for Review' || status === 'Shortlisted' || status === '3 Shortlisted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E3F5EC] text-[#1F9D6A]">
          <CheckCircle2 className="w-3 h-3" />
          <span>{status}</span>
        </span>
      );
    }
    if (status.includes('Site Visit')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEEAFE] text-[#6C63C9]">
          <MapPin className="w-3 h-3 text-[#6C63C9]" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4]">
        <Search className="w-3 h-3 text-[#3B82C4]" />
        <span>{status}</span>
      </span>
    );
  };

  // Helper for Next Action Icon
  const renderActionIcon = (type) => {
    if (type === 'calendar') return <Calendar className="w-3.5 h-3.5 text-indigo-500" />;
    if (type === 'mapPin') return <MapPin className="w-3.5 h-3.5 text-[#6C63C9]" />;
    if (type === 'share') return <Share2 className="w-3.5 h-3.5 text-emerald-500" />;
    if (type === 'user') return <User className="w-3.5 h-3.5 text-[#3B82C4]" />;
    return <Search className="w-3.5 h-3.5 text-[#3B82C4]" />;
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TABS AND TOOLBAR ROW */}
      <div className={`p-2.5 sm:p-3 rounded-2xl border shadow-sm transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* RESEARCH TABS */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'active'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Active Searches</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#C88A18]/20 text-[#C88A18]">
              {counts.active}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('suggested')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'suggested'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Suggested Properties</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.suggested}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('site_visits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'site_visits'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Site Visits</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.siteVisits}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ready'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Ready for Review</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.ready}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('closed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'closed'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Closed</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.closed}
            </span>
          </button>
        </div>

        {/* TOOLBAR: FILTERS + SEARCH + EXPORT */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
              darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-[#E2E8F0] text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-[#C88A18]" />
            <span>Filters</span>
          </button>

          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city..." 
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                darkMode ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500' : 'bg-gray-50 border-[#E2E8F0] text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          <button 
            onClick={() => showToast('Exported active searches report')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
              darkMode ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]' : 'bg-white border-[#E2E8F0] text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (TABLE + RIGHT DETAILS PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT: ACTIVE SEARCHES TABLE */}
        <div className={`lg:col-span-8 xl:col-span-8 rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
        }`}>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  darkMode ? 'bg-[#111827] border-[#253046] text-[#94A3B8]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                }`}>
                  <th className="py-3 px-3 w-8 text-center">#</th>
                  <th className="py-3 px-3">Person (Lead)</th>
                  <th className="py-3 px-3">Preferred Location</th>
                  <th className="py-3 px-3">Search Status</th>
                  <th className="py-3 px-2 text-center">Properties Found</th>
                  <th className="py-3 px-3">Next Action</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-2">Last Updated</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#253046] text-xs">
                {filteredLeads.map((row) => {
                  const isSelected = selectedLeadId === row.id;

                  return (
                    <tr 
                      key={row.id}
                      onClick={() => setSelectedLeadId(row.id)}
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
                      {/* Number */}
                      <td className="py-3 px-3 text-center font-bold text-gray-500">
                        {row.id}
                      </td>

                      {/* Person (Lead) Avatar & Name */}
                      <td className="py-3 px-3 min-w-[140px]">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${row.avatarBg || 'bg-gray-800'} text-white font-bold text-[10.5px] flex items-center justify-center shrink-0 shadow-sm`}>
                            {row.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {row.personName}
                            </div>
                            <div className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                              {row.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Preferred Location */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                          <MapPin className="w-3.5 h-3.5 text-[#3B82C4]" />
                          <span>{row.preferredLocation}</span>
                        </div>
                      </td>

                      {/* Search Status Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {renderStatusBadge(row.status, row.statusType)}
                      </td>

                      {/* Properties Found */}
                      <td className="py-3 px-2 text-center font-black text-gray-900 dark:text-white">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs">
                          {row.propertiesCount}
                        </span>
                      </td>

                      {/* Next Action */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                          {renderActionIcon(row.nextActionIcon)}
                          <span>{row.nextAction}</span>
                        </div>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${row.assignedBg || 'bg-red-500'} text-white font-bold text-[9px] flex items-center justify-center shrink-0`}>
                            {row.assignedInitials}
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11.5px]">
                            {row.assignedTo}
                          </span>
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                          <div>{row.lastUpdated.split(' ')[0]} {row.lastUpdated.split(' ')[1]} {row.lastUpdated.split(' ')[2]}</div>
                          <div className="text-[10px] text-gray-400">{row.lastUpdated.split(' ').slice(3).join(' ')}</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => setSelectedLeadId(row.id)}
                            className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 font-bold text-[11px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
                          >
                            View
                          </button>
                          
                          <div className="relative">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* THREE-DOT DROPDOWN MENU */}
                            {openDropdownId === row.id && (
                              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xl z-30 py-1 text-xs text-left">
                                <button
                                  onClick={() => { setSelectedLeadId(row.id); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => { setAssignTargetLead(row); setIsAssignModalOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  Assign Researcher
                                </button>
                                <button
                                  onClick={() => { setSelectedLeadId(row.id); setIsAddPropertyOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  Add Property
                                </button>
                                <button
                                  onClick={() => { showToast(`Scheduled site visit for ${row.personName}`); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-indigo-600"
                                >
                                  Schedule Site Visit
                                </button>
                                <button
                                  onClick={() => { setSelectedLeadId(row.id); setIsMarkReviewOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-[#C88A18]"
                                >
                                  Mark for Review
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredLeads.length ? 1 : 0} to {filteredLeads.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredLeads.length}</span> active searches
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
                <button className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <select className={`px-2 py-1 rounded-lg border text-xs font-bold ${
                darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <option>10 / page</option>
                <option>25 / page</option>
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT: LEAD DETAILS PANEL */}
        <div className={`lg:col-span-4 xl:col-span-4 rounded-2xl border shadow-md p-4 sticky top-16 space-y-4 transition-colors ${
          darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
        }`}>
          
          {/* PANEL HEADER TABS + CLOSE BUTTON */}
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
                <span>Lead Details</span>
                {rightPanelTab === 'details' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('properties')}
                className={`pb-2 transition-colors relative ${
                  rightPanelTab === 'properties'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Properties ({selectedLead?.propertiesCount || 0})</span>
                {rightPanelTab === 'properties' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('notes')}
                className={`pb-2 transition-colors relative ${
                  rightPanelTab === 'notes'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Notes</span>
                {rightPanelTab === 'notes' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('activity')}
                className={`pb-2 transition-colors relative ${
                  rightPanelTab === 'activity'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Activity</span>
                {rightPanelTab === 'activity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>
            </div>

            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!selectedLead ? (
            <div className="p-8 text-center text-xs text-gray-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-gray-600 dark:text-gray-300">No Lead Selected</p>
              <p className="text-[11px] text-gray-400 mt-1">Select a lead from the research list to view details.</p>
            </div>
          ) : (
            <>
              {/* TAB 1: LEAD DETAILS CONTENT */}
              {rightPanelTab === 'details' && (
                <div className="space-y-4">
                  
                  {/* LEAD HEADER BLOCK */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 text-white font-black text-base flex items-center justify-center shadow-md">
                        {selectedLead.avatar}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">
                          {selectedLead.personName}
                        </h3>
                        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#3B82C4]" />
                          <span>{selectedLead.phone}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{selectedLead.email}</span>
                        </div>
                      </div>
                    </div>

                    {renderStatusBadge(selectedLead.status, selectedLead.statusType)}
                  </div>

                  {/* LEAD INFORMATION SPECIFICATIONS */}
                  <div className="space-y-2 text-xs">
                    <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                      Lead Information
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Interested In
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white truncate mt-0.5">
                          {selectedLead.interestedIn}
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Preferred Location
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white truncate mt-0.5">
                          {selectedLead.preferredLocation}
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Budget (Expected)
                        </div>
                        <div className="font-bold text-[#C88A18] mt-0.5">
                          {selectedLead.budget}
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1E293B]">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Space Requirement
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedLead.spaceReq}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#1E293B] text-[11.5px] flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-medium">Target Opening:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedLead.targetOpening}</span>
                    </div>
                  </div>

                  {/* MD APPROVAL HIGHLIGHT CARD */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2 shadow-sm">
                    <span className="text-base">💡</span>
                    <span>MD approved this lead for property search on {selectedLead.mdApprovedDate}.</span>
                  </div>

                  {/* RESEARCH SUMMARY */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                      Research Summary
                    </div>

                    <div className="space-y-1.5 text-[11.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Properties Shortlisted:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedLead.propertiesCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Site Visits Done:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedLead.siteVisitsDone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Next Action:</span>
                        <span className="font-bold text-[#3B82C4]">{selectedLead.nextAction}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-500">Assigned To:</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full ${selectedLead.assignedBg || 'bg-red-500'} text-white font-bold text-[8px] flex items-center justify-center`}>
                            {selectedLead.assignedInitials}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{selectedLead.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM 2 BUTTONS: ADD SUGGESTED PROPERTY + MARK FOR REVIEW */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsAddPropertyOpen(true)}
                      className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:bg-gray-50 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#C88A18]" />
                      <span>Add Suggested Property</span>
                    </button>

                    <button
                      onClick={() => setIsMarkReviewOpen(true)}
                      className="py-2.5 px-3 rounded-xl bg-[#C88A18] hover:bg-[#a97412] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>Mark for Review</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: PROPERTIES LIST CONTENT */}
              {rightPanelTab === 'properties' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      Shortlisted Properties ({selectedLead.properties ? selectedLead.properties.length : 0})
                    </span>
                    <button 
                      onClick={() => setIsAddPropertyOpen(true)}
                      className="text-xs font-bold text-[#C88A18] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Property
                    </button>
                  </div>

                  {(!selectedLead.properties || selectedLead.properties.length === 0) ? (
                    <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-xl">
                      No properties added for this lead yet.
                    </div>
                  ) : (
                    selectedLead.properties.map((p, idx) => (
                      <div key={p.id || idx} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E293B] space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div className="font-bold text-xs text-gray-900 dark:text-white">{p.name}</div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F5EC] text-[#1F9D6A]">
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#3B82C4]" />
                          <span>{p.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200/50 dark:border-gray-700">
                          <span className="text-gray-400">Area: {p.area}</span>
                          <span className="font-bold text-[#C88A18]">{p.rent}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: NOTES CONTENT */}
              {rightPanelTab === 'notes' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add a new research note..."
                      className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:border-[#C88A18] outline-none ${
                        darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                      }`}
                      rows={3}
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold text-xs float-right"
                    >
                      Save Note
                    </button>
                    <div className="clear-both" />
                  </div>

                  <div className="space-y-2 pt-2">
                    {selectedLead.notes && selectedLead.notes.map((n, idx) => (
                      <div key={n.id || idx} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-amber-500/5 text-xs text-gray-700 dark:text-gray-300">
                        <div className="font-medium leading-relaxed">{n.text}</div>
                        <div className="text-[10px] text-gray-400 mt-1 text-right">{n.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIVITY TIMELINE CONTENT */}
              {rightPanelTab === 'activity' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Research Activity Timeline
                  </div>
                  <div className="relative pl-4 border-l-2 border-amber-500/30 space-y-3">
                    {selectedLead.activity && selectedLead.activity.map((act, idx) => (
                      <div key={act.id || idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C88A18] ring-4 ring-white dark:ring-[#172033]" />
                        <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                          {act.text}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{act.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* ---------------- MODAL 1: ADD SUGGESTED PROPERTY ---------------- */}
      {isAddPropertyOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C88A18]" />
                <span>Add Suggested Property for {selectedLead?.personName || 'Lead'}</span>
              </h3>
              <button onClick={() => setIsAddPropertyOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPropertySubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Property Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MP Nagar Main Road Unit"
                  value={newPropData.name}
                  onChange={(e) => setNewPropData({ ...newPropData, name: e.target.value })}
                  className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Location / Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MP Nagar Sector 1, Bhopal"
                  value={newPropData.location}
                  onChange={(e) => setNewPropData({ ...newPropData, location: e.target.value })}
                  className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Floor Area (sq.ft)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3,200 sq.ft"
                    value={newPropData.area}
                    onChange={(e) => setNewPropData({ ...newPropData, area: e.target.value })}
                    className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Expected Rent</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹1.6L / month"
                    value={newPropData.rent}
                    onChange={(e) => setNewPropData({ ...newPropData, rent: e.target.value })}
                    className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPropertyOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a57011] text-white font-bold shadow-md"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: MARK FOR REVIEW CONFIRMATION ---------------- */}
      {isMarkReviewOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 text-center ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-[#FBF1DD] text-[#C88A18] flex items-center justify-center mx-auto text-xl font-bold mb-3">
              💡
            </div>
            <h3 className="font-extrabold text-base mb-1">
              Mark for MD Review?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Are you sure suitable properties have been found for <b className="text-gray-900 dark:text-white">{selectedLead?.personName || 'this lead'}</b>? This will submit the search for MD review.
            </p>

            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setIsMarkReviewOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMarkForReview}
                className="px-4 py-2 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: REASSIGN RESEARCHER ---------------- */}
      {isAssignModalOpen && assignTargetLead && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm">Assign Researcher</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-gray-500 dark:text-gray-400">
                Select a researcher to lead property scouting for <b>{assignTargetLead.personName}</b> ({assignTargetLead.preferredLocation}):
              </p>

              <select 
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-bold ${
                  darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                }`}
              >
                <option value="Rohit Kumar">Rohit Kumar (North Region)</option>
                <option value="Suresh Singh">Suresh Singh (West Region)</option>
                <option value="Alka Mishra">Alka Mishra (South & East Region)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignee}
                className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: FILTER POPUP ---------------- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C88A18]" />
                <span>Filter Active Searches</span>
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Preferred City</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Cities (Delhi, Mumbai, Bangalore...)</option>
                  <option value="Delhi">Delhi, NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Researcher</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Researchers</option>
                  <option value="Rohit Kumar">Rohit Kumar</option>
                  <option value="Suresh Singh">Suresh Singh</option>
                  <option value="Alka Mishra">Alka Mishra</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Search Status</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Statuses</option>
                  <option value="Searching">Searching</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Site Visits">Site Visits Scheduled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => { setIsFilterModalOpen(false); showToast('Filters cleared'); }}
                className="text-gray-500 hover:underline font-bold"
              >
                Clear All
              </button>
              <button
                onClick={() => { setIsFilterModalOpen(false); showToast('Filters applied'); }}
                className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
