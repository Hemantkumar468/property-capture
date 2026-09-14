import React from 'react';
import {
  Compass,
  MapPin,
  CheckCircle,
  Search,
  FileCheck,
  FileSignature,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Settings,
  LogOut,
  X,
  Check,
  Folder,
  PlusCircle,
  Clock,
  PauseCircle,
  CheckCircle2,
  XCircle,
  Layers,
  User,
  Building2,
  Store
} from 'lucide-react';

export default function Sidebar({
  activePhase,
  setActivePhase,
  selectedSubFilter,
  setSelectedSubFilter,
  currentSubTab,
  setCurrentSubTab,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  const phases = [
    { num: '01', id: 1, label: 'Property Capture', icon: MapPin },
    { num: '02', id: 2, label: 'Review & Decision', icon: CheckCircle },
    { num: '03', id: 3, label: 'Property Research', icon: Search },
    { num: '04', id: 4, label: 'Assessment', icon: FileCheck },
    { num: '05', id: 5, label: 'LOI & Commercial', icon: FileSignature },
    { num: '06', id: 6, label: 'Project Creation', icon: FolderPlus },
  ];

  const projectSubFilters = [
    { id: 'all_projects', label: 'All Projects', icon: Folder },
    { id: 'new_project', label: 'New Project', icon: PlusCircle },
    { id: 'in_progress', label: 'In Progress', icon: Clock },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'closed', label: 'Closed', icon: XCircle }
  ];

  // Mirrors the sub-tabs on the Property Capture table so the sidebar and
  // the page toolbar always point at the same slice of opportunities.
  const propertyCaptureSubFilters = [
    { id: 'all', label: 'All Opportunities', icon: Layers },
    { id: 'person', label: 'Interested Leads', icon: User },
    { id: 'branch', label: 'Interested + Property', icon: Building2 },
    { id: 'property', label: 'Property Opportunities', icon: Store }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside className={`w-[220px] shrink-0 bg-[#111827] text-[#9CA3AF] flex flex-col fixed md:sticky top-0 h-screen z-40 select-none border-r border-[#1F2937] transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* BRAND HEADER */}
        <div className="flex items-center justify-between p-3.5 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C99029] to-[#8f6a1c] flex items-center justify-center font-black text-black text-xs shadow-md shrink-0 border border-[#C88A18]/40">
              MR
            </div>
            <div>
              <div className="font-bold text-white text-[13px] tracking-tight leading-tight">
                Mystery Rooms
              </div>
              <div className="text-[10px] text-[#6B7280] leading-tight font-medium">
                Enterprise Console
              </div>
            </div>
          </div>

          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROPERTY FMS SECTION */}
        <div className="flex-1 overflow-y-auto p-2.5 sidebar-scroll space-y-0.5">
          <div className="pt-1.5 pb-1 px-2">
            <span className="text-[9.5px] font-bold text-[#6B7280] tracking-wider uppercase">
              PROPERTY FMS
            </span>
          </div>

          {/* ACTIVE ITEM OVERVIEW */}
          <div 
            onClick={() => {
              setActivePhase('overview');
              if (window.innerWidth < 768) setMobileSidebarOpen(false);
            }}
            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-[12px] font-bold transition-all ${
              activePhase === 'overview'
                ? 'bg-gradient-to-r from-[#2E2211] via-[#231A0D] to-[#1A1309] text-white border border-[#C88A18]/50 shadow-[0_2px_12px_rgba(200,138,24,0.25)]'
                : 'text-[#9CA3AF] hover:bg-[#172033] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className={`w-4 h-4 ${activePhase === 'overview' ? 'text-[#C88A18]' : 'text-[#6B7280]'}`} />
              <span className={activePhase === 'overview' ? 'text-white' : 'text-[#9CA3AF]'}>Dashboard</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activePhase === 'overview' ? 'text-[#C88A18]' : 'text-[#4B5563]'}`} />
          </div>

          {/* WORKFLOW MENU ITEMS */}
          {phases.map((p) => {
            const isActive = activePhase === p.id;
            const Icon = p.icon;

            return (
              <div key={p.id} className="my-0.5">
                <div
                  onClick={() => {
                    setActivePhase(p.id);
                    if (window.innerWidth < 768) setMobileSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[12px] font-semibold ${
                    isActive
                      ? 'bg-[#C88A18] text-white shadow-[0_2px_10px_rgba(200,138,24,0.3)]'
                      : 'text-[#9CA3AF] hover:bg-[#172033] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                    <span>{p.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <ChevronDown className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#4B5563]" />
                    )}
                  </div>
                </div>

                {/* NESTED MENU UNDER ACTIVE PROPERTY CAPTURE */}
                {isActive && p.id === 1 && (
                  <div className="ml-3.5 pl-2.5 border-l border-[#1F2937] mt-1 space-y-0.5 py-1">
                    {propertyCaptureSubFilters.map((sub) => {
                      const isSubSelected = (currentSubTab || 'all') === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => {
                            if (setCurrentSubTab) setCurrentSubTab(sub.id);
                            if (window.innerWidth < 768) setMobileSidebarOpen(false);
                          }}
                          className={`text-[11px] p-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
                            isSubSelected
                              ? 'bg-[#172033] text-[#F5E8C8] font-bold border-l-2 border-[#C99029] pl-2'
                              : 'text-[#9CA3AF] hover:text-white hover:bg-[#172033]/60'
                          }`}
                        >
                          <SubIcon className={`w-3.5 h-3.5 ${isSubSelected ? 'text-[#C99029]' : 'text-[#6B7280]'}`} />
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* NESTED MENU UNDER ACTIVE PROJECT CREATION */}
                {isActive && p.id === 6 && (
                  <div className="ml-3.5 pl-2.5 border-l border-[#1F2937] mt-1 space-y-0.5 py-1">
                    {projectSubFilters.map((sub) => {
                      const isSubSelected = (selectedSubFilter || 'all_projects') === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => {
                            if (setSelectedSubFilter) setSelectedSubFilter(sub.id);
                            if (window.innerWidth < 768) setMobileSidebarOpen(false);
                          }}
                          className={`text-[11px] p-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
                            isSubSelected
                              ? 'bg-[#172033] text-[#F5E8C8] font-bold border-l-2 border-[#C99029] pl-2'
                              : 'text-[#9CA3AF] hover:text-white hover:bg-[#172033]/60'
                          }`}
                        >
                          <SubIcon className={`w-3.5 h-3.5 ${isSubSelected ? 'text-[#C99029]' : 'text-[#6B7280]'}`} />
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}


        </div>


      </aside>
    </>
  );
}
