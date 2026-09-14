// Shared between Phase4Assessment (tab badges + footer) and WorkflowStepper
// (the Phase 4 summary cards).
export const computeAssessmentCounts = (items = []) => ({
  all: items.length,
  inProgress: items.filter((i) => i.status === 'In Progress').length,
  completed: items.filter((i) => i.status === 'Completed').length,
  needInfo: items.filter((i) => i.status === 'Need Info').length,
  notFeasible: items.filter((i) => i.status === 'Not Feasible').length
});
