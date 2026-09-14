import React, { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import WorkflowStepper from './components/WorkflowStepper';
import Toast from './components/Toast';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Database,
  ShoppingBag,
  Compass
} from 'lucide-react';


import Phase1PropertyCapture from './components/views/Phase1PropertyCapture';
import Phase2ReviewDecision from './components/views/Phase2ReviewDecision';
import Phase3PropertyResearch from './components/views/Phase3PropertyResearch';
import Phase4Assessment from './components/views/Phase4Assessment';
import Phase5LOICommercial from './components/views/Phase5LOICommercial';
import Phase6ProjectCreation from './components/views/Phase6ProjectCreation';
import OverviewDashboard from './components/views/OverviewDashboard';

import NewLeadModal from './components/modals/NewLeadModal';
import AssignResearchModal from './components/modals/AssignResearchModal';
import PropertyDetailModal from './components/modals/PropertyDetailModal';
import EditPropertyModal from './components/modals/EditPropertyModal';

import {
  initialProperties,
  initialPersonLeads,
  initialBranches,
  initialAssessments
} from './data/fmsData';
import { computeOpportunityCounts } from './utils/opportunities';

// Single source of truth for the public submission link, so the text shown
// on the Share Submission Link card always matches what actually gets copied.
const ENQUIRY_LINK_URL = 'https://mysteryrooms.com/property-capture/apply';

export default function App() {
  const [activePhase, setActivePhase] = useState('overview');
  const [currentSubTab, setCurrentSubTab] = useState('all'); // Phase 1 sub-tab: all, person, branch, property
  const [selectedSubFilter, setSelectedSubFilter] = useState('all_deals');
  const [darkMode, setDarkMode] = useState(false);

  // App Data State
  const [properties, setProperties] = useState(initialProperties);
  const [personLeads, setPersonLeads] = useState(initialPersonLeads);
  const [branches, setBranches] = useState(initialBranches);
  const [assessments, setAssessments] = useState(initialAssessments);

  // Same helper Phase1PropertyCapture uses for its tab badges, so the
  // stepper's summary cards can never disagree with the table underneath it.
  const opportunityCounts = useMemo(
    () => computeOpportunityCounts(personLeads, properties, branches),
    [personLeads, properties, branches]
  );

  // Modals state
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isAssignResearchOpen, setIsAssignResearchOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] = useState(null);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(3);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 2500);
  };

  const copyEnquiryLink = () => {
    const url = ENQUIRY_LINK_URL;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedLink(true);
    showToast('Enquiry link copied to clipboard!');
    setTimeout(() => {
      setCopiedLink(false);
    }, 2200);
  };

  const handleCreateLead = (category, data) => {
    if (category === 'person') {
      setPersonLeads(prev => [data, ...prev]);
    } else if (category === 'property') {
      setProperties(prev => [data, ...prev]);
    } else if (category === 'branch') {
      setBranches(prev => [data, ...prev]);
    }
  };

  const handleAssignResearch = (personId, updateData) => {
    setPersonLeads(prev => prev.map(p => {
      if (p.id === personId) {
        return { ...p, ...updateData };
      }
      return p;
    }));
  };

  const handleSaveProperty = (propId, updatedData) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        return { ...p, ...updatedData };
      }
      return p;
    }));
  };

  const handleUpdatePropertyStatus = (propId, newStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className={`min-h-screen flex transition-colors ${darkMode ? 'bg-[#0F1423] text-white' : 'bg-[#F5F7FB] text-[#1F2937]'}`}>

      {/* LEFT SIDEBAR */}
      <Sidebar
        activePhase={activePhase}
        setActivePhase={setActivePhase}
        selectedSubFilter={selectedSubFilter}
        setSelectedSubFilter={setSelectedSubFilter}
        currentSubTab={currentSubTab}
        setCurrentSubTab={setCurrentSubTab}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* MAIN APPLICATION AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* TOP HEADER */}
        <Topbar
          activePhase={activePhase}
          setActivePhase={setActivePhase}
          currentSubTab={currentSubTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
          unreadNotifsCount={unreadNotifsCount}
          onOpenNotifs={() => {
            setUnreadNotifsCount(0);
            showToast('Notifications marked as read');
          }}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* CONTENT AREA */}
        <main className="flex-1 p-3.5 sm:p-4 md:p-5 w-full space-y-3.5 cq-main-container">

          {activePhase === 'overview' && (
            <OverviewDashboard
              setActivePhase={setActivePhase}
              personLeads={personLeads}
              properties={properties}
              branches={branches}
              onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
              onOpenPropertyDetail={(prop) => {
                setSelectedProperty(prop);
                setIsPropertyDetailOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {(activePhase !== 'overview' && activePhase !== 'dashboard' && activePhase !== 'pms' && activePhase !== 'employees' && activePhase !== 'master_data' && activePhase !== 'purchase') && (
            <WorkflowStepper
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              darkMode={darkMode}
              currentSubTab={currentSubTab}
              setCurrentSubTab={setCurrentSubTab}
              copyEnquiryLink={copyEnquiryLink}
              copiedLink={copiedLink}
              enquiryLinkUrl={ENQUIRY_LINK_URL}
              opportunityCounts={opportunityCounts}
              personLeads={personLeads}
              properties={properties}
              branches={branches}
            />
          )}

          {/* DYNAMIC PHASE VIEWS */}
          {activePhase === 1 && (
            <Phase1PropertyCapture
              currentSubTab={currentSubTab}
              setCurrentSubTab={setCurrentSubTab}
              properties={properties}
              personLeads={personLeads}
              branches={branches}
              onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
              onOpenAssignResearch={(person) => {
                setSelectedPerson(person);
                setIsAssignResearchOpen(true);
              }}
              onOpenPropertyDetail={(prop) => {
                setSelectedProperty(prop);
                setIsPropertyDetailOpen(true);
              }}
              onEditProperty={(prop) => {
                setSelectedPropertyForEdit(prop);
                setIsEditPropertyOpen(true);
              }}
              onUpdatePropertyStatus={handleUpdatePropertyStatus}
              copyEnquiryLink={copyEnquiryLink}
              copiedLink={copiedLink}
              darkMode={darkMode}
            />
          )}

          {activePhase === 2 && (
            <Phase2ReviewDecision
              setActivePhase={setActivePhase}
              showToast={showToast}
              darkMode={darkMode}
            />
          )}

          {activePhase === 3 && (
            <Phase3PropertyResearch
              setActivePhase={setActivePhase}
              showToast={showToast}
              darkMode={darkMode}
            />
          )}

          {activePhase === 4 && (
            <Phase4Assessment
              setActivePhase={setActivePhase}
              showToast={showToast}
              darkMode={darkMode}
            />
          )}

          {activePhase === 5 && (
            <Phase5LOICommercial
              setActivePhase={setActivePhase}
              showToast={showToast}
              darkMode={darkMode}
            />
          )}

          {activePhase === 6 && (
            <Phase6ProjectCreation
              showToast={showToast}
              darkMode={darkMode}
            />
          )}

          {/* DYNAMIC NAV SECTION VIEWS */}
          {activePhase === 'dashboard' && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-[#C88A18]" />
                    Executive Dashboard & Analytics
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">High-level enterprise performance metrics and active operations summary.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C88A18]/10 text-[#C88A18] border border-[#C88A18]/30">Active Console</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-1">
                  <div className="text-gray-500 font-semibold">Total Active Franchise Enquiries</div>
                  <div className="text-2xl font-black text-[#C88A18]">48 Leads</div>
                  <div className="text-[11px] text-emerald-500 font-bold">↑ +14% this month</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-1">
                  <div className="text-gray-500 font-semibold">Properties Under Feasibility Check</div>
                  <div className="text-2xl font-black text-[#3B82C4]">12 Sites</div>
                  <div className="text-[11px] text-blue-400 font-bold">Phase 3 & Phase 4</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-1">
                  <div className="text-gray-500 font-semibold">Store Openings Targeted (Q4)</div>
                  <div className="text-2xl font-black text-[#1F9D6A]">6 New Branches</div>
                  <div className="text-[11px] text-emerald-500 font-bold">On Schedule</div>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'pms' && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-[#C88A18]" />
                    Project Management System (PMS)
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Track site execution, civil fit-outs, game automation, and launch readiness.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30">12 Active Projects</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">Active Execution Pipeline:</p>
                <p className="mt-1">All approved properties are synchronized with Phase 6 (Project Creation). Click <button onClick={() => setActivePhase(6)} className="text-[#C88A18] font-bold underline cursor-pointer">Phase 06: Project Creation</button> to manage detailed project timelines and team assignments.</p>
              </div>
            </div>
          )}

          {activePhase === 'employees' && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#C88A18]" />
                    Employee & Team Directory
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage project managers, site researchers, legal advisors, and department leads.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5484D] text-white font-bold flex items-center justify-center">RK</div>
                  <div>
                    <div className="font-bold">Rohit Kumar</div>
                    <div className="text-[11px] text-gray-500">Senior Project Manager</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B82C4] text-white font-bold flex items-center justify-center">SS</div>
                  <div>
                    <div className="font-bold">Suresh Singh</div>
                    <div className="text-[11px] text-gray-500">Property Research Lead</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6C63C9] text-white font-bold flex items-center justify-center">AM</div>
                  <div>
                    <div className="font-bold">Alka Mishra</div>
                    <div className="text-[11px] text-gray-500">Commercial & Legal Officer</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'master_data' && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#C88A18]" />
                    Master Data & System Catalogs
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Core master configuration for cities, property types, lease templates, and SLAs.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-center font-bold">Target Cities (18)</div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-center font-bold">Property Categories (6)</div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-center font-bold">Lease Terms Templates (4)</div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-center font-bold">Vendor Rates Index</div>
              </div>
            </div>
          )}

          {activePhase === 'purchase' && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#172033] border-[#253046] text-white' : 'bg-white border-[#E2E8F0] text-gray-900'}`}>
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#C88A18]" />
                    Purchase & Procurement Console
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Procurement requests for escape theme props, electronics, HVAC, and civil materials.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                Material requisitions for active store fit-outs are synced with PMS.
              </div>
            </div>
          )}



        </main>
      </div>

      {/* MODALS & TOAST */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSubmitLead={handleCreateLead}
        showToast={showToast}
      />

      <AssignResearchModal
        isOpen={isAssignResearchOpen}
        onClose={() => {
          setIsAssignResearchOpen(false);
          setSelectedPerson(null);
        }}
        person={selectedPerson}
        onAssignResearch={handleAssignResearch}
        showToast={showToast}
      />

      <PropertyDetailModal
        isOpen={isPropertyDetailOpen}
        onClose={() => {
          setIsPropertyDetailOpen(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        onUpdateStatus={handleUpdatePropertyStatus}
        onEditProperty={(prop) => {
          setSelectedPropertyForEdit(prop);
          setIsEditPropertyOpen(true);
        }}
        showToast={showToast}
      />

      <EditPropertyModal
        isOpen={isEditPropertyOpen}
        onClose={() => {
          setIsEditPropertyOpen(false);
          setSelectedPropertyForEdit(null);
        }}
        property={selectedPropertyForEdit}
        onSaveProperty={handleSaveProperty}
        showToast={showToast}
      />

      <Toast toastMsg={toastMsg} />
    </div>
  );
}
