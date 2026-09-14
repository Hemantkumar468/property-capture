import React from 'react';
import { ChevronRight } from 'lucide-react';

// Shared by the Overview dashboard and the funnel row that sits on every
// phase page, so both render the same card. `active` marks the card for the
// phase you're currently on, using the same gold the flow stepper uses.
export default function KpiCard({ icon: Icon, title, value, trend, subtitle, tone, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] cursor-pointer min-h-[118px] min-w-0 ${
        active
          ? 'border-[#C88A18] bg-[#FFFDF7] ring-2 ring-[#C88A18]/25 shadow-[0_4px_16px_rgba(200,138,24,0.18)]'
          : 'border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="flex items-center gap-1 text-[#94A3B8] transition-colors group-hover:text-[#64748B]">
          <span className="text-2xl font-black tracking-tight text-[#1F2A44]">{value}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
      <div className="mt-2.5 space-y-0.5 min-w-0">
        <div className={`text-[12px] font-bold truncate ${active ? 'text-[#C88A18]' : 'text-[#1F2A44]'}`}>
          {title}
        </div>
        {trend ? (
          <div className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[#16805C] truncate">
            <span>{trend}</span>
          </div>
        ) : (
          <div className="text-[10.5px] font-medium text-[#64748B] truncate">{subtitle}</div>
        )}
      </div>
    </button>
  );
}
