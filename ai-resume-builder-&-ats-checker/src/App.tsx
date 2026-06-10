import React, { useState } from "react";
import { ResumeData } from "./types";
import { initialResume } from "./initialData";
import ResumeBuilder from "./components/ResumeBuilder";
import ResumePreview from "./components/ResumePreview";
import AtsChecker from "./components/AtsChecker";
import ArchitectureDocs from "./components/ArchitectureDocs";
import Pricing from "./components/Pricing";
import GmailShare from "./components/GmailShare";
import { 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Compass, 
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Users,
  Award,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"builder" | "ats" | "pricing" | "docs">("builder");
  const [resumeData, setResumeData] = useState<ResumeData>(initialResume);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("app_theme") as "dark" | "light") || "dark";
  });
  const [subscribedPlanId, setSubscribedPlanId] = useState<string>(() => {
    return localStorage.getItem("subscribed_plan_id") || "free";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app_theme", nextTheme);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans print:bg-white print:text-black relative overflow-x-hidden transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-[#0f111a] text-slate-100" 
        : "bg-slate-50 text-slate-950 light-mode"
    }`}>
      
      {/* Decorative Ambient Glass blobs */}
      {theme === "dark" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden print:hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/15 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px]"></div>
          <div className="absolute top-[25%] right-[15%] w-[35%] h-[35%] bg-emerald-500/10 rounded-full blur-[110px]"></div>
        </div>
      )}

      {/* Universal Sticky Top Header Bar (hidden during PDF print) */}
      <header className={`relative z-20 border-b sticky top-0 print:hidden transition-all shadow-lg backdrop-blur-md ${
        theme === "dark"
          ? "border-white/10 bg-[#0f111a]/80"
          : "border-slate-200 bg-white/90 text-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand / Human Labels */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
                AI Resume <span className="text-blue-500">Builder</span>
              </h1>
              <p className={`text-[10px] font-medium tracking-wider uppercase ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}>
                Enterprise Placement Optimization Engine
              </p>
            </div>
          </div>

          {/* Interactive Navigation Elements */}
          <nav className={`flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-2xl border transition-all ${
            theme === "dark"
              ? "bg-black/40 border-white/10 text-white"
              : "bg-slate-100 border-slate-200 text-slate-800"
          }`}>
            <button
              id="tab-builder"
              type="button"
              onClick={() => setActiveTab("builder")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "builder" 
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10" 
                  : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Builder</span>
            </button>
            
            <button
              id="tab-ats"
              type="button"
              onClick={() => setActiveTab("ats")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "ats" 
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10" 
                  : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>ATS Auditor</span>
            </button>

            <button
              id="tab-pricing"
              type="button"
              onClick={() => setActiveTab("pricing")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "pricing" 
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10" 
                  : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Premium Plans</span>
            </button>

            <button
              id="tab-docs"
              type="button"
              onClick={() => setActiveTab("docs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "docs" 
                  ? "bg-blue-500 text-white border border-blue-500/20" 
                  : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Plan & Specs</span>
            </button>
          </nav>

          {/* Accessibility Settings & Premium badge container */}
          <div className="flex items-center gap-2.5">
            {/* Theme Switcher Button */}
            <button
              id="theme-toggler"
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-sm"
              }`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            {/* Active Plan Badge if upgraded */}
            {subscribedPlanId && subscribedPlanId !== "free" && (
              <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-505 font-bold tracking-wider text-[10px] rounded-full uppercase border border-blue-500/20 shadow-sm animate-pulse">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>{subscribedPlanId === "pro" ? "Pro Copilot" : "Executive"}</span>
              </span>
            )}
          </div>

        </div>
      </header>

      {/* Hero Banner Area - gives visual density and contextual cues (hidden on printing) */}
      <div className={`relative z-10 border-b print:hidden transition-all duration-300 ${
        theme === "dark" 
          ? "border-white/10 bg-white/[0.02] backdrop-blur-sm" 
          : "border-slate-200 bg-slate-500/5"
      }`}>
        {activeTab === "builder" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Info segment */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-500 text-[10px] font-bold tracking-wider rounded-full uppercase border border-blue-500/20 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>Optimize with real-time AI scanning</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-3xl font-extrabold tracking-tight">
                Supercharge Your Resume <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-black">
                  Match Score from 34% to 91%
                </span>
              </h2>
              <p className={`text-sm leading-relaxed max-w-xl ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
                Populate your professional profile details on the left, and watch our enterprise placement engine continuously align syntax weight thresholds to maximize executive hiring compatibility.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>ATS Compliant Syntax</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-blue-500 dark:text-blue-400">98% Passed Ratio</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>Hiring Principal Approved</span>
                </div>
              </div>
            </div>

            {/* Right Glowing overlapping cards segment (exactly as requested from user mockup) */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-[320px] h-[210px] select-none">
                {/* Back Card (34% Score resume) */}
                <div className={`absolute top-0 left-0 w-[170px] h-[180px] rounded-2xl border transition-all duration-300 p-4 shadow-xl flex flex-col justify-between ${
                  theme === "dark"
                    ? "bg-[#161925]/70 border-white/5 opacity-60"
                    : "bg-white border-slate-300 opacity-60 shadow-slate-200/50"
                }`}>
                  <div className="relative">
                    {/* 34% Badge */}
                    <span className="absolute top-0 right-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-rose-500 bg-rose-500/10 border border-rose-500/20 uppercase tracking-widest leading-none">
                      34%
                    </span>
                    {/* Header circular block */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500/20 to-indigo-500/20 flex-shrink-0 border border-rose-500/10"></div>
                      <div className="space-y-1">
                        <div className={`h-1.5 w-12 rounded ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`}></div>
                        <div className={`h-1 w-8 rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
                      </div>
                    </div>
                  </div>
                  {/* Lines block */}
                  <div className="space-y-1.5">
                    <div className={`h-1 w-full rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
                    <div className={`h-1 w-11/12 rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
                    <div className={`h-1 w-10/12 rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
                    <div className={`h-1 w-8/12 rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
                  </div>
                </div>

                {/* Front Glow Backlight */}
                <div className="absolute top-6 left-28 w-[200px] h-[170px] bg-emerald-500/10 rounded-2xl blur-xl pointer-events-none"></div>

                {/* Front Card (91% Score Resume) */}
                <div className={`absolute top-6 left-24 w-[184px] h-[184px] rounded-2xl border transition-all duration-300 p-4 shadow-2xl flex flex-col justify-between z-10 ${
                  theme === "dark"
                    ? "bg-[#181d2c] border-emerald-500/30 shadow-emerald-950/20"
                    : "bg-white border-emerald-300 shadow-emerald-500/10"
                }`}>
                  <div className="relative">
                    {/* 91% Badge */}
                    <span className="absolute top-0 right-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 uppercase tracking-widest leading-none shadow-sm class-pulse-slow">
                      91%
                    </span>
                    {/* Header block with glowing blue-purple avatar */}
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex-shrink-0 shadow-md shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[10px] text-white">
                        ✓
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className={`h-2 w-16 rounded ${theme === "dark" ? "bg-slate-600" : "bg-slate-400"}`}></div>
                        <div className={`h-1 w-10 rounded ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`}></div>
                      </div>
                    </div>
                  </div>
                  {/* Resume Content Lines with premium alignment */}
                  <div className="space-y-1.5">
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500/30 to-emerald-500/30 rounded"></div>
                    <div className={`h-1 w-11/12 rounded ${theme === "dark" ? "bg-slate-600/60" : "bg-slate-300"}`}></div>
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500/30 to-emerald-500/30 rounded"></div>
                    <div className={`h-1 w-10/12 rounded ${theme === "dark" ? "bg-slate-600/60" : "bg-slate-300"}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Plain compact header banner for non-builder workspace views */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              {activeTab === "ats" && (
                <>
                  <h2 className="text-lg font-bold tracking-tight">Applicant Tracking System Audit Desk</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Cross-examine text patterns directly against enterprise filter thresholds. Identify keyword omissions in milliseconds.</p>
                </>
              )}
              {activeTab === "pricing" && (
                <>
                  <h2 className="text-lg font-bold tracking-tight">Global Pricing Plans</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Flexible subscription packages for global applicants with local currency rates for Indian and foreign regions.</p>
                </>
              )}
              {activeTab === "docs" && (
                <>
                  <h2 className="text-lg font-bold tracking-tight">Project Engineering Specifications</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Technical workflow systems, target demographic profiles, key performance trackers, and roadmap documentation.</p>
                </>
              )}
            </div>

            <div className={`flex items-center gap-4 p-2 px-3 rounded-xl border text-xs ${
              theme === "dark" ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client Score: <strong className="font-bold text-emerald-500">98% Passed</strong></span>
              </div>
              <div className="w-px bg-slate-700/30 h-4"></div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Enterprise Compatible</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Body Stage Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        
        {/* Workspace views based on active nav selection */}
        {activeTab === "builder" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Form Builder & Section AI helpers */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                    Structure Parameters
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold border border-emerald-500/25 uppercase tracking-wider">
                    Draft Autosaved
                  </span>
                </div>
                <ResumeBuilder data={resumeData} onChange={setResumeData} />
              </div>

              {/* Right Column: Beautiful Live Paper Document rendering */}
              <div className="space-y-6 lg:sticky lg:top-[90px]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  Live Preview Sheet
                </h3>
                <ResumePreview data={resumeData} />
                
                <div className="print:hidden">
                  <GmailShare resumeData={resumeData} theme={theme} />
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "ats" && (
          <div className="animate-fade-in">
            <AtsChecker currentResumeData={resumeData} />
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="animate-fade-in">
            <Pricing subscribedPlanId={subscribedPlanId} onSubscribe={setSubscribedPlanId} />
          </div>
        )}

        {activeTab === "docs" && (
          <div className="animate-fade-in">
            <ArchitectureDocs />
          </div>
        )}

      </main>

      {/* Clean Global Footer (hidden during printing) */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 py-4 text-center text-xs text-slate-400 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 AI Resume Suite. Completely client-persisted & privacy guaranteed.</p>
          <div className="flex items-center gap-4 text-[10px] tracking-wider font-semibold text-slate-500 uppercase">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> AI Engine Online</div>
            <div>Latency: 24ms</div>
            <div className="text-blue-400">AISTUDIO Verified</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
