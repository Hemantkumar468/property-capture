import { Building2, Clock3, Search, FileText, Handshake, Rocket } from 'lucide-react';

import {
  initialSubmissions,
  initialResearchLeads,
  initialAssessmentsData,
  initialDealsData,
  initialProjectsData
} from '../data/fmsData';
import { computeOpportunityCounts } from './opportunities';
import { computeSubmissionCounts } from './submissions';
import { computeResearchLeadCounts } from './researchLeads';
import { computeAssessmentCounts } from './assessments';
import { computeDealCounts } from './deals';
import { computeProjectCounts } from './projects';

// The six-stage funnel row shown on the Overview dashboard and on top of every
// phase page. Each entry's `phase` maps to the workflow phase it belongs to, so
// the row can highlight whichever phase you're currently on.
//
// Every value comes from the same helpers the individual phase pages use for
// their own tab badges and cards, so the funnel can't contradict the table
// sitting underneath it.
export const buildFunnelStats = ({ personLeads = [], properties = [], branches = [] } = {}) => {
  const opportunities = computeOpportunityCounts(personLeads, properties, branches);
  const submissions = computeSubmissionCounts(initialSubmissions);
  const research = computeResearchLeadCounts(initialResearchLeads);
  const assessments = computeAssessmentCounts(initialAssessmentsData);
  const deals = computeDealCounts(initialDealsData);
  const projects = computeProjectCounts(initialProjectsData);

  return [
    { phase: 1, icon: Building2, title: 'Total Opportunities', value: opportunities.all, subtitle: 'Leads & properties', tone: 'bg-[#E8F1FC] text-[#2563C9]' },
    { phase: 2, icon: Clock3, title: 'Under Review', value: submissions.pending, subtitle: 'Awaiting MD decision', tone: 'bg-[#FFF3D6] text-[#D9911E]' },
    { phase: 3, icon: Search, title: 'Property Research', value: research.active, subtitle: 'In research phase', tone: 'bg-[#EEEAFE] text-[#5B3FC0]' },
    { phase: 4, icon: FileText, title: 'Assessment', value: assessments.all, subtitle: 'Feasibility checks', tone: 'bg-[#E3F5EC] text-[#16805C]' },
    { phase: 5, icon: Handshake, title: 'LOI & Commercial', value: deals.all, subtitle: 'In negotiation', tone: 'bg-[#FFF4D6] text-[#C88A18]' },
    { phase: 6, icon: Rocket, title: 'Projects Created', value: projects.all, subtitle: 'Ready / Active', tone: 'bg-[#E8F1FC] text-[#2563C9]' }
  ];
};
