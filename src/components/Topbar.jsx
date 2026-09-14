import React from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu,
  ChevronDown
} from 'lucide-react';

export default function Topbar({ 
  darkMode, 
  setDarkMode,
  onOpenNewLeadModal,
  unreadNotifsCount,
  onOpenNotifs,
  setMobileSidebarOpen
}) {
  return (
    <div className={`border-b px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 transition-colors shadow-sm ${
      darkMode ? 'bg-[#111827] border-[#1F2937] text-white' : 'bg-white border-[#E2E8F0] text-[#1F2A44]'
    }`}>
      {/* Search Input Bar with Ctrl+K shortcut & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl border border-gray-200 dark:border-[#2D2D3F] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#232333] shrink-0"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input 
            type="text"
            placeholder="Search by name, property, location, project..."
            className={`w-full pl-9 pr-16 py-2 rounded-xl border text-xs font-medium transition-all ${
              darkMode 
                ? 'bg-[#1E293B] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#C88A18]' 
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1F2A44] placeholder:text-[#94A3B8] focus:border-[#C88A18] focus:bg-white'
            }`}
          />
          <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#475569]">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right User Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
            darkMode ? 'bg-[#1E293B] border-[#334155] text-[#C88A18]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifs}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center relative transition-colors ${
            darkMode ? 'bg-[#1E293B] border-[#334155] text-[#94A3B8]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
          }`}
        >
          <Bell className="w-4 h-4 text-[#D9911E]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E5484D] text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#111827]">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-[#E2E8F0] dark:bg-[#334155] mx-1" />

        {/* User Profile Block */}
        <div className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
            HK
          </div>
          <div className="hidden md:block">
            <div className={`text-[12px] font-bold leading-tight ${darkMode ? 'text-white' : 'text-[#1F2A44]'}`}>
              Hemant Kushwaha
            </div>
            <div className={`text-[10px] leading-tight mt-0.5 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Project Developer
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden md:block" />
        </div>
      </div>
    </div>
  );
}
