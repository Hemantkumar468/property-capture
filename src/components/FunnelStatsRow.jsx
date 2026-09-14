import React, { useMemo } from 'react';
import KpiCard from './KpiCard';
import { buildFunnelStats } from '../utils/funnelStats';

// The six-stage funnel summary. Rendered on the Overview dashboard and above
// the phase-specific cards on every phase page, so the whole pipeline stays
// visible wherever you are — with the current phase's card highlighted.
export default function FunnelStatsRow({
  activePhase,
  setActivePhase,
  showToast,
  personLeads,
  properties,
  branches
}) {
  const stats = useMemo(
    () => buildFunnelStats({ personLeads, properties, branches }),
    [personLeads, properties, branches]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((item) => (
        <KpiCard
          key={item.phase}
          icon={item.icon}
          title={item.title}
          value={item.value}
          trend={item.trend}
          subtitle={item.subtitle}
          tone={item.tone}
          active={activePhase === item.phase}
          onClick={() => {
            if (setActivePhase) setActivePhase(item.phase);
            if (showToast) showToast(`Navigating to ${item.title}`);
          }}
        />
      ))}
    </div>
  );
}
