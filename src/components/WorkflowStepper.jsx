import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Check,
  Building2,
  Calendar,
  Pause,
  FolderKanban,
  FileSignature,
  MapPin,
  CheckCircle,
  Search,
  FolderPlus,
  User,
  Store,
  TrendingUp,
  Link2,
  Copy,
  ExternalLink,
  MessageCircle,
  Share2,
  Mail,
  ClipboardCheck,
  Footprints,
  Gavel,
  Handshake,
  Scale,
  FileClock
} from 'lucide-react';

import {
  initialSubmissions,
  initialResearchLeads,
  initialAssessmentsData,
  initialDealsData,
  initialProjectsData
} from '../data/fmsData';
import { computeSubmissionCounts } from '../utils/submissions';
import { computeResearchLeadCounts } from '../utils/researchLeads';
import { computeAssessmentCounts } from '../utils/assessments';
import { computeDealCounts } from '../utils/deals';
import { computeProjectCounts } from '../utils/projects';
import FunnelStatsRow from './FunnelStatsRow';

export default function WorkflowStepper({
  activePhase,
  setActivePhase,
  darkMode,
  currentSubTab,
  setCurrentSubTab,
  copyEnquiryLink,
  copiedLink,
  enquiryLinkUrl,
  opportunityCounts,
  personLeads,
  properties,
  branches
}) {
  const steps = [
    { num: 1, name: 'Property Capture', desc: 'Collect leads & properties' },
    { num: 2, name: 'Review & Decision', desc: 'MD reviews & assigns' },
    { num: 3, name: 'Property Research', desc: 'Find & evaluate locations' },
    { num: 4, name: 'Assessment', desc: 'Feasibility & tech checks.' },
    { num: 5, name: 'LOI & Commercial', desc: 'Agreement signed' },
    { num: 6, name: 'Project Creation', desc: 'Launch project in PMS.' }
  ];

  // Helper for Hero content based on phase
  const getHeroInfo = () => {
    switch (activePhase) {
      case 1:
        return {
          title: 'Property Capture & Lead Collection',
          desc: 'Collect and organize property submissions and franchise enquiries across locations.',
          quote: '“Every great location begins with a single lead.”',
          badgeTitle: 'Phase 1 of 6',
          badgeDesc: 'Capture & Lead Intake.'
        };
      case 2:
        return {
          title: 'Review & Executive Decision',
          desc: 'Managing Director reviews incoming leads and assigns researchers for site evaluation.',
          quote: '“Decisive leadership powers strategic expansion.”',
          badgeTitle: 'Phase 2 of 6',
          badgeDesc: 'MD Review & Assignment.'
        };
      case 3:
        return {
          title: 'Property Research & Location Discovery',
          desc: 'Identify, shortlist and conduct site visits for promising commercial properties.',
          quote: '“Thorough research lays the groundwork for success.”',
          badgeTitle: 'Phase 3 of 6',
          badgeDesc: 'Property Research & Visits.'
        };
      case 4:
        return {
          title: 'Assessment & Feasibility Check',
          desc: 'Evaluate shortlisted properties for technical, financial, operational and market feasibility.',
          quote: '“Right evaluation today, stronger Mystery Rooms tomorrow.”',
          badgeTitle: 'Phase 4 of 6',
          badgeDesc: 'Feasibility & tech checks.'
        };
      case 5:
        return {
          title: 'LOI & Commercial Finalization',
          desc: 'Manage LOI issuance, commercial negotiations, legal clearance and final lease registration.',
          quote: '“Clear terms today, lasting partnerships tomorrow.”',
          badgeTitle: 'Phase 5 of 6',
          badgeDesc: 'Legal clearance & lease.'
        };
      case 6:
        return {
          title: 'Project Creation & Launch',
          desc: 'Create and manage projects for approved properties with signed agreements.',
          quote: '“From signed agreements to extraordinary destinations.”',
          badgeTitle: 'Phase 6 of 6',
          badgeDesc: 'Launch project in PMS.'
        };
      default:
        return {
          title: 'Property FMS Console',
          desc: 'Manage end-to-end franchise development, property acquisition, and project delivery.',
          quote: '“Streamlined workflows for nationwide expansion.”',
          badgeTitle: 'Enterprise Console',
          badgeDesc: 'Property & Project FMS.'
        };
    }
  };

  const hero = getHeroInfo();

  // Summary cards for phases 2-5. Each phase mirrors its own table's tabs and
  // reads real counts from that phase's records, so the row above the stepper
  // stays meaningful on every page instead of a single placeholder card.
  const submissionCounts = computeSubmissionCounts(initialSubmissions);
  const researchCounts = computeResearchLeadCounts(initialResearchLeads);
  const assessmentCounts = computeAssessmentCounts(initialAssessmentsData);
  const dealCounts = computeDealCounts(initialDealsData);
  const projectCounts = computeProjectCounts(initialProjectsData);

  const phaseCards = {
    2: [
      { icon: User, tint: 'bg-[#F2EDFD] text-[#6E42E5]', value: submissionCounts.leads, title: 'Interested Leads', desc: 'Franchise enquiries awaiting MD review.' },
      { icon: Building2, tint: 'bg-[#FEF6E6] text-[#D9822B]', value: submissionCounts.interestedProp, title: 'Interested + Property', desc: 'Partners who already have a location.' },
      { icon: Store, tint: 'bg-[#EBF3FF] text-[#2F6FE0]', value: submissionCounts.opportunities, title: 'Property Opportunities', desc: 'Submitted by owners, brokers or agents.' },
      { icon: FileClock, tint: 'bg-[#FFF3D6] text-[#D9911E]', value: submissionCounts.pending, title: 'Pending Decision', desc: 'Awaiting approve, reject or more info.' }
    ],
    3: [
      { icon: Search, tint: 'bg-[#F2EDFD] text-[#6E42E5]', value: researchCounts.active, title: 'Active Searches', desc: 'Leads with a live property search.' },
      { icon: MapPin, tint: 'bg-[#EBF3FF] text-[#2F6FE0]', value: researchCounts.suggestedProperties, title: 'Properties Shortlisted', desc: 'Options found across all active leads.' },
      { icon: Footprints, tint: 'bg-[#FEF6E6] text-[#D9822B]', value: researchCounts.siteVisits, title: 'Site Visits', desc: 'Visits scheduled or completed.' },
      { icon: ClipboardCheck, tint: 'bg-[#E3F5EC] text-[#1F9D6A]', value: researchCounts.ready, title: 'Ready for Review', desc: 'Research done, awaiting sign-off.' }
    ],
    4: [
      { icon: FileCheck, tint: 'bg-[#E8F1FC] text-[#3B82C4]', value: assessmentCounts.inProgress, title: 'In Progress', desc: 'Feasibility checks underway.' },
      { icon: CheckCircle2, tint: 'bg-[#E3F5EC] text-[#1F9D6A]', value: assessmentCounts.completed, title: 'Completed', desc: 'Assessment finished and signed off.' },
      { icon: Clock, tint: 'bg-[#FFF3D6] text-[#D9911E]', value: assessmentCounts.needInfo, title: 'Need Info', desc: 'Waiting on documents or clarification.' },
      { icon: XCircle, tint: 'bg-[#FDEBEC] text-[#E5484D]', value: assessmentCounts.notFeasible, title: 'Not Feasible', desc: 'Ruled out on technical or commercial grounds.' }
    ],
    5: [
      { icon: FileSignature, tint: 'bg-[#F2EDFD] text-[#6E42E5]', value: dealCounts.loiDrafting, title: 'LOI Drafting', desc: 'Letters of intent being prepared.' },
      { icon: Scale, tint: 'bg-[#E8F1FC] text-[#3B82C4]', value: dealCounts.legalReview, title: 'Legal Review', desc: 'With legal for clearance.' },
      { icon: Handshake, tint: 'bg-[#FEF6E6] text-[#D9822B]', value: dealCounts.leaseNegotiation, title: 'Lease Negotiation', desc: 'Commercial terms under discussion.' },
      { icon: Gavel, tint: 'bg-[#E3F5EC] text-[#1F9D6A]', value: dealCounts.readyFinalization, title: 'Ready for Finalization', desc: 'Cleared and ready to sign.' }
    ]
  };

  return (
    <div className="space-y-3 mb-3">
      
      {/* 1. HERO BANNER */}
      <div className={`p-4 rounded-2xl border shadow-sm transition-colors relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        
        {/* Banner Left Title */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-[#F5E8C8] text-[#C88A18] flex items-center justify-center text-xl shrink-0 font-bold border border-[#C88A18]/30 shadow-sm">
            <FolderPlus className="w-5 h-5 text-[#C88A18]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              {hero.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug font-medium">
              {hero.desc}
            </p>
          </div>
        </div>

        {/* Banner Center Quote */}
        <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs font-semibold text-gray-700 dark:text-amber-200">
          <div className="w-0.5 h-6 bg-[#C88A18] rounded-full" />
          <span className="italic">{hero.quote}</span>
        </div>

        {/* Banner Far Right Image */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="w-44 sm:w-56 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md relative hidden sm:block">
            <img
              src="/mystery_rooms_banner.jpg"
              alt="Mystery Rooms Storefront"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/70 via-transparent to-[#172033]/30" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C88A18]" />
            <div className="absolute top-2 left-2.5 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[9.5px] font-extrabold text-[#F5E8C8] tracking-wide uppercase">
              {hero.badgeTitle}
            </div>
          </div>
        </div>

      </div>

      {/* 2. FUNNEL STATS — the same six-stage row the Overview shows, so the
             whole pipeline stays visible on every phase, current one highlighted. */}
      <FunnelStatsRow
        activePhase={activePhase}
        setActivePhase={setActivePhase}
        personLeads={personLeads}
        properties={properties}
        branches={branches}
      />

      {/* 3. SUMMARY CARDS (5 cards in 1 row for Phase 6, custom rows for other phases) */}
      {activePhase === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Card 1: Interested Leads */}
          <div
            onClick={() => setCurrentSubTab && setCurrentSubTab('person')}
            className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
              currentSubTab === 'person' ? 'ring-2 ring-[#6E42E5]/40' : ''
            } ${darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'}`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#F2EDFD] text-[#6E42E5] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{opportunityCounts?.person ?? 12}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Interested Leads
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                People interested in opening Mystery Rooms but no property yet.
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10.5px] font-bold text-[#1F9D6A]">
                <TrendingUp className="w-3 h-3" />
                <span>+3 this week</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interested + Property */}
          <div
            onClick={() => setCurrentSubTab && setCurrentSubTab('branch')}
            className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
              currentSubTab === 'branch' ? 'ring-2 ring-[#D9822B]/40' : ''
            } ${darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'}`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FEF6E6] text-[#D9822B] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{opportunityCounts?.branch ?? 8}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Interested + Property
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Interested partners who already have a property/location.
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10.5px] font-bold text-[#1F9D6A]">
                <TrendingUp className="w-3 h-3" />
                <span>+2 this week</span>
              </div>
            </div>
          </div>

          {/* Card 3: Property Opportunities */}
          <div
            onClick={() => setCurrentSubTab && setCurrentSubTab('property')}
            className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
              currentSubTab === 'property' ? 'ring-2 ring-[#2F6FE0]/40' : ''
            } ${darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'}`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#EBF3FF] text-[#2F6FE0] flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{opportunityCounts?.property ?? 15}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Property Opportunities
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Properties submitted by owners, brokers or external sources.
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10.5px] font-bold text-[#1F9D6A]">
                <TrendingUp className="w-3 h-3" />
                <span>+5 this week</span>
              </div>
            </div>
          </div>

          {/* Card 4: Share Submission Link */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
            darkMode ? 'bg-[#0F2A1C] border-[#1F4A32]' : 'bg-[#E9F9EF] border-[#BFE8D0]'
          }`}>
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/70 dark:bg-white/10 text-[#1F9D6A] flex items-center justify-center font-bold shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">
                  Share Submission Link
                </div>
                <p className="text-[10px] text-gray-600 dark:text-[#94A3B8] mt-0.5 leading-snug">
                  Share this link with brokers, partners or anyone to submit a property opportunity.
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-[#BFE8D0] dark:border-[#1F4A32] text-[10.5px] font-mono text-gray-700 dark:text-[#C5C8D6] truncate">
                {enquiryLinkUrl || 'https://mysteryrooms.com/property-capture/apply'}
              </div>
              <button
                onClick={copyEnquiryLink}
                title="Copy link"
                className="w-7 h-7 shrink-0 rounded-lg bg-white/70 dark:bg-white/10 border border-[#BFE8D0] dark:border-[#1F4A32] flex items-center justify-center text-[#1F9D6A] hover:bg-white transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={enquiryLinkUrl || 'https://mysteryrooms.com/property-capture/apply'}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#111827] text-white text-[10.5px] font-bold flex items-center gap-1 hover:bg-black transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              {[
                { Icon: MessageCircle, title: 'Share via WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(enquiryLinkUrl || '')}` },
                { Icon: Share2, title: 'Share via LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(enquiryLinkUrl || '')}` },
                { Icon: Mail, title: 'Share via Email', href: `mailto:?body=${encodeURIComponent(enquiryLinkUrl || '')}` }
              ].map(({ Icon, title, href }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                  className="w-7 h-7 rounded-lg bg-white/70 dark:bg-white/10 border border-[#BFE8D0] dark:border-[#1F4A32] flex items-center justify-center text-gray-600 dark:text-[#C5C8D6] hover:bg-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

        </div>
      ) : activePhase === 6 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

          {/* Card 1: Total Projects */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#F5E8C8] text-[#C88A18] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-[#C88A18]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{projectCounts.all}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Total Projects
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Created from signed agreements
              </p>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#E3F5EC] text-[#1F9D6A] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{projectCounts.inProgress}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                In Progress
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Under execution
              </p>
            </div>
          </div>

          {/* Card 3: Upcoming */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#E8F1FC] text-[#3B82C4] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{projectCounts.upcoming}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Upcoming
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Kick-off pending
              </p>
            </div>
          </div>

          {/* Card 4: On Hold */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#EEEAFE] text-[#6C63C9] flex items-center justify-center font-bold">
                <Pause className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{projectCounts.onHold}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                On Hold
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Temporary pause
              </p>
            </div>
          </div>

          {/* Card 5: Completed */}
          <div className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between cursor-pointer hover:shadow-md ${
            darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{projectCounts.completed}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-bold text-xs text-gray-900 dark:text-white">
                Completed
              </div>
              <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                Successfully launched
              </p>
            </div>
          </div>

        </div>
      ) : phaseCards[activePhase] ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {phaseCards[activePhase].map(({ icon: Icon, tint, value, title, desc }) => (
            <div
              key={title}
              className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between hover:shadow-md ${
                darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${tint}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{value}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-3">
                <div className="font-bold text-xs text-gray-900 dark:text-white">
                  {title}
                </div>
                <p className="text-[10.5px] text-gray-500 dark:text-[#94A3B8] mt-0.5 leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* 4. SIX-STEP WORKFLOW STEPPER */}
      <div className={`p-4 rounded-2xl border shadow-sm transition-colors ${
        darkMode ? 'bg-[#172033] border-[#253046]' : 'bg-white border-[#E2E8F0]'
      }`}>
        {/* overflow-x-auto forces overflow-y to compute as `auto`, so this box
            clips vertically. The active step's ring-4 + glow + scale-105 all
            paint outside its layout box, so it needs vertical padding here or
            the top of the active circle gets sliced off. */}
        <div className="flex items-center justify-between relative px-2 py-3 overflow-x-auto stepper-scroll">
          {steps.map((step, idx) => {
            const isActive = step.num === activePhase;

            return (
              <React.Fragment key={step.num}>
                {/* Step Circle Node */}
                <div 
                  onClick={() => setActivePhase(step.num)}
                  className="flex flex-col items-center group cursor-pointer relative z-10 select-none flex-1 min-w-[125px]"
                >
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#C88A18] text-white border-[#F4E1B5] shadow-[0_0_15px_rgba(200,138,24,0.4)] ring-4 ring-[#C88A18]/20 scale-105 font-black'
                      : darkMode
                        ? 'bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:border-[#C88A18]'
                        : 'bg-gray-100 border-gray-300 text-gray-500 hover:border-[#C88A18]'
                  }`}>
                    <span className="text-sm font-extrabold">{step.num}</span>
                  </div>

                  <div className="text-center mt-2">
                    <div className={`text-[12px] font-bold leading-tight ${
                      isActive 
                        ? 'text-[#C88A18]' 
                        : darkMode ? 'text-white' : 'text-[#1F2937]'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight font-medium">
                      {step.desc}
                    </div>
                  </div>
                </div>

                {/* Connector between steps */}
                {idx < steps.length - 1 && (
                  <div className="flex items-center justify-center px-1 mb-5 shrink-0">
                    <div className="h-[2px] w-6 sm:w-8 border-t-2 border-dashed border-gray-300 dark:border-gray-700" />
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 text-gray-300 dark:text-gray-600" />
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
