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
  XCircle,
  FileCheck,
  FileText,
  DollarSign,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  DownloadCloud,
  Eye,
  Check,
  AlertCircle,
  FileSignature,
  Handshake,
  Edit,
  Printer
} from 'lucide-react';
import { initialDealsData } from '../../data/fmsData';
import { computeDealCounts } from '../../utils/deals';
import { downloadLoiPdf, openLoiPdfInNewTab, printLoiDocument } from '../../utils/pdfGenerator';

export default function Phase5LOICommercial({ 
  setActivePhase, 
  showToast, 
  darkMode 
}) {
  const [deals, setDeals] = useState(initialDealsData);
  const [activeTab, setActiveTab] = useState('all'); // all, loi_drafting, legal_review, lease_negotiation, ready_finalization, closed
  const [selectedDealId, setSelectedDealId] = useState(1); // Default Hemant Sharma (#1)
  const [rightPanelTab, setRightPanelTab] = useState('details'); // details, docs, financials, approvals, activity
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isViewLOIOpen, setIsViewLOIOpen] = useState(false);
  const [isUpdateStageOpen, setIsUpdateStageOpen] = useState(false);
  const [newStage, setNewStage] = useState('Legal Review');
  const [isSendLegalOpen, setIsSendLegalOpen] = useState(false);

  const [isEditCommercialOpen, setIsEditCommercialOpen] = useState(false);
  const [editRent, setEditRent] = useState('₹1.6L / month');
  const [editDeposit, setEditDeposit] = useState('₹9.6L (6 months)');
  const [editLeaseTerm, setEditLeaseTerm] = useState('9 years');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Selected deal for Right Details Panel
  const selectedItem = deals.find(d => d.id === selectedDealId) || deals[0];

  // Real per-category counts, so the tab badges and footer never show
  // numbers unrelated to what's actually in the table.
  const counts = useMemo(() => computeDealCounts(deals), [deals]);

  // Filter deals based on active tab and search query
  const filteredDeals = deals.filter(item => {
    if (activeTab === 'loi_drafting' && item.currentStage !== 'LOI Drafting') return false;
    if (activeTab === 'legal_review' && item.currentStage !== 'Legal Review') return false;
    if (activeTab === 'lease_negotiation' && item.currentStage !== 'Lease Negotiation') return false;
    if (activeTab === 'ready_finalization' && item.currentStage !== 'Ready for Finalization') return false;
    if (activeTab === 'closed' && item.currentStage !== 'Closed') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.leadName.toLowerCase().includes(q) ||
        item.propertyName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.currentStage.toLowerCase().includes(q) ||
        item.assignedTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handler: Update Stage
  const handleConfirmUpdateStage = () => {
    setDeals(prev => prev.map(d => {
      if (d.id === selectedDealId) {
        let stageType = 'blue';
        if (newStage === 'Legal Review') stageType = 'purple';
        if (newStage === 'Lease Negotiation') stageType = 'amber';
        if (newStage === 'Ready for Finalization') stageType = 'green';

        return {
          ...d,
          currentStage: newStage,
          stageType: stageType
        };
      }
      return d;
    }));

    showToast(`Updated deal stage for ${selectedItem.propertyName} to "${newStage}"`);
    setIsUpdateStageOpen(false);

    if (newStage === 'Ready for Finalization') {
      setTimeout(() => {
        showToast(`Deal finalized! Ready for Phase 6: Project Creation.`);
      }, 1000);
    }
  };

  // Handler: Send for Legal Review
  const handleConfirmSendLegal = () => {
    setDeals(prev => prev.map(d => {
      if (d.id === selectedDealId) {
        return {
          ...d,
          currentStage: 'Legal Review',
          stageType: 'purple'
        };
      }
      return d;
    }));

    showToast(`Sent ${selectedItem.propertyName} for Legal Review`);
    setIsSendLegalOpen(false);
  };

  // Handler: Save Edited Commercial Terms
  const handleSaveCommercialTerms = () => {
    setDeals(prev => prev.map(d => {
      if (d.id === selectedDealId) {
        return {
          ...d,
          rent: editRent,
          deposit: editDeposit,
          leaseTerm: editLeaseTerm
        };
      }
      return d;
    }));

    showToast(`Commercial terms updated for ${selectedItem.propertyName}`);
    setIsEditCommercialOpen(false);
  };

  // Helper for Stage Badges
  const renderStageBadge = (stage) => {
    if (stage === 'Ready for Finalization') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E3F5EC] text-[#1F9D6A]">
          <CheckCircle2 className="w-3 h-3" />
          <span>Ready for Finalization</span>
        </span>
      );
    }
    if (stage === 'Legal Review') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEEAFE] text-[#6C63C9]">
          <ShieldCheck className="w-3 h-3" />
          <span>Legal Review</span>
        </span>
      );
    }
    if (stage === 'Lease Negotiation') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF3D6] text-[#D9911E]">
          <Handshake className="w-3 h-3" />
          <span>Lease Negotiation</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4]">
        <FileSignature className="w-3 h-3" />
        <span>LOI Drafting</span>
      </span>
    );
  };

  // Helper for Source Type Badges
  const renderSourceBadge = (sourceType) => {
    if (sourceType.includes('Interested + Property')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#FBF1DD] text-[#C88A18] border border-[#F4E1B5]">
          <Building2 className="w-3 h-3" />
          <span>Interested + Property</span>
        </span>
      );
    }
    if (sourceType.includes('Property Opportunity')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#E8F1FC] text-[#3B82C4] border border-[#CCE0FA]">
          <Store className="w-3 h-3" />
          <span>{sourceType}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#EEEAFE] text-[#6C63C9] border border-[#D9D3F9]">
        <User className="w-3 h-3" />
        <span>Interested Lead</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TABS AND TOOLBAR ROW */}
      <div className={`p-2.5 sm:p-3 rounded-2xl border shadow-sm transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* STATUS TABS */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>All Deals</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#C88A18]/20 text-[#C88A18]">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('loi_drafting')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'loi_drafting'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>LOI Drafting</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.loiDrafting}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legal_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'legal_review'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Legal Review</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.legalReview}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lease_negotiation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'lease_negotiation'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Lease Negotiation</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.leaseNegotiation}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ready_finalization')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ready_finalization'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Ready for Finalization</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.readyFinalization}
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
              placeholder="Search by name, location, project..." 
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                darkMode ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500' : 'bg-gray-50 border-[#E2E8F0] text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          <button 
            onClick={() => showToast('Exported Commercial & LOI Report')}
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
        
        {/* LEFT: COMMERCIAL DEALS TABLE */}
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
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Property / Location</th>
                  <th className="py-3 px-2">Source Type</th>
                  <th className="py-3 px-2">Current Stage</th>
                  <th className="py-3 px-2">Expected Close</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#253046] text-xs">
                {filteredDeals.map((row) => {
                  const isSelected = selectedDealId === row.id;

                  return (
                    <tr 
                      key={row.id}
                      onClick={() => setSelectedDealId(row.id)}
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

                      {/* Person / Lead Name (FIRST COLUMN AS REQUIRED) */}
                      <td className="py-3 px-3 min-w-[140px]">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${row.leadAvatarBg || 'bg-gray-800'} text-white font-bold text-[10.5px] flex items-center justify-center shrink-0 shadow-sm`}>
                            {row.leadAvatar}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {row.leadName}
                            </div>
                            <div className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                              {row.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Property / Location */}
                      <td className="py-3 px-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <img 
                            src={row.photo} 
                            alt={row.propertyName} 
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-gray-800"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {row.propertyName}
                            </div>
                            <div className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate font-medium">
                              {row.location} | {row.sqft}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source Type Badge */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        {renderSourceBadge(row.sourceType)}
                      </td>

                      {/* Current Stage */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        {renderStageBadge(row.currentStage)}
                      </td>

                      {/* Expected Close */}
                      <td className="py-3 px-2 whitespace-nowrap font-medium text-gray-600 dark:text-gray-400 text-[11px]">
                        {row.expectedClose}
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

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => setSelectedDealId(row.id)}
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
                              <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-xl z-30 py-1 text-xs text-left">
                                <button
                                  onClick={() => { setSelectedDealId(row.id); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => { setSelectedDealId(row.id); setIsViewLOIOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-blue-600"
                                >
                                  Generate / View LOI
                                </button>
                                <button
                                  onClick={() => { setSelectedDealId(row.id); setIsEditCommercialOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  Edit Commercial Terms
                                </button>
                                <button
                                  onClick={() => { setSelectedDealId(row.id); setIsSendLegalOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-purple-600"
                                >
                                  Send for Legal Review
                                </button>
                                <button
                                  onClick={() => { setSelectedDealId(row.id); setIsUpdateStageOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-[#C88A18]"
                                >
                                  Update Stage
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
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredDeals.length ? 1 : 0} to {filteredDeals.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredDeals.length}</span> deals
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

        {/* RIGHT: DETAILS PANEL */}
        <div className={`lg:col-span-4 xl:col-span-4 rounded-2xl border shadow-md p-4 sticky top-16 space-y-4 transition-colors ${
          darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
        }`}>
          
          {/* HEADER TABS + CLOSE BUTTON */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#253046] pb-2">
            <div className="flex items-center gap-2.5 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setRightPanelTab('details')}
                className={`pb-2 transition-colors relative shrink-0 ${
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
                className={`pb-2 transition-colors relative shrink-0 ${
                  rightPanelTab === 'docs'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Documents</span>
                {rightPanelTab === 'docs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('financials')}
                className={`pb-2 transition-colors relative shrink-0 ${
                  rightPanelTab === 'financials'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Financials</span>
                {rightPanelTab === 'financials' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('approvals')}
                className={`pb-2 transition-colors relative shrink-0 ${
                  rightPanelTab === 'approvals'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Approvals</span>
                {rightPanelTab === 'approvals' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('activity')}
                className={`pb-2 transition-colors relative shrink-0 ${
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

          {/* TAB 1: DETAILS */}
          {rightPanelTab === 'details' && (
            <div className="space-y-3.5">
              
              {/* PROPERTY IMAGE THUMBNAIL WITH STAGE BADGE */}
              <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-900">
                <img 
                  src={selectedItem.photo} 
                  alt={selectedItem.propertyName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  {renderStageBadge(selectedItem.currentStage)}
                </div>
              </div>

              {/* PROPERTY TITLE & SPECS */}
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                  {selectedItem.propertyName}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                    <Building2 className="w-3 h-3" />
                    <span>{selectedItem.sqft}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-[#3B82C4]" />
                    <span>{selectedItem.location}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-amber-500/10 text-[#C88A18] px-2 py-0.5 rounded-md font-bold">
                    <span>{selectedItem.rent}</span>
                  </span>
                </div>
              </div>

              {/* LEAD INFORMATION BLOCK */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                    Lead Information
                  </div>
                  {renderSourceBadge(selectedItem.sourceType)}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className={`w-9 h-9 rounded-full ${selectedItem.leadAvatarBg || 'bg-gray-800'} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                    {selectedItem.leadAvatar}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                      {selectedItem.leadName}
                    </div>
                    <div className="text-[10.5px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#3B82C4]" />
                      <span>{selectedItem.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1 pt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedItem.email}</span>
                </div>
              </div>

              {/* COMMERCIAL DETAILS LIST */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Commercial Details
                </div>

                <div className="space-y-1.5 text-[11.5px] p-2.5 rounded-xl bg-gray-50/70 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Expected Rent:</span>
                    <span className="font-bold text-[#C88A18]">{selectedItem.rent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedItem.deposit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lease Term:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedItem.leaseTerm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lock-in Period:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedItem.lockIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Escalation:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedItem.escalation}</span>
                  </div>
                </div>
              </div>

              {/* CURRENT STAGE & DATES */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Current Stage
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50/70 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    {renderStageBadge(selectedItem.currentStage)}
                  </div>
                  <div className="text-[10.5px] text-right text-gray-500">
                    <div>Started on: {selectedItem.startedOn}</div>
                    <div>Expected Close: <b className="text-gray-900 dark:text-white">{selectedItem.expectedClose}</b></div>
                  </div>
                </div>
              </div>

              {/* ASSIGNED TO */}
              <div className="space-y-1 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Assigned To
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50/70 dark:bg-[#1E293B]">
                  <div className={`w-7 h-7 rounded-full ${selectedItem.assignedBg || 'bg-red-500'} text-white font-bold text-[9.5px] flex items-center justify-center shrink-0`}>
                    {selectedItem.assignedInitials}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">{selectedItem.assignedTo}</div>
                    <div className="text-[10px] text-gray-400">{selectedItem.assignedRole}</div>
                  </div>
                </div>
              </div>

              {/* BOTTOM 3 BUTTONS */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setIsViewLOIOpen(true)}
                  className="py-2 px-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:bg-gray-50 text-gray-800 dark:text-gray-200 font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all truncate"
                >
                  <FileSignature className="w-3.5 h-3.5 text-[#3B82C4] shrink-0" />
                  <span className="truncate">View LOI Draft</span>
                </button>

                <button
                  onClick={() => setIsUpdateStageOpen(true)}
                  className="py-2 px-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:bg-gray-50 text-gray-800 dark:text-gray-200 font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all truncate"
                >
                  <Edit className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">Update Stage</span>
                </button>

                <button
                  onClick={() => setIsSendLegalOpen(true)}
                  className="py-2 px-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a97412] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-md transition-all truncate"
                >
                  <span className="truncate">Send for Legal Review</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5] shrink-0" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {rightPanelTab === 'docs' && (
            <div className="space-y-3 text-xs">
              <div className="font-bold text-gray-700 dark:text-gray-300">
                Commercial & Legal Documents ({selectedItem.documents ? selectedItem.documents.length : 0})
              </div>

              {selectedItem.documents && selectedItem.documents.length > 0 ? (
                selectedItem.documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E293B] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileSignature className="w-4 h-4 text-[#3B82C4] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate">{doc.name}</div>
                        <div className="text-[10px] text-gray-400">{doc.date} • {doc.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setIsViewLOIOpen(true)} className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => showToast(`Downloading ${doc.name}`)} className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <DownloadCloud className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 border border-dashed rounded-xl">
                  No commercial documents attached yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {rightPanelTab === 'financials' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-700 dark:text-gray-300">
                  Financial Terms Overview
                </div>
                <button 
                  onClick={() => setIsEditCommercialOpen(true)}
                  className="text-xs font-bold text-[#C88A18] hover:underline flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Edit Terms
                </button>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 bg-gray-50/50 dark:bg-[#1E293B]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Rent:</span>
                  <span className="font-bold text-[#C88A18]">{selectedItem.rent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Deposit:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedItem.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lease Duration:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedItem.leaseTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lock-in Period:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedItem.lockIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Escalation Clause:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedItem.escalation}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPROVALS */}
          {rightPanelTab === 'approvals' && (
            <div className="space-y-3 text-xs">
              <div className="font-bold text-gray-700 dark:text-gray-300">
                Required Approvals
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between bg-[#E3F5EC]">
                  <span className="font-bold text-[#1F9D6A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Commercial Terms Sign-off
                  </span>
                  <span className="text-[10.5px] font-bold text-[#1F9D6A]">Approved</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between bg-purple-50 dark:bg-purple-950/40">
                  <span className="font-bold text-[#6C63C9] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Legal Clearance
                  </span>
                  <span className="text-[10.5px] font-bold text-[#6C63C9]">In Review</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY */}
          {rightPanelTab === 'activity' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Deal Progress Timeline
              </div>
              <div className="relative pl-4 border-l-2 border-amber-500/30 space-y-3">
                {selectedItem.activity && selectedItem.activity.map((act, idx) => (
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

        </div>

      </div>

      {/* ---------------- MODAL 1: VIEW / GENERATE LOI DRAFT ---------------- */}
      {isViewLOIOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden p-6 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF4D6] dark:bg-[#C88A18]/20 border border-[#C88A18]/40 flex items-center justify-center text-[#C88A18]">
                  <FileSignature className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">
                    Letter of Intent (LOI)
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {selectedItem.propertyName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewLOIOpen(false)} 
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Document Paper Preview Sheet */}
            <div className="my-4 max-h-[420px] overflow-y-auto pr-1 sidebar-scroll">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0F172A] p-5 shadow-inner space-y-4 text-xs font-sans text-gray-800 dark:text-gray-200">
                
                {/* Official Letterhead Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-sm text-[#1F2A44] dark:text-white tracking-tight">
                      MYSTERY ROOMS GAMING PRIVATE LIMITED
                    </h4>
                    <p className="text-[10px] font-bold text-[#C88A18] uppercase tracking-wider mt-0.5">
                      Enterprise Console — Property FMS
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF4D6] text-[#C88A18] font-bold text-[10px] border border-[#F3DCA0]">
                    OFFICIAL DRAFT
                  </span>
                </div>

                {/* Document Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-[#1E293B] p-3 rounded-lg border border-gray-200/80 dark:border-gray-700/80 text-[11px]">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium block">Date:</span>
                    <strong className="text-gray-900 dark:text-white">{selectedItem.startedOn || '14 Sep 2025'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium block">From:</span>
                    <strong className="text-gray-900 dark:text-white">Mystery Rooms Gaming Pvt. Ltd.</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium block">To / Lessor:</span>
                    <strong className="text-gray-900 dark:text-white">Property Owner / Lessor ({selectedItem.propertyName})</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium block">Subject:</span>
                    <strong className="text-[#C88A18]">Proposal for Lease of Commercial Space at {selectedItem.location}</strong>
                  </div>
                </div>

                {/* Key Commercial Terms Box */}
                <div className="rounded-lg border border-[#F3DCA0] bg-[#FFF9EE] dark:bg-[#172033] dark:border-[#C88A18]/30 p-3.5 space-y-2.5">
                  <h5 className="font-extrabold text-[11px] text-[#1F2A44] dark:text-[#F5E8C8] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#F3DCA0] dark:border-gray-700 pb-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#C88A18]" />
                    Summary of Commercial & Lease Terms
                  </h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Premises: </span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedItem.propertyName}, {selectedItem.fullAddress || selectedItem.location} ({selectedItem.sqft})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Lessee: </span>
                      <span className="font-bold text-gray-900 dark:text-white">Mystery Rooms / {selectedItem.leadName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Monthly Rent: </span>
                      <span className="font-extrabold text-[#C88A18]">{selectedItem.rent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Security Deposit: </span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedItem.deposit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Lease Period: </span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedItem.leaseTerm} (Lock-in: {selectedItem.lockIn})</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Escalation: </span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedItem.escalation}</span>
                    </div>
                  </div>
                </div>

                {/* Legal Terms Notice */}
                <p className="text-[10.5px] italic text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1E293B]/60 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 leading-snug">
                  This Letter of Intent (LOI) sets out the principal terms of agreement for the leasing of the aforementioned property. Final binding agreement is subject to legal clearance.
                </p>

                {/* Signatures Preview Block */}
                <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-between text-[10px] text-gray-500 font-bold">
                  <div>
                    <div className="w-24 border-b border-gray-400 dark:border-gray-600 mb-1" />
                    Authorized Signatory
                  </div>
                  <div className="text-right">
                    <div className="w-24 border-b border-gray-400 dark:border-gray-600 mb-1 ml-auto" />
                    Property Owner / Lessor
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800 text-xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    printLoiDocument(selectedItem);
                    if (showToast) showToast('Opening print dialog for LOI...');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Print LOI document"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-500" /> Print
                </button>

                <button 
                  onClick={() => {
                    openLoiPdfInNewTab(selectedItem);
                    if (showToast) showToast('Opening PDF in new tab...');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#C88A18]/40 text-[#C88A18] font-bold flex items-center gap-1.5 bg-[#FFF4D6]/50 dark:bg-[#C88A18]/10 hover:bg-[#FFF4D6] transition-colors"
                  title="Open PDF document directly in new browser tab"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview PDF
                </button>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setIsViewLOIOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    downloadLoiPdf(selectedItem);
                    if (showToast) showToast('Downloading LOI PDF document...');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: UPDATE STAGE ---------------- */}
      {isUpdateStageOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#C88A18]" />
                <span>Update Deal Stage</span>
              </h3>
              <button onClick={() => setIsUpdateStageOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Select Stage</label>
                <select 
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                >
                  <option value="LOI Drafting">LOI Drafting</option>
                  <option value="Legal Review">Legal Review</option>
                  <option value="Lease Negotiation">Lease Negotiation</option>
                  <option value="Ready for Finalization">Ready for Finalization</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsUpdateStageOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdateStage}
                className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Save Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: SEND FOR LEGAL REVIEW ---------------- */}
      {isSendLegalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 text-center ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-[#EEEAFE] text-[#6C63C9] flex items-center justify-center mx-auto text-xl font-bold mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base mb-1">
              Send for Legal Review?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Are you sure you want to send LOI & Commercial terms for <b className="text-gray-900 dark:text-white">{selectedItem.propertyName}</b> to the legal team for clearance?
            </p>

            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setIsSendLegalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendLegal}
                className="px-4 py-2 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Send to Legal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: EDIT COMMERCIAL TERMS ---------------- */}
      {isEditCommercialOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#C88A18]" />
                <span>Edit Commercial Terms</span>
              </h3>
              <button onClick={() => setIsEditCommercialOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Monthly Rent</label>
                <input 
                  type="text"
                  value={editRent}
                  onChange={(e) => setEditRent(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Security Deposit</label>
                <input 
                  type="text"
                  value={editDeposit}
                  onChange={(e) => setEditDeposit(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Lease Duration</label>
                <input 
                  type="text"
                  value={editLeaseTerm}
                  onChange={(e) => setEditLeaseTerm(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsEditCommercialOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommercialTerms}
                className="px-4 py-1.5 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Save Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 5: FILTER POPUP ---------------- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C88A18]" />
                <span>Filter Deals</span>
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Commercial Stage</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Stages</option>
                  <option value="LOI Drafting">LOI Drafting</option>
                  <option value="Legal Review">Legal Review</option>
                  <option value="Lease Negotiation">Lease Negotiation</option>
                  <option value="Ready for Finalization">Ready for Finalization</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Manager</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Managers</option>
                  <option value="Rohit Kumar">Rohit Kumar</option>
                  <option value="Suresh Singh">Suresh Singh</option>
                  <option value="Alka Mishra">Alka Mishra</option>
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
