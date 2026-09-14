// initialSubmissions is the richer, fully-shaped seed dataset (photos,
// personName, keyDetails, submittedOn, ...) that Phase 1's table columns
// actually expect — initialSubmissions is a near-empty, differently
// shaped record meant for something else and was wired here by mistake.
import { initialSubmissions } from '../data/fmsData';

// Shared between Phase1PropertyCapture (table + tab badges) and App (the
// stepper's summary cards), so both always agree on what category a raw
// opportunity record belongs to and how many exist in total.
export const categoryOf = (item) => {
  if (item.category) return item.category;
  if (item.type === 'Interested Lead') return 'person';
  if (item.type === 'Interested + Property') return 'branch';
  return 'property';
};

export const computeOpportunityCounts = (personLeads = [], properties = [], branches = []) => {
  const seed = initialSubmissions.reduce((acc, item) => {
    const cat = categoryOf(item);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { person: 0, branch: 0, property: 0 });

  const person = personLeads.length + seed.person;
  const branch = branches.length + seed.branch;
  const property = properties.length + seed.property;
  return { all: person + branch + property, person, branch, property };
};
