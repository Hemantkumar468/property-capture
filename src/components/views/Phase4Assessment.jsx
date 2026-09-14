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
  AlertCircle
} from 'lucide-react';
import { initialAssessmentsData } from '../../data/fmsData';
import { computeAssessmentCounts } from '../../utils/assessments';

export default function Phase4Assessment({ 
  setActivePhase, 
  showToast, 
  darkMode 
}) {
  const [assessments, setAssessments] = useState(initialAssessmentsData);
  const [activeTab, setActiveTab] = useState('all'); // all, in_progress, completed, need_info, not_feasible
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(1); // Default Hemant Sharma (#1)
  const [rightPanelTab, setRightPanelTab] = useState('details'); // details, assessment, docs, notes, activity
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isMoveToLOIOpen, setIsMoveToLOIOpen] = useState(false);
  const [isNotFeasibleOpen, setIsNotFeasibleOpen] = useState(false);
  const [notFeasibleReason, setNotFeasibleReason] = useState('Technical Issue');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [newAssignee, setNewAssignee] = useState('Rohit Kumar');
  const [newTargetDate, setNewTargetDate] = useState('25 Sep 2025');

  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Selected item for Right Details Panel
  const selectedItem = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];

  // Real per-category counts, so the tab badges and footer never show
  // numbers unrelated to what's actually in the table.
  const counts = useMemo(() => computeAssessmentCounts(assessments), [assessments]);

  // Filter items based on tab & search query
  const filteredAssessments = assessments.filter(item => {
    if (activeTab === 'in_progress' && item.status !== 'In Progress') return false;
    if (activeTab === 'completed' && item.status !== 'Completed') return false;
    if (activeTab === 'need_info' && item.status !== 'Need Info') return false;
    if (activeTab === 'not_feasible' && item.status !== 'Not Feasible') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.leadName.toLowerCase().includes(q) ||
        item.propertyName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.assignedTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handler: Move to LOI (Step 5)
  const handleConfirmMoveToLOI = () => {
    setAssessments(prev => prev.map(a => {
      if (a.id === selectedAssessmentId) {
        return {
          ...a,
          status: 'Completed',
          statusType: 'green'
        };
      }
      return a;
    }));

    showToast(`Assessment completed for ${selectedItem?.propertyName || 'property'}! Moving to Phase 5: LOI & Commercial.`);
    setIsMoveToLOIOpen(false);
    setTimeout(() => {
      setActivePhase(5);
    }, 1200);
  };

  // Handler: Mark Not Feasible
  const handleConfirmNotFeasible = () => {
    setAssessments(prev => prev.map(a => {
      if (a.id === selectedAssessmentId) {
        return {
          ...a,
          status: 'Not Feasible',
          statusType: 'red'
        };
      }
      return a;
    }));

    showToast(`Marked ${selectedItem?.propertyName || 'property'} as Not Feasible (${notFeasibleReason}).`);
    setIsNotFeasibleOpen(false);
  };

  // Handler: Request Information
  const handleConfirmRequestInfo = () => {
    setAssessments(prev => prev.map(a => {
      if (a.id === selectedAssessmentId) {
        return {
          ...a,
          status: 'Need Info',
          statusType: 'amber'
        };
      }
      return a;
    }));

    showToast(`Requested additional information for ${selectedItem?.propertyName || 'property'}.`);
    setIsRequestInfoOpen(false);
    setRequestMsg('');
  };

  // Handler: Save Reassign
  const handleSaveAssignee = () => {
    if (!assignTarget) return;

    let initials = 'RK';
    let bg = 'bg-[#E5484D]';
    if (newAssignee === 'Suresh Singh') { initials = 'SS'; bg = 'bg-[#3B82C4]'; }
    if (newAssignee === 'Alka Mishra') { initials = 'AM'; bg = 'bg-[#6C63C9]'; }

    setAssessments(prev => prev.map(a => {
      if (a.id === assignTarget.id) {
        return {
          ...a,
          assignedTo: newAssignee,
          assignedInitials: initials,
          assignedBg: bg,
          targetDate: newTargetDate
        };
      }
      return a;
    }));

    showToast(`Reassigned ${assignTarget.propertyName} to ${newAssignee}`);
    setIsAssignModalOpen(false);
    setAssignTarget(null);
  };

  // Handler: Add Note
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    setAssessments(prev => prev.map(a => {
      if (a.id === selectedAssessmentId) {
        return {
          ...a,
          notes: [
            { id: `note-${Date.now()}`, text: newNoteText.trim(), date: 'Today' },
            ...(a.notes || [])
          ]
        };
      }
      return a;
    }));

    showToast('Assessment note saved!');
    setNewNoteText('');
  };

  // Helper for Status Badge
  const renderStatusBadge = (status) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E3F5EC] text-[#1F9D6A]">
          <CheckCircle2 className="w-3 h-3" />
          <span>Completed</span>
        </span>
      );
    }
    if (status === 'Not Feasible') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDEBEC] text-[#E5484D]">
          <XCircle className="w-3 h-3" />
          <span>Not Feasible</span>
        </span>
      );
    }
    if (status === 'Need Info') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF3D6] text-[#D9911E]">
          <Clock className="w-3 h-3" />
          <span>Need Info</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82C4]" />
        <span>In Progress</span>
      </span>
    );
  };

  // Helper for Assessment Type Badge
  const renderTypeBadge = (typeStr) => {
    if (!typeStr || typeof typeStr !== 'string') {
      return (
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11.5px]">
          Technical & Feasibility
        </span>
      );
    }
    const parts = typeStr.split(' + ');
    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11.5px]">
          {parts[0]}
        </span>
        {parts[1] && (
          <span className="text-[10px] text-gray-500 font-medium">
            + {parts[1]}
          </span>
        )}
      </div>
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
            <span>All</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#C88A18]/20 text-[#C88A18]">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'in_progress'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>In Progress</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.inProgress}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'completed'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.completed}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('need_info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'need_info'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Need Info</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.needInfo}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('not_feasible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'not_feasible'
                ? 'bg-[#111827] text-white border-b-2 border-[#C88A18] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Not Feasible</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {counts.notFeasible}
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
              placeholder="Search by name, location, property..." 
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                darkMode ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500' : 'bg-gray-50 border-[#E2E8F0] text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          <button 
            onClick={() => showToast('Exported Assessment Report')}
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
        
        {/* LEFT: ASSESSMENT TABLE */}
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
                  <th className="py-3 px-3">Lead / Project</th>
                  <th className="py-3 px-3">Property Details</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Assessment Type</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-2">Target Date</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#253046] text-xs">
                {filteredAssessments.map((row) => {
                  const isSelected = selectedAssessmentId === row.id;

                  return (
                    <tr 
                      key={row.id}
                      onClick={() => setSelectedAssessmentId(row.id)}
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

                      {/* Lead / Project */}
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

                      {/* Property Details */}
                      <td className="py-3 px-3 min-w-[170px]">
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
                              {row.sqft} • <b className="text-[#C88A18] font-bold">{row.rent}</b>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                          <MapPin className="w-3.5 h-3.5 text-[#3B82C4]" />
                          <span>{row.location}</span>
                        </div>
                      </td>

                      {/* Assessment Type */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        {renderTypeBadge(row.assessmentType)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        {renderStatusBadge(row.status)}
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

                      {/* Target Date */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-[11px] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{row.targetDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => setSelectedAssessmentId(row.id)}
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
                                  onClick={() => { setSelectedAssessmentId(row.id); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => { setAssignTarget(row); setIsAssignModalOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                                >
                                  Assign Assessment
                                </button>
                                <button
                                  onClick={() => { setSelectedAssessmentId(row.id); setIsRequestInfoOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-amber-600"
                                >
                                  Request Information
                                </button>
                                <button
                                  onClick={() => { setSelectedAssessmentId(row.id); setIsNotFeasibleOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-red-600"
                                >
                                  Mark Not Feasible
                                </button>
                                <button
                                  onClick={() => { setSelectedAssessmentId(row.id); setIsMoveToLOIOpen(true); setOpenDropdownId(null); }}
                                  className="w-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-[#C88A18]"
                                >
                                  Move to LOI
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
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredAssessments.length ? 1 : 0} to {filteredAssessments.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredAssessments.length}</span> assessments
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-40">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#3B82C4] text-white">
                  1
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
          
          {/* HEADER TABS + CLOSE */}
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
                onClick={() => setRightPanelTab('assessment')}
                className={`pb-2 transition-colors relative ${
                  rightPanelTab === 'assessment'
                    ? 'text-[#C88A18] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Assessment</span>
                {rightPanelTab === 'assessment' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18]" />
                )}
              </button>

              <button
                onClick={() => setRightPanelTab('docs')}
                className={`pb-2 transition-colors relative ${
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

          {/* TAB 1: DETAILS */}
          {rightPanelTab === 'details' && (
            <div className="space-y-4">
              
              {/* PROPERTY IMAGE THUMBNAIL WITH BADGE */}
              <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-900">
                <img 
                  src={selectedItem.photo} 
                  alt={selectedItem.propertyName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  {renderStatusBadge(selectedItem.status)}
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
                  <span className="flex items-center gap-1 bg-amber-500/10 text-[#C88A18] px-2 py-0.5 rounded-md font-bold">
                    <span>{selectedItem.rent}</span>
                  </span>
                </div>
              </div>

              {/* LEAD INFORMATION BLOCK */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Lead Information
                </div>

                <div className="flex items-center gap-2.5">
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

                <div className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1 pt-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedItem.email}</span>
                </div>
              </div>

              {/* LOCATION */}
              <div className="space-y-1 text-xs">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Location
                </div>
                <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#3B82C4]" />
                  <span>{selectedItem.fullAddress || `${selectedItem.location}, India`}</span>
                </div>
              </div>

              {/* ASSESSMENT PROGRESS CHECKLIST */}
              <div className="space-y-2 text-xs pt-1">
                <div className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Assessment Progress
                </div>

                <div className="space-y-2 text-[11.5px]">
                  {selectedItem.progress && selectedItem.progress.length > 0 ? (
                    selectedItem.progress.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50/50 dark:bg-[#1E293B]">
                        <div className="flex items-center gap-2">
                          {item.status === 'Completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#1F9D6A]" />
                          ) : item.status === 'In Progress' ? (
                            <span className="w-4 h-4 rounded-full border-2 border-[#3B82C4] bg-[#3B82C4]/15" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-700" />
                          )}
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</span>
                        </div>
                        <span className={`text-[10.5px] font-bold ${
                          item.status === 'Completed' ? 'text-[#1F9D6A]' : item.status === 'In Progress' ? 'text-[#3B82C4]' : 'text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50/50 dark:bg-[#1E293B]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1F9D6A]" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Technical Feasibility</span>
                        </div>
                        <span className="text-[10.5px] font-bold text-[#1F9D6A]">12 Sep 2025</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50/50 dark:bg-[#1E293B]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-[#3B82C4] border-t-transparent" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Financial Analysis</span>
                        </div>
                        <span className="text-[10.5px] font-bold text-[#3B82C4]">In Progress</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50/50 dark:bg-[#1E293B]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-700" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Legal Verification</span>
                        </div>
                        <span className="text-[10.5px] font-bold text-gray-400">Pending</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* BOTTOM BUTTONS: VIEW FULL REPORT + MOVE TO LOI */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => showToast('Generated full assessment report PDF')}
                  className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:bg-gray-50 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#3B82C4]" />
                  <span>View Full Report</span>
                </button>

                <button
                  onClick={() => setIsMoveToLOIOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#C88A18] hover:bg-[#a97412] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Move to LOI</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ASSESSMENT DETAILED MODULES */}
          {rightPanelTab === 'assessment' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Detailed Assessment Checklist
              </div>

              {/* Technical Feasibility Module */}
              <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#1F9D6A]" /> Technical Feasibility
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3F5EC] text-[#1F9D6A]">Passed</span>
                </div>
                <div className="text-[11px] text-gray-500 space-y-1 pl-5">
                  <div>✓ Structural stability check passed</div>
                  <div>✓ Electrical power load: 40kW approved</div>
                  <div>✓ Fire safety NOC eligible</div>
                </div>
              </div>

              {/* Financial Analysis Module */}
              <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#3B82C4]" /> Financial Analysis
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F1FC] text-[#3B82C4]">In Progress</span>
                </div>
                <div className="text-[11px] text-gray-500 space-y-1 pl-5">
                  <div>✓ Rent to revenue ratio: 12% (Viable)</div>
                  <div>⏳ Renovation cost estimate under review</div>
                </div>
              </div>

              {/* Legal Verification Module */}
              <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Legal Verification
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Pending</span>
                </div>
                <div className="text-[11px] text-gray-400 pl-5">
                  Commercial lease clearance pending legal team sign-off.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {rightPanelTab === 'docs' && (
            <div className="space-y-3 text-xs">
              <div className="font-bold text-gray-700 dark:text-gray-300">
                Attached Documents ({selectedItem.documents ? selectedItem.documents.length : 0})
              </div>

              {selectedItem.documents && selectedItem.documents.length > 0 ? (
                selectedItem.documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1E293B] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#3B82C4] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate">{doc.name}</div>
                        <div className="text-[10px] text-gray-400">{doc.date} • {doc.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <DownloadCloud className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 border border-dashed rounded-xl">
                  No documents attached yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTES */}
          {rightPanelTab === 'notes' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add an assessment note..."
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
                {selectedItem.notes && selectedItem.notes.map((n, idx) => (
                  <div key={n.id || idx} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-amber-500/5 text-xs text-gray-700 dark:text-gray-300">
                    <div className="font-medium leading-relaxed">{n.text}</div>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">{n.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY TIMELINE */}
          {rightPanelTab === 'activity' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Assessment Activity History
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

      {/* ---------------- MODAL 1: MOVE TO LOI CONFIRMATION ---------------- */}
      {isMoveToLOIOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 text-center ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-[#FBF1DD] text-[#C88A18] flex items-center justify-center mx-auto text-xl font-bold mb-3">
              📜
            </div>
            <h3 className="font-extrabold text-base mb-1">
              Move Property to LOI & Commercial?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Are you sure technical, financial, and legal assessments are complete for <b className="text-gray-900 dark:text-white">{selectedItem?.propertyName || 'this property'}</b>?
            </p>

            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setIsMoveToLOIOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMoveToLOI}
                className="px-4 py-2 rounded-xl bg-[#C88A18] hover:bg-[#a87413] text-white font-bold shadow-md"
              >
                Move to LOI (Step 5)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: MARK NOT FEASIBLE ---------------- */}
      {isNotFeasibleOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm text-red-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Mark Not Feasible</span>
              </h3>
              <button onClick={() => setIsNotFeasibleOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Reason for Rejection</label>
                <select 
                  value={notFeasibleReason}
                  onChange={(e) => setNotFeasibleReason(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                >
                  <option value="Technical Issue">Technical Issue (Structure/Power)</option>
                  <option value="Financially Not Viable">Financially Not Viable (High Rent/CAPEX)</option>
                  <option value="Legal Issue">Legal Issue (Commercial NOC/Clearance)</option>
                  <option value="Operational Issue">Operational Issue (Access/Parking)</option>
                  <option value="Poor Market Potential">Poor Market Potential</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsNotFeasibleOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNotFeasible}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: ASSIGN ASSESSMENT ---------------- */}
      {isAssignModalOpen && assignTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-extrabold text-sm">Assign Assessment Task</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Evaluator</label>
                <select 
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                >
                  <option value="Rohit Kumar">Rohit Kumar (Tech & Financial)</option>
                  <option value="Suresh Singh">Suresh Singh (Legal & Commercial)</option>
                  <option value="Alka Mishra">Alka Mishra (Market Feasibility)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
                <input 
                  type="text"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>
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
                <span>Filter Assessments</span>
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assessment Status</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Need Info">Need Info</option>
                  <option value="Not Feasible">Not Feasible</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Evaluator</label>
                <select className={`w-full p-2 rounded-xl border font-medium ${darkMode ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}>
                  <option value="all">All Evaluators</option>
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
