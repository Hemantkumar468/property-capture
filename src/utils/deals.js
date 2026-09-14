// Shared between Phase5LOICommercial (tab badges + footer) and
// WorkflowStepper (the Phase 5 summary cards).
export const computeDealCounts = (deals = []) => ({
  all: deals.length,
  loiDrafting: deals.filter((d) => d.currentStage === 'LOI Drafting').length,
  legalReview: deals.filter((d) => d.currentStage === 'Legal Review').length,
  leaseNegotiation: deals.filter((d) => d.currentStage === 'Lease Negotiation').length,
  readyFinalization: deals.filter((d) => d.currentStage === 'Ready for Finalization').length,
  closed: deals.filter((d) => d.currentStage === 'Closed').length
});
