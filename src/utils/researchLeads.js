// Shared between Phase3PropertyResearch (tab badges + footer) and
// WorkflowStepper (the Phase 3 summary cards).
export const computeResearchLeadCounts = (leads = []) => ({
  active: leads.filter((l) => l.status !== 'Closed').length,
  suggested: leads.filter((l) => (l.propertiesCount || 0) > 0).length,
  // Total shortlisted properties across all leads (the tab counts leads; a
  // card headed "Properties Shortlisted" wants the properties themselves).
  suggestedProperties: leads.reduce((n, l) => n + (l.propertiesCount || 0), 0),
  siteVisits: leads.filter((l) => String(l.status || '').includes('Site Visit')).length,
  ready: leads.filter((l) => l.status === 'Ready for Review').length,
  closed: leads.filter((l) => l.status === 'Closed').length
});
