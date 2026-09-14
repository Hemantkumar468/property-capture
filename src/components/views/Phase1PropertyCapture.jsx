import React, { useMemo, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Store, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  ArrowRight,
  Filter,
  Search,
  Download,
  ExternalLink,
  Info,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// initialSubmissions is the fully-shaped seed dataset (photos, personName,
// keyDetails, submittedOn, ...) this table's columns actually expect.
import { initialSubmissions } from '../../data/fmsData';
import { categoryOf, computeOpportunityCounts } from '../../utils/opportunities';

// Rows reach this table from several places (seed data, and the three New Lead
// pathways), each with its own field names. Everything is funnelled through
// toRow() so the table only ever reads one shape and never a missing field.
const STATUS_PILLS = {
  'new lead': 'bg-[#EBF3FF] text-[#2F6FE0]',
  captured: 'bg-[#EBF3FF] text-[#2F6FE0]',
  submitted: 'bg-[#EBF3FF] text-[#2F6FE0]',
  'multiple submitted': 'bg-[#FEF6E6] text-[#D9822B]',
  'no-property': 'bg-[#FEF6E6] text-[#D9822B]',
  'in research': 'bg-[#F2EDFD] text-[#6E42E5]',
  approved: 'bg-[#E6F6EC] text-[#12864C]',
  rejected: 'bg-[#FDECEC] text-[#E5484D]'
};

const statusPill = (status) =>
  STATUS_PILLS[String(status || '').toLowerCase()] || 'bg-gray-100 text-gray-600';

const joinParts = (...parts) => parts.filter(Boolean).join(', ');

const toRow = (item, category, index) => {
  const status = item.status || 'New Lead';
  const type =
    category === 'person'
      ? 'Interested Lead'
      : category === 'branch'
      ? 'Interested + Property'
      : 'Property Opportunity';

  return {
    ...item,
    id: item.id ?? `${category}-${index}`,
    category,
    type: item.type || type,
    personName:
      item.personName || item.name || item.submittedBy || item.contactPerson || 'Unnamed',
    contact: item.contact || item.phone || item.contactPerson || 'Not provided',
    details:
      item.details ||
      item.keyDetails ||
      item.propertyName ||
      joinParts(item.sqft && `${item.sqft} sq.ft`, item.rent, item.budget) ||
      'No details captured yet.',
    location: item.location || joinParts(item.locality, item.city) || 'Not specified',
    submittedOn: item.submittedOn || item.submittedDate || item.capturedDate || item.date || 'Just now',
    status,
    statusColor: item.statusColor || statusPill(status),
    photo: item.photo || null
  };
};

export default function Phase1PropertyCapture({ 
  currentSubTab, 
  setCurrentSubTab, 
  onOpenNewLeadModal,
  onOpenAssignResearch,
  onOpenPropertyDetail,
  onEditProperty,
  onUpdatePropertyStatus,
  copyEnquiryLink,
  copiedLink,
  darkMode,
  personLeads = [],
  properties = [],
  branches = []
}) {
  // Newly submitted leads live in App state, so derive the table from those
  // props plus the seed data instead of holding a stale local copy.
  const opportunities = useMemo(() => [
    ...personLeads.map((item, i) => toRow(item, 'person', i)),
    ...properties.map((item, i) => toRow(item, 'property', i)),
    ...branches.map((item, i) => toRow(item, 'branch', i)),
    ...initialSubmissions.map((item, i) => toRow(item, categoryOf(item), i))
  ], [personLeads, properties, branches]);

  // Real counts per category, so the tab badges (and the stepper's summary
  // cards, which call the same helper) never drift from the actual data.
  const counts = useMemo(
    () => computeOpportunityCounts(personLeads, properties, branches),
    [personLeads, properties, branches]
  );
  // The sub-tab is lifted to App so the sidebar's Property Capture submenu
  // and this toolbar always agree on which slice is showing.
  const activeTab = currentSubTab || 'all'; // all, person, branch, property
  const setActiveTab = setCurrentSubTab || (() => {});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter opportunities based on active tab and search query
  const filteredOpps = opportunities.filter((opp) => {
    if (activeTab === 'person' && opp.category !== 'person') return false;
    if (activeTab === 'branch' && opp.category !== 'branch') return false;
    if (activeTab === 'property' && opp.category !== 'property') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return [opp.personName, opp.location, opp.details, opp.status]
        .some((field) => String(field || '').toLowerCase().includes(q));
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredOpps.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredOpps.map(o => o.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="animate-fade-in space-y-3">
      
      {/* FILTER & SUB-TABS TOOLBAR BAR (COMPACT PADDING & GAPS) */}
      <div className={`p-1.5 px-3 bg-white dark:bg-[#171722] rounded-2xl border shadow-sm transition-colors ${darkMode ? 'border-[#2D2D3F]' : 'border-[#E4E7EB]'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 p-1">
          
          {/* Left Sub-Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#FBF6ED] text-[#C99029] border-b-2 border-[#C99029] shadow-sm'
                  : 'text-gray-600 dark:text-[#8B8CA0] hover:bg-gray-100 dark:hover:bg-[#232333]'
              }`}
            >
              <span>All Opportunities</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10.5px] bg-[#C99029]/15 text-[#C99029] font-extrabold">{counts.all}</span>
            </button>

            <button
              onClick={() => setActiveTab('person')}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'person'
                  ? 'bg-[#F2EDFD] text-[#6E42E5] border-b-2 border-[#6E42E5] shadow-sm'
                  : 'text-gray-600 dark:text-[#8B8CA0] hover:bg-gray-100 dark:hover:bg-[#232333]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#6E42E5]" />
              <span>Interested Leads</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10.5px] bg-[#6E42E5]/15 text-[#6E42E5] font-bold">{counts.person}</span>
            </button>

            <button
              onClick={() => setActiveTab('branch')}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'branch'
                  ? 'bg-[#FEF6E6] text-[#D9822B] border-b-2 border-[#D9822B] shadow-sm'
                  : 'text-gray-600 dark:text-[#8B8CA0] hover:bg-gray-100 dark:hover:bg-[#232333]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#D9822B]" />
              <span>Interested + Property</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10.5px] bg-[#D9822B]/15 text-[#D9822B] font-bold">{counts.branch}</span>
            </button>

            <button
              onClick={() => setActiveTab('property')}
              className={`px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'property'
                  ? 'bg-[#EBF3FF] text-[#2F6FE0] border-b-2 border-[#2F6FE0] shadow-sm'
                  : 'text-gray-600 dark:text-[#8B8CA0] hover:bg-gray-100 dark:hover:bg-[#232333]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#2F6FE0]" />
              <span>Property Opportunities</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10.5px] bg-[#2F6FE0]/15 text-[#2F6FE0] font-bold">{counts.property}</span>
            </button>
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-3 py-1.5 rounded-xl border text-[11.5px] font-semibold flex items-center gap-1.5 border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] transition-colors">
              <Filter className="w-3.5 h-3.5 text-gray-500 dark:text-[#8B8CA0]" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 rounded-xl border text-[11.5px] bg-gray-50 dark:bg-[#232333] border-gray-200 dark:border-[#2D2D3F] focus:outline-none focus:border-[#C99029] w-32 sm:w-44 transition-all"
              />
            </div>

            <button className="px-3 py-1.5 rounded-xl border text-[11.5px] font-semibold flex items-center gap-1.5 border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] transition-colors">
              <Download className="w-3.5 h-3.5 text-gray-500 dark:text-[#8B8CA0]" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

        </div>
      </div>

      {/* MAIN DATA TABLE (COMPACT ROW HEIGHT & CELL PADDING) */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${darkMode ? 'bg-[#171722] border-[#2D2D3F]' : 'bg-white border-[#E4E7EB]'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10.5px] font-bold text-gray-500 dark:text-[#8B8CA0] uppercase tracking-wider ${
                darkMode ? 'border-[#2D2D3F] bg-[#1E1E2D]' : 'border-[#E4E7EB] bg-[#FAFAFC]'
              }`}>
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredOpps.length && filteredOpps.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#C99029] focus:ring-[#C99029]"
                  />
                </th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Person / Property</th>
                <th className="py-2.5 px-3">Key Details</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Submitted On</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2D2D3F]">
              {filteredOpps.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                const submittedParts = String(row.submittedOn || '').trim().split(/\s+/).filter(Boolean);
                const submittedDate = submittedParts.slice(0, 3).join(' ') || '—';
                const submittedTime = submittedParts.slice(3).join(' ');
                return (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50/70 dark:hover:bg-[#232333]/50 transition-colors ${
                      isSelected ? 'bg-amber-50/40 dark:bg-[#C99029]/10' : ''
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                        className="rounded border-gray-300 text-[#C99029] focus:ring-[#C99029]"
                      />
                    </td>

                    {/* 2. Type Pill */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {row.type === 'Interested Lead' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F2EDFD] text-[#6E42E5]">
                          <User className="w-3 h-3 text-[#6E42E5]" />
                          <span>Interested Lead</span>
                        </span>
                      )}
                      {row.type === 'Interested + Property' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF6E6] text-[#D9822B]">
                          <Building2 className="w-3 h-3 text-[#D9822B]" />
                          <span>Interested + Property</span>
                        </span>
                      )}
                      {row.type === 'Property Opportunity' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF3FF] text-[#2F6FE0]">
                          <Store className="w-3 h-3 text-[#2F6FE0]" />
                          <span>Property Opportunity</span>
                        </span>
                      )}
                    </td>

                    {/* 3. Person / Property */}
                    <td className="py-2.5 px-3 min-w-[180px]">
                      <div className="flex items-center gap-2.5">
                        {row.photo ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-[#2D2D3F] shadow-sm">
                            <img src={row.photo} alt={row.personName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-[#232333] text-indigo-600 dark:text-[#C99029] font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-100 dark:border-[#2D2D3F]">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[12.5px] text-gray-900 dark:text-white leading-tight">
                            {row.personName}
                          </div>
                          <div className="text-[10.5px] text-gray-500 dark:text-[#8B8CA0] font-mono mt-0.5">
                            📞 {row.contact}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 4. Key Details */}
                    <td className="py-2.5 px-3 max-w-[300px]">
                      <div className="text-[11.5px] text-gray-700 dark:text-[#C5C8D6] font-medium leading-relaxed">
                        {row.details}
                      </div>
                    </td>

                    {/* 5. Location */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11.5px] font-bold text-gray-800 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 text-[#2F6FE0]" />
                        <span>{row.location}</span>
                      </div>
                    </td>

                    {/* 6. Submitted On */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-gray-500 dark:text-[#8B8CA0]">
                      <div>{submittedDate}</div>
                      {submittedTime && <div className="text-[10px] text-gray-400">{submittedTime}</div>}
                    </td>

                    {/* 7. Status Pill */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${row.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{row.status}</span>
                      </span>
                    </td>

                    {/* 8. Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => onOpenPropertyDetail(row)}
                          className="px-3 py-1 rounded-xl border text-[11.5px] font-bold border-gray-200 dark:border-[#2D2D3F] hover:bg-gray-50 dark:hover:bg-[#232333] transition-colors shadow-sm"
                        >
                          View
                        </button>
                        <button className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER & PAGINATION (COMPACT PADDING) */}
        <div className={`px-4 py-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] ${
          darkMode ? 'border-[#2D2D3F] bg-[#171722] text-[#8B8CA0]' : 'border-[#E4E7EB] bg-gray-50/50 text-gray-500'
        }`}>
          <div>
            Showing <b className="text-gray-900 dark:text-white">{filteredOpps.length ? 1 : 0}</b> to <b className="text-gray-900 dark:text-white">{filteredOpps.length}</b> of <b className="text-gray-900 dark:text-white">{filteredOpps.length}</b> opportunities
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#2F6FE0] text-white font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                3
              </button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                4
              </button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                5
              </button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#2D2D3F] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#232333]">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <select className="px-2 py-1 rounded-lg border border-gray-200 dark:border-[#2D2D3F] bg-white dark:bg-[#232333] text-[11px] font-semibold focus:outline-none">
              <option>10 / page</option>
              <option>25 / page</option>
              <option>50 / page</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
