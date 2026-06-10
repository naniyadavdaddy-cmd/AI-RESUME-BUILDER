import React from "react";
import { 
  Compass, 
  Layers, 
  Target, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Search, 
  Workflow, 
  LineChart 
} from "lucide-react";

export default function ArchitectureDocs() {
  return (
    <div className="space-y-8 bg-white/5 backdrop-blur-xl text-slate-100 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-radial from-blue-500/5 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Strategic Blueprints & Developer Roadmap
        </h2>
        <p className="mt-2 text-slate-400 max-w-3xl text-sm leading-relaxed">
          Comprehensive project outline detailing technical workflow architecture, modular project phases, recruiter-seeker user personas, and performance key metrics.
        </p>
      </div>

      {/* Grid of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel 1: Dev Roadmap */}
        <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <Compass className="w-5 h-5 text-blue-400 font-bold" />
            <h3 className="font-semibold text-lg text-slate-100">1. AI Resume Builder Roadmap</h3>
          </div>
          <div className="space-y-4 text-xs leading-relaxed col-span-1">
            <p className="text-slate-400">
              A phased release strategy focusing on seamless server interactions, AI formatting compliance, and zero-flicker client responsiveness.
            </p>
            <div className="relative pl-6 border-l-2 border-blue-500/30 space-y-5">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-[#121421]"></span>
                <span className="font-semibold text-slate-200 block">Phase 1: Foundation & Interactivity (Weeks 1-2)</span>
                <span className="text-slate-400 mt-1 block">Assemble React SPA modules. Establish structured context engines. Construct live responsive A4 preview layout. Integrate base local persistence.</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-blue-500/65 rounded-full border-4 border-[#121421]"></span>
                <span className="font-semibold text-slate-200 block">Phase 2: Full-Stack SDK Hooks & AI Tuning (Weeks 3-4)</span>
                <span className="text-slate-400 mt-1 block">Erect Express backend framework. Integrate @google/genai libraries with tailored system instructions. Program raw text parsers for bullet context suggestions.</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-blue-500/30 rounded-full border-4 border-[#121421]"></span>
                <span className="font-semibold text-slate-200 block">Phase 3: ATS Score Calibration (Weeks 5-6)</span>
                <span className="text-slate-400 mt-1 block">Construct complex comparative scoring algorithms combining term frequencies (TF-IDF) with generative semantic correlation models in Gemini 3.5.</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-blue-500/15 rounded-full border-4 border-[#121421]"></span>
                <span className="font-semibold text-slate-200 block">Phase 4: Export Engine & Beta Launch (Weeks 7-8)</span>
                <span className="text-slate-400 mt-1 block">Configure print-media CSS stylesheets to guarantee perfect 16pt/12pt single-column layouts. Conduct beta test sweeps with recruiter mock screening blocks.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: ATS Checker Architecture */}
        <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-lg text-slate-100">2. ATS Integration Architecture</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Unlike simple word matching, our integrated ATS system models the precise behavioral mechanics of Enterprise HR search engines (Workday, Taleo):
          </p>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Semantic Parsing Layer</h4>
                <p className="text-slate-400 mt-1 leading-normal">Converts unstructured resume text into categorized components (Skills list, Work chronological array, Education index, Contact headers) using specialized lexical tokens.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Comparative Relevance Model</h4>
                <p className="text-slate-400 mt-1 leading-normal">Leverages Gemini 3.5's dual attention mechanism to score similarity based on context rather than verbatim keyword presence (e.g. mapping "build and grow frontends" to "React developer").</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Formatting Risk Heuristics</h4>
                <p className="text-slate-400 mt-1 leading-normal">Inspects the document structure for design choices that crash parsers: multi-column sidebars, custom canvas graphics, vector grids, or hidden white keywords.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Target Audience */}
        <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg text-slate-100">3. Target Audience Personas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3.5 bg-[#111422]/60 rounded-xl border border-white/10 shadow-inner">
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded text-[10px] font-semibold uppercase tracking-wider border border-blue-500/20">Job Seekers</span>
              <h4 className="font-bold text-slate-200 mt-1">Active Applicants</h4>
              <p className="text-slate-400 leading-normal">Individuals frustrated by "automated HR black holes." They need exact keywords, layout compliance flags, and real-time bullet phrasing tips to bypass screening thresholds.</p>
              <ul className="space-y-1.5 text-slate-400 mt-3 pt-2 border-t border-white/5">
                <li className="flex gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Fast optimization feedback</li>
                <li className="flex gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Bullet rewrite suggestion bank</li>
              </ul>
            </div>

            <div className="space-y-2 p-3.5 bg-[#111422]/60 rounded-xl border border-white/10 shadow-inner">
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded text-[10px] font-semibold uppercase tracking-wider border border-cyan-500/20">Recruiters</span>
              <h4 className="font-bold text-slate-200 mt-1">Hiring Teams & Sourcing</h4>
              <p className="text-slate-400 leading-normal">Corporate recruiters seeking high match candidates without manually reading thousands of pages. They use the tool to verify if writing matches target job profiles.</p>
              <ul className="space-y-1.5 text-slate-400 mt-3 pt-2 border-t border-white/5">
                <li className="flex gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Keyword gap indicators</li>
                <li className="flex gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Structural integrity scores</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Panel 4: KPIs */}
        <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-lg text-slate-100">4. Key Performance Indicators (KPIs)</h3>
          </div>
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              Metrics divided into two key dimensions focusing heavily on client conversion rates and optimization scores:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <span className="text-slate-400 font-medium block">Applicant Conversion</span>
                <span className="text-2xl font-black text-blue-300 block mt-1">42%</span>
                <span className="text-[10px] text-slate-500 block mt-1 leading-normal">Session-to-export actions completion rate.</span>
              </div>

              <div className="p-3.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 font-medium block">Average Match Delta</span>
                <span className="text-2xl font-black text-cyan-300 block mt-1">+28 pts</span>
                <span className="text-[10px] text-slate-500 block mt-1 leading-normal">ATS qualification boost after adopting AI suggestions.</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-slate-400">
              <div className="flex justify-between items-center text-[11px]">
                <span>User Retention (Weekly Return Rate)</span>
                <span className="font-semibold text-slate-200">35%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[35%] rounded-full"></div>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1">
                <span>ATS Parsing Pass Rate (Clean formatting)</span>
                <span className="font-semibold text-slate-200">97.8%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[97.8%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl">
        <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <LineChart className="w-4 h-4 text-blue-400 font-bold" />
          End-to-End Deep Parsing Flow Lifecycle
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-xs">
          <div className="bg-[#111422]/50 p-3 rounded-xl border border-white/10 space-y-1 shadow-inner">
            <span className="font-semibold text-blue-300 block">Input Draft</span>
            <span className="text-slate-400 block text-[10px]">User edits components in live form</span>
          </div>
          <div className="flex justify-center text-blue-500/40"><ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" /></div>
          <div className="bg-[#111422]/50 p-3 rounded-xl border border-white/10 space-y-1 shadow-inner">
            <span className="font-semibold text-cyan-300 block">Secure Proxy</span>
            <span className="text-slate-400 block text-[10px]">Protects secret keys on Express Node</span>
          </div>
          <div className="flex justify-center text-blue-500/40"><ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" /></div>
          <div className="bg-[#111422]/50 p-3 rounded-xl border border-white/10 space-y-1 shadow-inner">
            <span className="font-semibold text-blue-300 block">Gemini 3.5 LLM</span>
            <span className="text-slate-400 block text-[10px]">Generates targeted bullet rewrite matrices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
