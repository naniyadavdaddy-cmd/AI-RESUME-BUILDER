import React, { useState } from "react";
import { ResumeData, AtsAnalysis } from "../types";
import { sampleJobDescription } from "../initialData";
import { 
  FileText, 
  TextQuote, 
  HelpCircle,
  Play, 
  CheckCircle2, 
  XSquare, 
  Plus, 
  Wand2, 
  BookOpen, 
  Gauge, 
  AlertTriangle, 
  Check, 
  Loader2,
  RefreshCw,
  Sparkles,
  ClipboardCheck,
  Building
} from "lucide-react";

interface AtsCheckerProps {
  currentResumeData: ResumeData;
}

export default function AtsChecker({ currentResumeData }: AtsCheckerProps) {
  // Convert current resume state into structured continuous plain-text representation for parsing
  const formatResumeToText = (data: ResumeData): string => {
    let text = `${data.fullName}\nEmail: ${data.email} | Phone: ${data.phone}\nLocation: ${data.location} | Link: ${data.website}\n\n`;
    text += `SUMMARY\n${data.summary}\n\n`;
    text += `EXPERIENCE\n`;
    data.experience.forEach(w => {
      text += `${w.position} at ${w.company || "Company"} (${w.startDate} - ${w.endDate})\n${w.description}\n\n`;
    });
    text += `SKILLS\n${data.skills.join(", ")}\n\n`;
    text += `EDUCATION\n`;
    data.education.forEach(e => {
      text += `${e.degree} in ${e.fieldOfStudy} - ${e.school} (${e.graduationDate})\n`;
    });
    return text;
  };

  const [resumeInput, setResumeInput] = useState(() => formatResumeToText(currentResumeData));
  
  // Read target job description with instant local storage fallbacks so the state flows beautifully
  const [jobDescriptionInput, setJobDescriptionInput] = useState(() => {
    return localStorage.getItem("ats_target_job_description") || sampleJobDescription;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);

  // Quick action: Pull live-typed status from the builder
  const syncFromBuilder = () => {
    const formatted = formatResumeToText(currentResumeData);
    setResumeInput(formatted);
  };

  const handleJobDescriptionChange = (text: string) => {
    setJobDescriptionInput(text);
    localStorage.setItem("ats_target_job_description", text);
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeInput.trim()) {
      setError("Please paste or sync your resume plain text first!");
      return;
    }
    if (!jobDescriptionInput.trim()) {
      setError("Please provide a target job description to match against.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/resume/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeInput,
          jobDescription: jobDescriptionInput
        }),
      });

      if (!res.ok) {
        let errMsg = "Audit failed. Ensure GEMINI_API_KEY secret is enabled.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = `Audit failed: ${errData.error}`;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const raw = await res.json();
      setAnalysis(raw);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during deep text comparison.");
    } finally {
      setLoading(false);
    }
  };

  // Helper colors for circular match score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-red-400 border-red-500/20 bg-red-500/10";
  };

  return (
    <div className="space-y-6">
      
      {/* Overview introduction */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/5 to-transparent pointer-events-none"></div>
        <div>
          <h3 className="font-bold text-lg text-white">AI Recruiting Engine Ingest (ATS Compliance Audit)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Applicant Tracking Systems act as automated filters for organizations. Paste your resume text, align key parameters, and discover critical optimization metrics to climb above recruiting benchmarks.
          </p>
        </div>
        <button
          id="btn-sync-resume"
          type="button"
          onClick={syncFromBuilder}
          className="flex items-center gap-1.5 text-xs text-blue-300 bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2 rounded-full font-semibold transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Current Builder Text
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input block - Left Hand Side */}
        <div className="space-y-5 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl">
          <form onSubmit={handleAudit} className="space-y-4">
            
            {/* Resume Plain Text Panel */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                <span>1. Resume text for matching analysis</span>
                <span className="text-[10px] text-slate-500 font-normal">Pasted or synced from Builder</span>
              </label>
              <textarea
                id="ats-resume-input"
                rows={8}
                placeholder="Insert plain-text resume representation here..."
                className="w-full text-xs font-mono bg-black/40 text-slate-200 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all leading-relaxed placeholder:text-slate-500"
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
              />
            </div>

            {/* Target Job Description Panel */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-300 block">
                2. Target Job Description
              </label>
              <textarea
                id="ats-job-input"
                rows={8}
                placeholder="Paste the target job description requirements here..."
                className="w-full text-xs bg-black/40 text-slate-200 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-all leading-relaxed placeholder:text-slate-500"
                value={jobDescriptionInput}
                onChange={(e) => handleJobDescriptionChange(e.target.value)}
              />
            </div>

            {/* Trigger Button */}
            <button
              id="btn-trigger-ats"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Calibrative ATS Scan in Progress...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white/90" />
                  <span>Execute Keyword & Formatting Match</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs text-red-300">
              <p className="font-semibold">Match Scan Interrupted</p>
              <p className="mt-0.5">{error}</p>
            </div>
          )}
        </div>

        {/* Audit Report - Right Hand Side */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-start">
          
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-200">Reviewing Resume Compliance...</p>
                <p className="text-xs text-slate-500 mt-1 italic">"Applying recursive lexical parsers against job requirement indexes"</p>
              </div>
            </div>
          )}

          {!loading && !analysis && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-blue-400 shadow-xl">
                <Gauge className="w-6 h-6" />
              </div>
              <div className="max-w-sm">
                <h4 className="font-bold text-slate-200 text-sm">Awaiting Compliance Execution</h4>
                <p className="text-xs text-slate-400 mt-1 lines leading-relaxed">
                  Provide your resume and job description on the left hand side, then run the algorithm to generate an interactive compliance scorecard here.
                </p>
              </div>
            </div>
          )}

          {!loading && analysis && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Radial scores row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111422]/60 rounded-xl p-4 border border-white/5 flex items-center gap-3 shadow-md">
                  <div className={`w-14 h-14 shrink-0 rounded-full border-4 flex items-center justify-center font-black text-sm md:text-md ${getScoreColorClass(analysis.matchScore)}`}>
                    {analysis.matchScore}%
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Match Grade</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">
                      {analysis.matchScore >= 80 ? "Interview Ready" : analysis.matchScore >= 60 ? "Requires Keyword Tuning" : "Risks Instant HR Filter"}
                    </p>
                  </div>
                </div>

                <div className="bg-[#111422]/60 rounded-xl p-4 border border-white/5 flex items-center gap-3 shadow-md">
                  <div className={`w-14 h-14 shrink-0 rounded-full border-4 flex items-center justify-center font-black text-sm md:text-md ${getScoreColorClass(analysis.readabilityScore)}`}>
                    {analysis.readabilityScore}%
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Readability Gauge</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">
                      {analysis.readabilityScore >= 80 ? "Excellent Flow" : "Dense Bullet Phrasing"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matched Keywords (New requested optimization presentation) */}
              <div className="space-y-3">
                <div className="border-b border-white/10 pb-1.5 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                    <span>Matched JD Keywords ({analysis.matchedKeywords?.length || 0})</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">A++ Scorecard</span>
                </div>
                {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.map((matchItem, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full shadow-sm"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {matchItem}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No keyword overlap detected. Inject related terms to clear database queries.</p>
                )}
              </div>

              {/* Priority Missing Keywords List */}
              <div className="space-y-3">
                <div className="border-b border-white/10 pb-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Missing Critical Keywords ({analysis.missingKeywords?.length || 0})
                  </h4>
                </div>
                {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.missingKeywords.map((tag, idx) => (
                      <div key={idx} className="p-2.5 bg-[#111422]/60 rounded-xl border border-white/10 text-xs flex justify-between gap-3 items-start animate-fade-in hover:border-yellow-500/20 transition-all">
                        <div>
                          <strong className="font-semibold text-white">{tag.keyword}</strong>
                          <span className="text-slate-400 block text-[10px] mt-0.5 leading-normal">{tag.tips}</span>
                        </div>
                        <span className={`text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-lg shrink-0 border ${
                          tag.importance === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          tag.importance === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-white/10 text-slate-300 border-white/10"
                        }`}>
                          {tag.importance}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400 italic">No critical vocabulary deficiencies found! High congruence.</p>
                )}
              </div>

              {/* Formatting Checks results */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-1.5">
                  ATS Structural Compatibility Audit
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.formattingChecks?.map((checkItem, idx) => (
                    <div key={idx} className="p-3 bg-[#111422]/60 rounded-xl border border-white/10 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{checkItem.check}</span>
                        {checkItem.passed ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Pass
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5 bg-red-500/10 px-1.5 py-0.5 rounded-lg border border-red-500/20">
                            <XSquare className="w-3 h-3 text-red-400" /> Action
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{checkItem.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Section breakdown review */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-1">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>Section Grading Notes</span>
                </h4>
                <div className="space-y-2.5 text-xs bg-[#111422]/60 p-3 rounded-xl border border-white/5">
                  <div className="flex gap-2 font-sans">
                    <span className="font-bold text-slate-400 w-24 shrink-0">Contacts block:</span>
                    <span className="text-slate-300">{analysis.sectionAnalysis?.contact}</span>
                  </div>
                  <div className="flex gap-2 font-sans border-t border-white/5 pt-2">
                    <span className="font-bold text-slate-400 w-24 shrink-0">Experience:</span>
                    <span className="text-slate-300">{analysis.sectionAnalysis?.experience}</span>
                  </div>
                  <div className="flex gap-2 font-sans border-t border-white/5 pt-2">
                    <span className="font-bold text-slate-400 w-24 shrink-0">Core Skills:</span>
                    <span className="text-slate-300">{analysis.sectionAnalysis?.skills}</span>
                  </div>
                  <div className="flex gap-2 font-sans border-t border-white/5 pt-2">
                    <span className="font-bold text-slate-400 w-24 shrink-0">Education:</span>
                    <span className="text-slate-300">{analysis.sectionAnalysis?.education}</span>
                  </div>
                </div>
              </div>

              {/* Critical fixes list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Critical Priority Work Items</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.criticalFixes?.map((fix, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-300 leading-relaxed">
                      <span className="p-1 px-2.5 bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded font-bold">{idx + 1}</span>
                      <p className="mt-0.5">{fix}</p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
