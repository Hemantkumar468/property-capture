// Shared between Phase2ReviewDecision (tab badges + footer) and WorkflowStepper
// (the Phase 2 summary cards), so both read real counts from the same records
// instead of the unrelated hardcoded numbers each used to show separately.
export const computeSubmissionCounts = (submissions = []) => ({
  all: submissions.length,
  leads: submissions.filter((s) => s.type === 'Interested Lead').length,
  interestedProp: submissions.filter((s) => s.type === 'Interested + Property').length,
  opportunities: submissions.filter((s) => s.type === 'Property Opportunity').length,
  pending: submissions.filter((s) => s.decision === 'Pending').length
});
