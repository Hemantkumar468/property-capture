// Shared between Phase6ProjectCreation (tab badges + footer) and
// WorkflowStepper (the Phase 6 summary cards).
export const computeProjectCounts = (projects = []) => ({
  all: projects.length,
  inProgress: projects.filter((p) => p.status === 'In Progress').length,
  upcoming: projects.filter((p) => p.status === 'Upcoming').length,
  onHold: projects.filter((p) => p.status === 'On Hold').length,
  completed: projects.filter((p) => p.status === 'Completed').length
});
