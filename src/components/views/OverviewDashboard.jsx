import React, { useState } from 'react';
import {
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  ChevronDown,
  Clock3,
  FileText,
  Gavel,
  Handshake,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Wallet,
  Rocket,
  BriefcaseBusiness,
  MoreHorizontal,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  FileCheck,
  DollarSign,
  PieChart
} from 'lucide-react';

import FunnelStatsRow from '../FunnelStatsRow';
import { buildFunnelStats } from '../../utils/funnelStats';
import { computeOpportunityCounts } from '../../utils/opportunities';
import { computeProjectCounts } from '../../utils/projects';
import { initialProjectsData } from '../../data/fmsData';

// ==========================================
// 1. REUSABLE COMPONENT: StatusBadge
// ==========================================
export function StatusBadge({ status }) {
  const styles = {
    'In Progress': 'bg-[#E8F1FC] text-[#2563C9] border border-[#2563C9]/20',
    Negotiation: 'bg-[#FFF3D6] text-[#D9911E] border border-[#D9911E]/20',
    Pending: 'bg-[#FFF3D6] text-[#D9911E] border border-[#D9911E]/20',
    'Need Info': 'bg-[#FDEBEC] text-[#E5484D] border border-[#E5484D]/20',
    'On Track': 'bg-[#E3F5EC] text-[#16805C] border border-[#16805C]/20',
    Delayed: 'bg-[#FDEBEC] text-[#E5484D] border border-[#E5484D]/20',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold whitespace-nowrap ${styles[status] || 'bg-[#E8F1FC] text-[#2563C9]'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {status}
    </span>
  );
}

// ==========================================
// 2. REUSABLE COMPONENT: OverviewHero
// ==========================================
export function OverviewHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT BRANDING */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C88A18]/40 bg-[#FFF4D6] text-[#C88A18] shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-[#1F2A44]">
              Property FMS Overview
            </h1>
            <p className="mt-0.5 text-[12px] font-medium text-[#64748B]">
              Complete visibility from opportunity to project creation.
            </p>
          </div>
        </div>

        {/* CENTER QUOTE BOX */}
        <div className="hidden flex-1 items-center justify-center xl:flex">
          <div className="flex items-center gap-3 rounded-xl border border-[#F3DCA0] bg-[#FFF9EE] px-4 py-2.5 shadow-sm">
            <div className="h-9 w-[3px] rounded-full bg-[#C88A18] shrink-0" />
            <div className="text-[12px] font-bold italic leading-snug text-[#1F2A44] whitespace-nowrap">
              "Better spaces. Brighter experiences. Bigger tomorrows."
            </div>
          </div>
        </div>

        {/* RIGHT BUILDING BANNER */}
        <div className="relative h-[85px] w-full overflow-hidden rounded-xl border border-[#E2E8F0] xl:w-[310px] shrink-0">
          <img
            src="/mystery_rooms_banner.jpg"
            alt="Mystery Rooms Building"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/75 via-[#0F172A]/40 to-[#0F172A]/70" />
          <div className="absolute bottom-2 left-2 right-2 rounded-lg border border-white/20 bg-[#111827]/85 p-2 text-left text-[10.5px] font-bold leading-tight text-white shadow-lg backdrop-blur-md truncate">
            Turning opportunities into extraordinary experiences.
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. REUSABLE COMPONENT: PropertyPipeline & PipelineStep
// ==========================================
export function PropertyPipeline({ setActivePhase, personLeads, properties, branches }) {
  // Same numbers as the funnel row above, from the same helpers each phase
  // page uses — the pipeline can't disagree with the stats sitting over it.
  const funnel = buildFunnelStats({ personLeads, properties, branches });
  const byPhase = (n) => funnel.find((f) => f.phase === n)?.value ?? 0;
  const projects = computeProjectCounts(initialProjectsData);

  const steps = [
    { id: 1, label: 'Property Capture', value: byPhase(1), subtitle: 'Leads & properties', done: true },
    { id: 2, label: 'Review & Decision', value: byPhase(2), subtitle: 'MD reviews', active: true },
    { id: 3, label: 'Property Research', value: byPhase(3), subtitle: 'Find locations' },
    { id: 4, label: 'Assessment', value: byPhase(4), subtitle: 'Feasibility checks' },
    { id: 5, label: 'LOI & Commercial', value: byPhase(5), subtitle: 'Negotiation' },
    { id: 6, label: 'Project Creation', value: byPhase(6), subtitle: 'Launch in PMS' },
    { id: 7, label: 'PMS Launch', value: projects.inProgress + projects.completed, subtitle: 'Ready / Active', isFinal: true },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44] flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#C88A18]" />
            Property Pipeline
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Track opportunities across all stages
          </p>
        </div>
      </div>

      {/* overflow-x-auto makes overflow-y compute as `auto`, so this box clips
          vertically — the active node's ring/glow needs the vertical padding
          or its top gets sliced off. */}
      <div className="mt-3 overflow-x-auto py-3 sidebar-scroll">
        <div className="flex min-w-[920px] items-center justify-between px-2">
          {steps.map((step, idx) => {
            return (
              <React.Fragment key={step.id}>
                {/* PIPELINE NODE */}
                <div
                  onClick={() => setActivePhase && step.id <= 6 && setActivePhase(step.id)}
                  className="group flex flex-col items-center cursor-pointer min-w-[115px] transition-transform hover:scale-105"
                >
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-[12.5px] font-black transition-all ${
                      step.done
                        ? 'bg-[#C88A18] text-white border-[#F4E1B5] shadow-[0_2px_10px_rgba(200,138,24,0.3)]'
                        : step.active
                          ? 'bg-[#C88A18] text-white border-[#F4E1B5] shadow-[0_0_15px_rgba(200,138,24,0.4)] ring-4 ring-[#C88A18]/20'
                          : step.isFinal
                            ? 'border-[#C88A18] bg-[#FFF4D6] text-[#C88A18] shadow-[0_0_0_4px_rgba(200,138,24,0.2)]'
                            : 'bg-gray-100 border-gray-300 text-gray-500 group-hover:border-[#C88A18]'
                    }`}
                  >
                    {step.done ? (
                      <Check className="h-4.5 w-4.5 stroke-[3]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  <div className="mt-2.5 text-center">
                    <div className={`text-[11.5px] font-bold group-hover:text-[#C88A18] transition-colors whitespace-nowrap ${
                      step.active ? 'text-[#C88A18]' : 'text-[#1F2A44]'
                    }`}>
                      {step.label}
                    </div>
                    <div className="mt-0.5 text-[17px] font-black tracking-tight text-[#1F2A44]">
                      {step.value}
                    </div>
                    <div className="text-[10px] font-medium text-[#64748B] whitespace-nowrap">
                      {step.subtitle}
                    </div>
                  </div>
                </div>

                {/* CONNECTOR LINE */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center px-1 mb-8">
                    <div className={`h-[2px] w-full rounded-full ${step.done ? 'bg-[#C88A18]' : 'bg-[#CBD5E1]'}`} />
                    <ChevronRight className={`h-3.5 w-3.5 -ml-2 shrink-0 ${step.done ? 'text-[#C88A18]' : 'text-[#CBD5E1]'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. REUSABLE COMPONENT: OpportunityTypes & Card
// ==========================================
export function OpportunityTypes({ setActivePhase, showToast, personLeads, properties, branches }) {
  // Same category split Phase 1's tabs and table use.
  const opportunities = computeOpportunityCounts(personLeads, properties, branches);

  const items = [
    {
      name: 'Interested Lead',
      value: opportunities.person,
      description: 'No property yet',
      button: 'View Leads →',
      icon: User,
      tone: 'bg-[#EEEAFE] text-[#5B3FC0]',
    },
    {
      name: 'Interested + Property',
      value: opportunities.branch,
      description: 'Person has property',
      button: 'View Properties →',
      icon: Building2,
      tone: 'bg-[#FFF3D6] text-[#D9911E]',
    },
    {
      name: 'Property Opportunity',
      value: opportunities.property,
      description: 'Owner / Broker submitted',
      button: 'View Opportunities →',
      icon: BriefcaseBusiness,
      tone: 'bg-[#E3F5EC] text-[#16805C]',
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44]">
            Opportunity Types
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Different ways opportunities enter the pipeline
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (setActivePhase) setActivePhase(1);
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* STACKED LIST LAYOUT FOR PERFECT RESPONSIVENESS AND HIGH READABILITY */}
      <div className="mt-3 space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => {
                if (setActivePhase) setActivePhase(1);
                if (showToast) showToast(`Filtering by ${item.name}`);
              }}
              className="group flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 transition-all hover:bg-white hover:shadow-md hover:border-[#C88A18]/50 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone} shadow-xs`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold text-[#1F2A44] group-hover:text-[#C88A18] transition-colors truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] font-medium text-[#64748B] truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xl font-black tracking-tight text-[#1F2A44]">
                  {item.value}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 6. REUSABLE COMPONENT: ActionRequired & Row
// ==========================================
export function ActionRequired({ setActivePhase, showToast }) {
  const actions = [
    { label: 'Properties waiting for MD decision', badge: '4', icon: FileText, tone: 'bg-[#FDEBEC] text-[#E5484D]', badgeBg: 'bg-[#E5484D] text-white', phaseId: 2 },
    { label: 'Leads need property search', badge: '5', icon: User, tone: 'bg-[#E8F1FC] text-[#2563C9]', badgeBg: 'bg-[#2563C9] text-white', phaseId: 3 },
    { label: 'LOIs waiting for approval', badge: '3', icon: ShieldCheck, tone: 'bg-[#FFF3D6] text-[#D9911E]', badgeBg: 'bg-[#D9911E] text-white', phaseId: 5 },
    { label: 'Legal review pending', badge: '2', icon: Gavel, tone: 'bg-[#EEEAFE] text-[#5B3FC0]', badgeBg: 'bg-[#5B3FC0] text-white', phaseId: 5 },
    { label: 'Delayed records', badge: '3', icon: AlertTriangle, tone: 'bg-[#FDEBEC] text-[#E5484D]', badgeBg: 'bg-[#E5484D] text-white', phaseId: 1 },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
          <div>
            <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44]">
              Action Required
            </h2>
            <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
              Items that need immediate attention
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (setActivePhase) setActivePhase(2);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-2 divide-y divide-[#F1F5F9]">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => {
                  if (setActivePhase) setActivePhase(item.phaseId);
                  if (showToast) showToast(`Opening: ${item.label}`);
                }}
                className="flex w-full items-center justify-between gap-3 py-2.5 px-2 text-left transition-colors hover:bg-[#F8FAFC] rounded-lg group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1F2A44] group-hover:text-[#C88A18] transition-colors truncate">
                    {item.label}
                  </span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold shadow-xs shrink-0 ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. REUSABLE COMPONENT: TopOpportunities & Row
// ==========================================
export function TopOpportunities({ onOpenPropertyDetail, showToast }) {
  const items = [
    {
      rank: 1,
      name: 'MP Nagar Commercial Unit',
      location: 'Bhopal, MP',
      details: '3,000 sq.ft • Commercial',
      score: 92,
      badge: 'High Potential',
      medal: '🥇',
      medalBg: 'bg-[#FFF4D6] text-[#C88A18] border-[#C88A18]/30',
      gradient: 'from-[#6366F1] to-[#4F46E5]'
    },
    {
      rank: 2,
      name: 'Andheri Retail Space',
      location: 'Mumbai, MH',
      details: '2,500 sq.ft • Retail',
      score: 89,
      badge: 'High Potential',
      medal: '🥈',
      medalBg: 'bg-[#F1F5F9] text-[#64748B] border-[#94A3B8]/30',
      gradient: 'from-[#3B82F6] to-[#1D4ED8]'
    },
    {
      rank: 3,
      name: 'HSR Layout Unit',
      location: 'Bangalore, KA',
      details: '3,500 sq.ft • Commercial',
      score: 87,
      badge: 'High Potential',
      medal: '🥉',
      medalBg: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30',
      gradient: 'from-[#F59E0B] to-[#D97706]'
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44]">
            Top Property Opportunities
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Highest potential opportunities based on score
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showToast) showToast('Viewing all top scored opportunities');
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <div
            key={item.rank}
            onClick={() => {
              if (onOpenPropertyDetail) {
                onOpenPropertyDetail({
                  id: `PROP-${item.rank}`,
                  name: item.name,
                  location: item.location,
                  area: item.details.split('•')[0].trim(),
                  type: item.details.split('•')[1]?.trim() || 'Commercial',
                  score: item.score,
                  status: 'In Progress'
                });
              }
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-left transition-all hover:border-[#C88A18] hover:bg-[#FFF4D6]/30 hover:shadow-xs cursor-pointer group"
          >
            {/* MEDAL BADGE */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm font-bold shadow-xs ${item.medalBg}`}>
              {item.medal}
            </div>

            {/* PREVIEW THUMBNAIL */}
            <div className={`h-11 w-12 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-xs border border-white/20`}>
              <Building2 className="w-4.5 h-4.5 opacity-90" />
            </div>

            {/* DETAILS & PROGRESS BAR */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#1F2A44] truncate group-hover:text-[#C88A18] transition-colors">
                  {item.name}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#E3F5EC] px-2 py-0.5 text-[9.5px] font-extrabold text-[#16805C] shrink-0">
                  {item.badge}
                </span>
              </div>

              <div className="mt-0.5 text-[10.5px] font-semibold text-[#64748B] truncate">
                {item.location} <span className="mx-1">•</span> {item.details}
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full bg-[#C88A18] transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-[#1F2A44] shrink-0">
                  {item.score}/100
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. REUSABLE COMPONENT: PipelineHealth & DonutChart
// ==========================================
export function PipelineHealth() {
  const legend = [
    { label: 'On Track', count: 28, pct: '58%', color: 'bg-[#16805C]', textColor: 'text-[#16805C]' },
    { label: 'At Risk', count: 7, pct: '15%', color: 'bg-[#D9911E]', textColor: 'text-[#D9911E]' },
    { label: 'Delayed', count: 4, pct: '8%', color: 'bg-[#E5484D]', textColor: 'text-[#E5484D]' },
    { label: 'Waiting', count: 9, pct: '19%', color: 'bg-[#CBD5E1]', textColor: 'text-[#64748B]' },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="pb-3 border-b border-[#F1F5F9]">
        <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44] flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#C88A18]" />
          Pipeline Health
        </h2>
        <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
          Overall pipeline status
        </p>
      </div>

      {/* DONUT CHART VISUAL */}
      <div className="mt-4 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#16805C_0_58%,#D9911E_58%_73%,#E5484D_73%_81%,#CBD5E1_81%_100%)] p-3.5 shadow-inner">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-md">
            <span className="text-[22px] font-black tracking-tight text-[#1F2A44]">48</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#64748B]">Total</span>
          </div>
        </div>
      </div>

      {/* LEGEND ROWS */}
      <div className="mt-4 space-y-2 border-t border-[#F1F5F9] pt-3">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 font-bold text-[#1F2A44]">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <span className="font-black text-[#1F2A44]">{item.count}</span>
              <span className="font-semibold text-[10px]">{item.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 9. REUSABLE COMPONENT: FinancialSnapshot
// ==========================================
export function FinancialSnapshot() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#C88A18]" />
            Financial Snapshot
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Based on approved opportunities
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF4D6] text-[#C88A18] shrink-0">
          <DollarSign className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-1 divide-y divide-[#F1F5F9]">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#F7E8C6] text-[#C88A18] shrink-0">
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11.5px] font-bold text-[#64748B] truncate">Estimated Investment</span>
          </div>
          <span className="text-[16px] font-black text-[#1F2A44] shrink-0">₹4.8 Cr</span>
        </div>

        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#E8F1FC] text-[#2563C9] shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11.5px] font-bold text-[#64748B] truncate">Expected Monthly Revenue</span>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[16px] font-black text-[#1F2A44]">₹72 Lakh</div>
            <div className="text-[9.5px] font-extrabold text-[#16805C]">↑ 12%</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#EEEAFE] text-[#5B3FC0] shrink-0">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11.5px] font-bold text-[#64748B] truncate">Average ROI</span>
          </div>
          <span className="text-[16px] font-black text-[#1F2A44] shrink-0">24%</span>
        </div>

        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#E3F5EC] text-[#16805C] shrink-0">
              <Clock3 className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11.5px] font-bold text-[#64748B] truncate">Average Break-even</span>
          </div>
          <span className="text-[16px] font-black text-[#1F2A44] shrink-0">18 Months</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. REUSABLE COMPONENT: RecentOpportunities Table
// ==========================================
export function RecentOpportunities({ onOpenPropertyDetail, showToast }) {
  const rows = [
    { id: 1, initials: 'HS', person: 'Hemant Sharma', property: 'MP Nagar Commercial Unit', location: 'Bhopal, MP', phase: 'Assessment', status: 'In Progress', updated: '25 Sep 2025' },
    { id: 2, initials: 'AV', person: 'Ankit Verma', property: 'Prime Retail Space', location: 'Mumbai, MH', phase: 'LOI & Commercial', status: 'Negotiation', updated: '24 Sep 2025' },
    { id: 3, initials: 'PS', person: 'Priya Singh', property: 'HSR Layout Unit', location: 'Bangalore, KA', phase: 'Property Research', status: 'In Progress', updated: '24 Sep 2025' },
    { id: 4, initials: 'NM', person: 'Neha Mehta', property: 'Koregaon Park Space', location: 'Pune, MH', phase: 'Review & Decision', status: 'Pending', updated: '23 Sep 2025' },
    { id: 5, initials: 'VT', person: 'Vikram Tiwari', property: 'Banjara Hills Space', location: 'Hyderabad, TG', phase: 'Assessment', status: 'Need Info', updated: '22 Sep 2025' },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44]">
            Recent Opportunities
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Latest opportunities in the system
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showToast) showToast('Viewing all recent opportunities');
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3 overflow-x-auto sidebar-scroll">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F8FAFC]">
              <th className="py-2.5 px-3 rounded-l-lg w-9">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CBD5E1] text-[#C88A18] focus:ring-[#C88A18]" />
              </th>
              <th className="py-2.5 px-2 w-8">#</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Person / Lead</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Property</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Location</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Current Phase</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Updated On</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-[11.5px]">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-[#FFF4D6]/20">
                <td className="py-2.5 px-3">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CBD5E1] text-[#C88A18] focus:ring-[#C88A18]" />
                </td>
                <td className="py-2.5 px-2 font-bold text-[#64748B]">{row.id}</td>
                <td className="py-2.5 px-3 font-bold text-[#1F2A44]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#E8F1FC] text-[10px] font-black text-[#2563C9] border border-[#2563C9]/20 shrink-0">
                      {row.initials}
                    </div>
                    <span className="whitespace-nowrap">{row.person}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#1F2A44] whitespace-nowrap">{row.property}</td>
                <td className="py-2.5 px-3 font-medium text-[#64748B] whitespace-nowrap">{row.location}</td>
                <td className="py-2.5 px-3 font-semibold text-[#1F2A44] whitespace-nowrap">{row.phase}</td>
                <td className="py-2.5 px-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-2.5 px-3 font-medium text-[#64748B] whitespace-nowrap">{row.updated}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenPropertyDetail) {
                          onOpenPropertyDetail({
                            id: `PROP-${row.id}`,
                            name: row.property,
                            location: row.location,
                            leadName: row.person,
                            status: row.status,
                            phase: row.phase
                          });
                        }
                      }}
                      className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#1F2A44] shadow-xs hover:border-[#C88A18] hover:text-[#C88A18] transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (showToast) showToast(`Options for ${row.property}`);
                      }}
                      className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#1F2A44] hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 11. REUSABLE COMPONENT: RecentActivity
// ==========================================
export function RecentActivity({ showToast }) {
  const activities = [
    { icon: Check, tone: 'bg-[#E3F5EC] text-[#16805C]', text: 'Assessment approved for MP Nagar Commercial Unit', person: 'Hemant Sharma', time: '10 minutes ago' },
    { icon: ArrowRight, tone: 'bg-[#E8F1FC] text-[#2563C9]', text: 'LOI sent to property owner', property: 'Prime Retail Space', time: '1 hour ago' },
    { icon: Users, tone: 'bg-[#E8F1FC] text-[#2563C9]', text: 'New interested lead added', person: 'Rahul Gupta', time: '3 hours ago' },
    { icon: Search, tone: 'bg-[#EEEAFE] text-[#5B3FC0]', text: 'Property research completed', property: 'HSR Layout Unit', time: '5 hours ago' },
    { icon: FileText, tone: 'bg-[#FFF3D6] text-[#D9911E]', text: 'Commercial terms updated', property: 'Koregaon Park Space', time: 'Yesterday' },
    { icon: Building2, tone: 'bg-[#EEEAFE] text-[#5B3FC0]', text: 'New property opportunity submitted', property: 'Banjara Hills Space', time: 'Yesterday' },
  ];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1F2A44]">
            Recent Activity
          </h2>
          <p className="mt-0.5 text-[11.5px] font-medium text-[#64748B]">
            Latest updates across all properties
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showToast) showToast('Viewing all recent system activity');
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C88A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3.5 space-y-3">
        {activities.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div key={idx} className="relative flex gap-3 pl-1 group cursor-pointer">
              {/* TIMELINE VERTICAL LINE */}
              {idx < activities.length - 1 && (
                <div className="absolute left-[13px] top-6 bottom-[-14px] w-[2px] bg-[#E2E8F0]" />
              )}

              {/* TIMELINE DOT */}
              <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.tone} shadow-xs`}>
                <ItemIcon className="h-3.5 w-3.5" />
              </div>

              {/* DETAILS */}
              <div className="flex-1 min-w-0 pb-0.5">
                <div className="text-[11.5px] font-bold text-[#1F2A44] leading-snug group-hover:text-[#C88A18] transition-colors">
                  {item.text}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] font-medium text-[#64748B]">
                  {item.person ? <span>{item.person}</span> : <span>{item.property}</span>}
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT: OverviewDashboard
// ==========================================
export default function OverviewDashboard({
  setActivePhase,
  onOpenNewLeadModal,
  onOpenPropertyDetail,
  showToast,
  personLeads,
  properties,
  branches
}) {

  return (
    <div className="space-y-4">
      {/* 1. TOP HERO BANNER */}
      <OverviewHero />

      {/* 2. KPI SUMMARY CARDS (6 CARDS ROW) */}
      <FunnelStatsRow
        activePhase="overview"
        setActivePhase={setActivePhase}
        showToast={showToast}
        personLeads={personLeads}
        properties={properties}
        branches={branches}
      />

      {/* 3. MAIN DASHBOARD GRID (LEFT 2/3 & RIGHT 1/3) */}
      <div className="grid gap-4 xl:grid-cols-[1.85fr_1fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-4 min-w-0">
          {/* PROPERTY PIPELINE */}
          <PropertyPipeline setActivePhase={setActivePhase} personLeads={personLeads} properties={properties} branches={branches} />

          {/* SUB-GRID: ACTION REQUIRED + TOP OPPORTUNITIES */}
          <div className="grid gap-4 md:grid-cols-2">
            <ActionRequired setActivePhase={setActivePhase} showToast={showToast} />
            <TopOpportunities onOpenPropertyDetail={onOpenPropertyDetail} showToast={showToast} />
          </div>

          {/* RECENT OPPORTUNITIES TABLE */}
          <RecentOpportunities onOpenPropertyDetail={onOpenPropertyDetail} showToast={showToast} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 min-w-0">
          {/* OPPORTUNITY TYPES */}
          <OpportunityTypes setActivePhase={setActivePhase} showToast={showToast} personLeads={personLeads} properties={properties} branches={branches} />

          {/* PIPELINE HEALTH */}
          <PipelineHealth />

          {/* FINANCIAL SNAPSHOT */}
          <FinancialSnapshot />

          {/* RECENT ACTIVITY */}
          <RecentActivity showToast={showToast} />
        </div>
      </div>
    </div>
  );
}
