import React, { useMemo, useState } from 'react';
import { 
  Building, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PauseCircle, 
  MoreVertical, 
  Eye, 
  Filter, 
  Search, 
  Download, 
  Edit, 
  ArrowRight, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  PlusCircle, 
  FileCheck, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FolderOpen,
  Sparkles,
  Layers,
  Wrench,
  Users,
  FileCode
} from 'lucide-react';
import { initialProjectsData } from '../../data/fmsData';
import { computeProjectCounts } from '../../utils/projects';

export default function Phase6ProjectCreation({ showToast, darkMode }) {
  // Main data state
  const [projectsList, setProjectsList] = useState(initialProjectsData);

  // Real per-status counts, so the tab badges and footer never show numbers
  // unrelated to what's actually in the table.
  const counts = useMemo(() => computeProjectCounts(projectsList), [projectsList]);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // all, in_progress, upcoming, on_hold, completed
  const [searchQuery, setSearchQuery] = useState('');
  
  // Right details panel tabs state
  const [rightPanelTab, setRightPanelTab] = useState('details'); // details, timeline, tasks, team, documents
  const [panelOpen, setPanelOpen] = useState(true);

  // Dropdown states
  const [openActionDropdownId, setOpenActionDropdownId] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [pmFilter, setPmFilter] = useState('all');
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignPmOpen, setIsAssignPmOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Currently active selected project object
  const selectedProject = projectsList.find(p => p.id === selectedProjectId) || projectsList[0];

  // Filtering logic
  const filteredProjects = projectsList.filter(proj => {
    // Status tab filter
    if (activeTab === 'in_progress' && proj.status !== 'In Progress') return false;
    if (activeTab === 'upcoming' && proj.status !== 'Upcoming') return false;
    if (activeTab === 'on_hold' && proj.status !== 'On Hold') return false;
    if (activeTab === 'completed' && proj.status !== 'Completed') return false;

    // PM filter
    if (pmFilter !== 'all' && proj.projectManager !== pmFilter) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = proj.projectName.toLowerCase().includes(q);
      const matchId = proj.projectId.toLowerCase().includes(q);
      const matchLead = proj.leadName.toLowerCase().includes(q);
      const matchLoc = proj.location.toLowerCase().includes(q) || proj.locality.toLowerCase().includes(q);
      const matchPm = proj.projectManager.toLowerCase().includes(q);
      return matchName || matchId || matchLead || matchLoc || matchPm;
    }

    return true;
  });

  // Select all checkbox handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredProjects.map(p => p.id));
      setSelectedRowIds(allIds);
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const next = new Set(selectedRowIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRowIds(next);
  };

  // Status Badge helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F1FC] text-[#3B82C4] border border-[#3B82C4]/20">
            <Clock className="w-3 h-3 text-[#3B82C4]" /> In Progress
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EEEAFE] text-[#6C63C9] border border-[#6C63C9]/20">
            <Calendar className="w-3 h-3 text-[#6C63C9]" /> Upcoming
          </span>
        );
      case 'On Hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF3D6] text-[#D9911E] border border-[#D9911E]/20">
            <PauseCircle className="w-3 h-3 text-[#D9911E]" /> On Hold
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E3F5EC] text-[#1F9D6A] border border-[#1F9D6A]/20">
            <CheckCircle2 className="w-3 h-3 text-[#1F9D6A]" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  // Action Menu Handler
  const handleMenuAction = (action, proj) => {
    setOpenActionDropdownId(null);
    setSelectedProjectId(proj.id);
    setPanelOpen(true);

    switch (action) {
      case 'view':
        showToast(`Viewing project ${proj.projectName}`);
        break;
      case 'edit':
        setIsEditModalOpen(true);
        break;
      case 'assign_pm':
        setIsAssignPmOpen(true);
        break;
      case 'view_plan':
        setIsPlanModalOpen(true);
        break;
      case 'start_execution':
        setIsExecutionModalOpen(true);
        break;
      case 'hold':
        setProjectsList(prev => prev.map(p => p.id === proj.id ? { ...p, status: 'On Hold' } : p));
        showToast(`Project ${proj.projectName} put on hold.`);
        break;
      case 'complete':
        setProjectsList(prev => prev.map(p => p.id === proj.id ? { ...p, status: 'Completed' } : p));
        showToast(`Project ${proj.projectName} marked as Completed!`);
        break;
      default:
        showToast(`Action executed for ${proj.projectName}`);
    }
  };

  const handleExport = (format) => {
    setExportDropdownOpen(false);
    showToast(`Exporting ${filteredProjects.length} projects to ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-3 font-sans">
      
      {/* 1. PROJECT STATUS TABS & TOOLBAR ROW */}
      <div className={`p-3 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* Left: Horizontal Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Projects', count: counts.all },
            { id: 'in_progress', label: 'In Progress', count: counts.inProgress },
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'on_hold', label: 'On Hold', count: counts.onHold },
            { id: 'completed', label: 'Completed', count: counts.completed }
          ].map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative shrink-0 ${
                  isTabActive
                    ? 'text-[#C88A18] font-extrabold'
                    : darkMode
                      ? 'text-[#94A3B8] hover:text-white'
                      : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10.5px] font-black ${
                  isTabActive
                    ? 'bg-[#F5E8C8] text-[#C88A18]'
                    : darkMode ? 'bg-[#1F2937] text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>

                {/* Bottom Active Gold Indicator Line */}
                {isTabActive && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#C88A18] rounded-full shadow-[0_0_8px_rgba(200,138,24,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Filters, Search & Export Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Filters Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                filterDropdownOpen || pmFilter !== 'all'
                  ? 'bg-[#F5E8C8] border-[#C88A18] text-[#C88A18]'
                  : darkMode
                    ? 'bg-[#1E293B] border-[#334155] text-gray-300 hover:bg-[#2A374D]'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {pmFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#C88A18]" />
              )}
            </button>

            {/* Filter Dropdown Popup */}
            {filterDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 p-3 rounded-2xl border shadow-xl z-30 transition-all ${
                darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-800'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#253046] mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C88A18]">Filter Projects</span>
                  <button onClick={() => setFilterDropdownOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Project Manager</label>
                    <select
                      value={pmFilter}
                      onChange={(e) => setPmFilter(e.target.value)}
                      className={`w-full p-2 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                      }`}
                    >
                      <option value="all">All Project Managers</option>
                      <option value="Rohit Kumar">Rohit Kumar</option>
                      <option value="Suresh Singh">Suresh Singh</option>
                      <option value="Alka Mishra">Alka Mishra</option>
                      <option value="Vivek Singh">Vivek Singh</option>
                      <option value="Neha Kapoor">Neha Kapoor</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button 
                      onClick={() => { setPmFilter('all'); setFilterDropdownOpen(false); }}
                      className="text-[11px] text-gray-400 hover:underline font-bold"
                    >
                      Reset All
                    </button>
                    <button 
                      onClick={() => setFilterDropdownOpen(false)}
                      className="px-3 py-1 rounded-lg bg-[#C88A18] text-white font-bold text-[11px]"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Search Input */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project, location, franchisee..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                darkMode 
                  ? 'bg-[#1E293B] border-[#334155] text-white placeholder:text-gray-500 focus:border-[#C88A18]' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#C88A18]'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Export Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                exportDropdownOpen
                  ? 'bg-[#111827] border-[#111827] text-white'
                  : darkMode
                    ? 'bg-[#1E293B] border-[#334155] text-gray-300 hover:bg-[#2A374D]'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Export Options Dropdown */}
            {exportDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-36 py-1.5 rounded-xl border shadow-xl z-30 transition-all ${
                darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-800'
              }`}>
                <button 
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#C88A18]/10 hover:text-[#C88A18] transition-colors"
                >
                  Export CSV
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#C88A18]/10 hover:text-[#C88A18] transition-colors"
                >
                  Export Excel
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#C88A18]/10 hover:text-[#C88A18] transition-colors"
                >
                  Export PDF
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 2. MAIN LAYOUT GRID: TABLE & STICKY RIGHT DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        
        {/* MAIN PROJECT TABLE CONTAINER */}
        <div className={`${panelOpen ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'} transition-all duration-300 space-y-3`}>
          
          <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                
                {/* TABLE HEADER */}
                <thead>
                  <tr className={`border-b text-[11px] font-black uppercase tracking-wider select-none ${
                    darkMode ? 'bg-[#111827]/60 border-[#253046] text-[#94A3B8]' : 'bg-[#F8FAFC] border-gray-200 text-[#64748B]'
                  }`}>
                    <th className="py-3 px-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={filteredProjects.length > 0 && selectedRowIds.size === filteredProjects.length}
                        className="rounded border-gray-300 text-[#C88A18] focus:ring-[#C88A18] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-2 w-8 text-center">#</th>
                    <th className="py-3 px-3">Project Name</th>
                    <th className="py-3 px-3">Franchisee / Lead</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Property Details</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">Target Opening</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Project Manager</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y divide-gray-100 dark:divide-[#253046] text-xs font-medium">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="py-12 text-center text-gray-400">
                        <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <div>No projects found matching the filter criteria.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((proj, idx) => {
                      const isSelected = selectedProjectId === proj.id;
                      const isChecked = selectedRowIds.has(proj.id);

                      return (
                        <tr 
                          key={proj.id}
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            setPanelOpen(true);
                          }}
                          className={`transition-colors cursor-pointer group ${
                            isSelected 
                              ? darkMode ? 'bg-[#1E293B]/90 font-semibold' : 'bg-[#FBF7EE]'
                              : darkMode ? 'hover:bg-[#1E293B]/50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectRow(proj.id)}
                              className="rounded border-gray-300 text-[#C88A18] focus:ring-[#C88A18] cursor-pointer"
                            />
                          </td>

                          {/* Index Number */}
                          <td className="py-3.5 px-2 text-center text-gray-400 font-bold">
                            {idx + 1}
                          </td>

                          {/* Project Name + ID + Thumbnail */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 relative">
                                <img 
                                  src={proj.photo} 
                                  alt={proj.projectName} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div>
                                <div className="font-extrabold text-gray-900 dark:text-white leading-tight">
                                  {proj.projectName}
                                </div>
                                <div className="text-[10.5px] font-mono text-gray-400 mt-0.5">
                                  {proj.projectId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Franchisee / Lead Avatar & Name */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full ${proj.leadAvatarBg} text-white font-black text-[10.5px] flex items-center justify-center shrink-0 shadow-sm`}>
                                {proj.leadAvatar}
                              </div>
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {proj.leadName}
                              </span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-gray-800 dark:text-gray-200">
                              {proj.location}
                            </div>
                            <div className="text-[10.5px] text-gray-400">
                              {proj.state}
                            </div>
                          </td>

                          {/* Property Details */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-gray-800 dark:text-gray-200">
                              {proj.sqft}
                            </div>
                            <div className="text-[10.5px] text-gray-400">
                              {proj.locality}
                            </div>
                          </td>

                          {/* Start Date */}
                          <td className="py-3.5 px-3 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                            {proj.startDate}
                          </td>

                          {/* Target Opening */}
                          <td className="py-3.5 px-3 text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap">
                            {proj.targetOpening}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {renderStatusBadge(proj.status)}
                          </td>

                          {/* Project Manager */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full ${proj.pmBg} text-white font-black text-[10.5px] flex items-center justify-center shrink-0 shadow-sm`}>
                                {proj.pmInitials}
                              </div>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {proj.projectManager}
                              </span>
                            </div>
                          </td>

                          {/* Actions: View Button & Three-dot menu */}
                          <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5 relative">
                              
                              <button 
                                onClick={() => {
                                  setSelectedProjectId(proj.id);
                                  setPanelOpen(true);
                                }}
                                className={`px-2.5 py-1 rounded-lg border text-[11.5px] font-bold transition-colors ${
                                  darkMode
                                    ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#2A374D]'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs'
                                }`}
                              >
                                View
                              </button>

                              {/* Three Dots Menu Button */}
                              <button 
                                onClick={() => setOpenActionDropdownId(openActionDropdownId === proj.id ? null : proj.id)}
                                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-[#253046] text-gray-500 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu Popup */}
                              {openActionDropdownId === proj.id && (
                                <div className={`absolute right-0 top-8 w-52 py-1.5 rounded-2xl border shadow-2xl z-40 text-left transition-all ${
                                  darkMode ? 'bg-[#172033] border-[#253046] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
                                }`}>
                                  <div className="px-3 py-1 text-[10px] font-extrabold text-[#C88A18] uppercase tracking-wider border-b border-gray-100 dark:border-[#253046]">
                                    Project Actions
                                  </div>
                                  <button 
                                    onClick={() => handleMenuAction('view', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium hover:bg-[#C88A18]/10 hover:text-[#C88A18] flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> View Project Details
                                  </button>
                                  <button 
                                    onClick={() => handleMenuAction('edit', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium hover:bg-[#C88A18]/10 hover:text-[#C88A18] flex items-center gap-2"
                                  >
                                    <Edit className="w-3.5 h-3.5" /> Edit Project Info
                                  </button>
                                  <button 
                                    onClick={() => handleMenuAction('assign_pm', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium hover:bg-[#C88A18]/10 hover:text-[#C88A18] flex items-center gap-2"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> Assign Project Manager
                                  </button>
                                  <button 
                                    onClick={() => handleMenuAction('view_plan', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium hover:bg-[#C88A18]/10 hover:text-[#C88A18] flex items-center gap-2"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> View Project Plan
                                  </button>
                                  <button 
                                    onClick={() => handleMenuAction('start_execution', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium hover:bg-[#C88A18]/10 hover:text-[#C88A18] flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-3.5 h-3.5 text-[#C88A18]" /> Start Execution
                                  </button>
                                  <div className="border-t border-gray-100 dark:border-[#253046] my-1" />
                                  <button 
                                    onClick={() => handleMenuAction('hold', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2"
                                  >
                                    <PauseCircle className="w-3.5 h-3.5" /> Put On Hold
                                  </button>
                                  <button 
                                    onClick={() => handleMenuAction('complete', proj)}
                                    className="w-full px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                                  </button>
                                </div>
                              )}

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            <div className={`p-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              darkMode ? 'border-[#253046] bg-[#111827]/40 text-gray-400' : 'border-gray-200 bg-gray-50/60 text-gray-600'
            }`}>
              
              {/* Left count text */}
              <div className="font-medium">
                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProjects.length ? 1 : 0} to {filteredProjects.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredProjects.length}</span> projects
              </div>

              {/* Right Pagination Buttons & Rows selector */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-1">
                  <button className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                    darkMode ? 'border-[#334155] text-gray-400 hover:bg-[#1E293B]' : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button className="w-7 h-7 rounded-lg bg-[#3B82C4] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    1
                  </button>

                  <button className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold transition-colors ${
                    darkMode ? 'border-[#334155] text-gray-400 hover:bg-[#1E293B]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}>
                    2
                  </button>

                  <button className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                    darkMode ? 'border-[#334155] text-gray-400 hover:bg-[#1E293B]' : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold ${
                      darkMode ? 'bg-[#1E293B] border-[#334155] text-gray-200' : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3. STICKY RIGHT PROJECT DETAILS PANEL */}
        {panelOpen && (
          <div className="lg:col-span-4 xl:col-span-4 sticky top-16 space-y-3 animate-fade-in">
            
            <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
              darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
            }`}>
              
              {/* PANEL TOP TABS HEADER */}
              <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-gray-100 dark:border-[#253046]">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pr-2">
                  {[
                    { id: 'details', label: 'Project Details' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'team', label: 'Team' },
                    { id: 'documents', label: 'Documents' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setRightPanelTab(tab.id)}
                      className={`text-xs font-bold pb-1 transition-all relative whitespace-nowrap ${
                        rightPanelTab === tab.id
                          ? 'text-[#C88A18] font-extrabold'
                          : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {rightPanelTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A18] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#253046] shrink-0"
                  title="Close Details Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PANEL TAB CONTENT AREA */}
              <div className="p-4 space-y-4">
                
                {/* TAB 1: PROJECT DETAILS */}
                {rightPanelTab === 'details' && (
                  <>
                    {/* Top Property Image & Status Pill */}
                    <div className="relative rounded-2xl overflow-hidden h-36 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <img 
                        src={selectedProject.photo} 
                        alt={selectedProject.projectName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                      
                      {/* Top Right Status Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        {renderStatusBadge(selectedProject.status)}
                      </div>

                      {/* Bottom Banner Title Overlay */}
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#F5E8C8]">
                          {selectedProject.sqft} • {selectedProject.locality}
                        </div>
                        <div className="text-base font-black leading-tight drop-shadow-md">
                          {selectedProject.projectName}
                        </div>
                      </div>
                    </div>

                    {/* Project Header Info + Edit Button */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                          {selectedProject.projectName}
                        </h3>
                        <div className="text-xs font-mono text-gray-400 mt-0.5 font-bold">
                          {selectedProject.projectId}
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition-colors ${
                          darkMode ? 'bg-[#1E293B] border-[#334155] text-gray-200 hover:bg-[#2A374D]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Edit className="w-3 h-3 text-[#C88A18]" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Location & Area Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                        darkMode ? 'bg-[#1E293B] border-[#334155] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}>
                        <MapPin className="w-3.5 h-3.5 text-[#C88A18]" />
                        <span className="font-semibold">{selectedProject.fullAddress}</span>
                      </div>

                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                        darkMode ? 'bg-[#1E293B] border-[#334155] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}>
                        <Building className="w-3.5 h-3.5 text-[#3B82C4]" />
                        <span className="font-semibold">{selectedProject.sqft}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-[#253046]" />

                    {/* Franchisee / Lead Section */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        Franchisee / Lead
                      </div>

                      <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                        darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                      }`}>
                        <div className={`w-10 h-10 rounded-full ${selectedProject.leadAvatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}>
                          {selectedProject.leadAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                            {selectedProject.leadName}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#C88A18]" /> {selectedProject.phone}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {selectedProject.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-[#253046]" />

                    {/* Agreement Details Section */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        Agreement Details
                      </div>

                      <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
                        darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-[#1F9D6A]" /> LOI Signed
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedProject.loiSignedDate || '15 Sep 2025'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#1F9D6A]" /> Lease Signed
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedProject.leaseSignedDate || '22 Sep 2025'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-[#253046]">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#3B82C4]" /> Agreement File
                          </span>
                          <button 
                            onClick={() => showToast(`Opening signed agreement document for ${selectedProject.projectName}...`)}
                            className="font-bold text-[#3B82C4] hover:underline flex items-center gap-1"
                          >
                            View Document <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-[#253046]" />

                    {/* Project Details Section */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        Project Details
                      </div>

                      <div className={`p-3 rounded-2xl border space-y-2.5 text-xs ${
                        darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C88A18]" /> Target Opening
                          </span>
                          <span className="font-black text-gray-900 dark:text-white">
                            {selectedProject.targetOpening}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-[#6C63C9]" /> Project Manager
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${selectedProject.pmBg} text-white font-black text-[9px] flex items-center justify-center`}>
                              {selectedProject.pmInitials}
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {selectedProject.projectManager}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#3B82C4]" /> Current Stage
                          </span>
                          <span className="font-bold text-[#3B82C4]">
                            {selectedProject.currentStage || 'Project Setup'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C88A18]" /> Next Milestone
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedProject.nextMilestone || 'Site Handover'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Two Action Buttons */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setIsPlanModalOpen(true)}
                        className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                          darkMode
                            ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#2A374D]'
                            : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        View Project Plan
                      </button>

                      <button 
                        onClick={() => setIsExecutionModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-[#C88A18] hover:bg-[#b07812] text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>Start Execution</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}

                {/* TAB 2: TIMELINE */}
                {rightPanelTab === 'timeline' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-gray-500">Project Execution Roadmap</div>
                    
                    <div className="relative pl-6 space-y-4 border-l-2 border-[#C88A18]/30">
                      {[
                        { title: 'Agreement Signed', date: selectedProject.leaseSignedDate || '22 Sep 2025', done: true },
                        { title: 'Project Created in PMS', date: '23 Sep 2025', done: true },
                        { title: `Project Manager Assigned (${selectedProject.projectManager})`, date: '24 Sep 2025', done: true },
                        { title: 'Department Planning & Layout', date: 'In Progress', active: true },
                        { title: 'Site Handover & Civil Execution', date: 'Pending', pending: true },
                        { title: 'Interior Fit-outs & Theme Setup', date: 'Pending', pending: true },
                        { title: 'Automation, Audio & Sensors', date: 'Pending', pending: true },
                        { title: 'Store Readiness & Launch', date: selectedProject.targetOpening, pending: true }
                      ].map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            item.done 
                              ? 'bg-[#1F9D6A] border-[#1F9D6A] text-white' 
                              : item.active 
                                ? 'bg-[#C88A18] border-white ring-2 ring-[#C88A18]/30 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          }`}>
                            {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>

                          <div className="text-xs font-extrabold text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className={`text-[10.5px] mt-0.5 font-medium ${
                            item.active ? 'text-[#C88A18] font-bold' : 'text-gray-400'
                          }`}>
                            {item.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TASKS */}
                {rightPanelTab === 'tasks' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">Department Tasks</span>
                      <span className="text-[#C88A18]">4 Active</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { dept: 'Construction', task: 'Civil layout & wall partitions', status: 'In Progress', assignee: selectedProject.projectManager, due: '15 Oct 2025' },
                        { dept: 'Interior', task: 'Escape theme prop installation', status: 'Pending', assignee: 'Design Team', due: '01 Nov 2025' },
                        { dept: 'Automation', task: 'Game mechanics & sensor setup', status: 'Pending', assignee: 'Tech Team', due: '15 Nov 2025' },
                        { dept: 'Marketing', task: 'Local launch campaign planning', status: 'Pending', assignee: 'Media Team', due: '01 Dec 2025' }
                      ].map((t, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border text-xs space-y-1 ${
                          darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#C88A18] text-[10.5px] uppercase">{t.dept}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white">{t.task}</div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                            <span>Assignee: {t.assignee}</span>
                            <span>Due: {t.due}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: TEAM */}
                {rightPanelTab === 'team' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-gray-500">Project Team Allocation</div>
                    
                    <div className="space-y-2">
                      {[
                        { name: selectedProject.projectManager, role: 'Project Manager', dept: 'Operations', initials: selectedProject.pmInitials, bg: selectedProject.pmBg },
                        { name: 'Kavita Sharma', role: 'Lead Interior Designer', dept: 'Design & Themes', initials: 'KS', bg: 'bg-[#6C63C9]' },
                        { name: 'Amit Verma', role: 'Automation Tech Lead', dept: 'Hardware & Sensors', initials: 'AV', bg: 'bg-[#1F9D6A]' },
                        { name: 'Sanjay Rastogi', role: 'Procurement Specialist', dept: 'Commercial', initials: 'SR', bg: 'bg-[#3B82C4]' }
                      ].map((m, idx) => (
                        <div key={idx} className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                          darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-full ${m.bg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                            {m.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-gray-900 dark:text-white">{m.name}</div>
                            <div className="text-[10.5px] text-gray-400">{m.role} • {m.dept}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: DOCUMENTS */}
                {rightPanelTab === 'documents' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-gray-500">Project Document Repository</div>

                    <div className="space-y-2">
                      {[
                        { name: 'LOI Agreement Signed.pdf', date: selectedProject.loiSignedDate || '15 Sep 2025', size: '1.4 MB' },
                        { name: 'Registered Lease Deed Final.pdf', date: selectedProject.leaseSignedDate || '22 Sep 2025', size: '3.8 MB' },
                        { name: 'Property Feasibility Report.pdf', date: '12 Sep 2025', size: '4.2 MB' },
                        { name: 'Architectural Layout & DWG.zip', date: '25 Sep 2025', size: '14.5 MB' }
                      ].map((doc, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          darkMode ? 'bg-[#111827]/40 border-[#253046]' : 'bg-gray-50/70 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-[#C88A18] shrink-0" />
                            <div className="truncate">
                              <div className="font-bold text-gray-900 dark:text-white truncate">{doc.name}</div>
                              <div className="text-[10px] text-gray-400">{doc.date} • {doc.size}</div>
                            </div>
                          </div>

                          <button 
                            onClick={() => showToast(`Downloading ${doc.name}...`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#C88A18] hover:bg-gray-100 dark:hover:bg-[#253046]"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* INTERACTIVE MODALS */}
      {/* ==================================================== */}

      {/* 1. VIEW PROJECT PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="p-4 border-b border-gray-100 dark:border-[#253046] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Project Plan — {selectedProject.projectName}</h3>
                <p className="text-xs text-gray-400">Project Code: {selectedProject.projectId}</p>
              </div>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl">
                  <div className="text-gray-400 text-[10.5px]">Total Floor Area</div>
                  <div className="text-sm font-extrabold text-[#C88A18]">{selectedProject.sqft}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl">
                  <div className="text-gray-400 text-[10.5px]">Game Escape Themes</div>
                  <div className="text-sm font-extrabold">4 Mystery Rooms</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl">
                  <div className="text-gray-400 text-[10.5px]">Est. Launch Target</div>
                  <div className="text-sm font-extrabold text-[#1F9D6A]">{selectedProject.targetOpening}</div>
                </div>
              </div>

              <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-2">
                <div className="font-bold text-[#C88A18] flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Execution Scope & Milestones
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Civil partition walls, reception counter & briefing area</li>
                  <li>4 mystery escape theme room fit-outs with sound dampening</li>
                  <li>Automated magnetic locks, micro-controller sensor triggers & CCTV</li>
                  <li>Branding storefront signage, neon lighting & lobby furniture</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-[#253046] flex justify-end gap-2">
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl border font-bold text-xs"
              >
                Close Plan
              </button>
              <button 
                onClick={() => {
                  setIsPlanModalOpen(false);
                  setIsExecutionModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#C88A18] text-white font-extrabold text-xs"
              >
                Proceed to Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. START EXECUTION MODAL */}
      {isExecutionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="p-4 border-b border-gray-100 dark:border-[#253046] flex items-center justify-between">
              <h3 className="text-base font-black">Confirm Execution Launch</h3>
              <button onClick={() => setIsExecutionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300">
                <div className="font-bold text-sm">Initiating Site Handover for {selectedProject.projectName}</div>
                <p className="mt-1 text-[11.5px]">This will notify the civil, design, and procurement teams to start site work on location.</p>
              </div>

              <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Assigned PM:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedProject.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Opening:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedProject.targetOpening}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-[#253046] flex justify-end gap-2">
              <button 
                onClick={() => setIsExecutionModalOpen(false)}
                className="px-4 py-2 rounded-xl border font-bold text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setProjectsList(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: 'In Progress', currentStage: 'Execution Started' } : p));
                  setIsExecutionModalOpen(false);
                  showToast(`Execution started for ${selectedProject.projectName}! Status updated to In Progress.`);
                }}
                className="px-4 py-2 rounded-xl bg-[#1F9D6A] text-white font-extrabold text-xs"
              >
                Start Site Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT PROJECT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="p-4 border-b border-gray-100 dark:border-[#253046] flex items-center justify-between">
              <h3 className="text-base font-black">Edit Project Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsEditModalOpen(false);
              showToast(`Project ${selectedProject.projectName} updated successfully!`);
            }} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Project Name</label>
                <input 
                  type="text" 
                  defaultValue={selectedProject.projectName}
                  className={`w-full p-2.5 rounded-xl border font-semibold ${
                    darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Target Opening Date</label>
                <input 
                  type="text" 
                  defaultValue={selectedProject.targetOpening}
                  className={`w-full p-2.5 rounded-xl border font-semibold ${
                    darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Project Manager</label>
                <select 
                  defaultValue={selectedProject.projectManager}
                  className={`w-full p-2.5 rounded-xl border font-semibold ${
                    darkMode ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="Rohit Kumar">Rohit Kumar</option>
                  <option value="Suresh Singh">Suresh Singh</option>
                  <option value="Alka Mishra">Alka Mishra</option>
                  <option value="Vivek Singh">Vivek Singh</option>
                  <option value="Neha Kapoor">Neha Kapoor</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C88A18] text-white font-extrabold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ASSIGN PM MODAL */}
      {isAssignPmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="p-4 border-b border-gray-100 dark:border-[#253046] flex items-center justify-between">
              <h3 className="text-base font-black">Assign Project Manager</h3>
              <button onClick={() => setIsAssignPmOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-gray-500">Select a Project Manager to lead {selectedProject.projectName}:</p>

              {['Rohit Kumar', 'Suresh Singh', 'Alka Mishra', 'Vivek Singh', 'Neha Kapoor'].map((pmName, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProjectsList(prev => prev.map(p => p.id === selectedProject.id ? { ...p, projectManager: pmName } : p));
                    setIsAssignPmOpen(false);
                    showToast(`Project Manager for ${selectedProject.projectName} set to ${pmName}`);
                  }}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors font-bold ${
                    selectedProject.projectManager === pmName
                      ? 'bg-[#C88A18]/10 border-[#C88A18] text-[#C88A18]'
                      : darkMode ? 'bg-[#1E293B] border-[#334155] hover:bg-[#2A374D]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{pmName}</span>
                  {selectedProject.projectManager === pmName && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
