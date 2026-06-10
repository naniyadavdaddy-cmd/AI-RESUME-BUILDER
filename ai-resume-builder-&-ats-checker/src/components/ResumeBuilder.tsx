import React, { useState } from "react";
import { ResumeData, WorkExperience, Education, TemplateType, FontFamily, ColorScheme, SectionId } from "../types";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles, 
  Plus, 
  Trash2, 
  Lightbulb, 
  Check, 
  Loader2,
  BookmarkPlus,
  Briefcase,
  GraduationCap,
  Wand2,
  Palette,
  Type as FontIcon,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  CheckCircle2,
  ListOrdered,
  GripVertical
} from "lucide-react";

interface ResumeBuilderProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export default function ResumeBuilder({ data, onChange }: ResumeBuilderProps) {
  // Ensure default customizable properties are initialized properly in local state
  const templateType = data.templateType || "classic";
  const fontFamily = data.fontFamily || "sans";
  const colorScheme = data.colorScheme || "slate";
  const fontSize = data.fontSize || "base";
  const sectionOrder = data.sectionOrder || ["summary", "experience", "skills", "education"];

  // AI Suggestions State
  const [activeAiSection, setActiveAiSection] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<{
    suggestions: string[];
    actionVerbs: string[];
    keySkills: string[];
    coachingTip: string;
  } | null>(null);

  const [aiTone, setAiTone] = useState("Professional & Results-focused");
  // Pre-load from localStorage if available, otherwise default
  const [aiJobDescription, setAiJobDescription] = useState(() => {
    return localStorage.getItem("ats_target_job_description") || "";
  });
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [tempSkill, setTempSkill] = useState("");

  // In-place inline quick-rewrite state for career summary/experience fields
  const [rewritingField, setRewritingField] = useState<string | null>(null);

  // Drag and drop state for experience and education
  const [draggedExpIndex, setDraggedExpIndex] = useState<number | null>(null);
  const [draggedEduIndex, setDraggedEduIndex] = useState<number | null>(null);
  const [isGrippedExp, setIsGrippedExp] = useState<number | null>(null);
  const [isGrippedEdu, setIsGrippedEdu] = useState<number | null>(null);

  const handleDragStartExp = (e: React.DragEvent, index: number) => {
    setDraggedExpIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverExp = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === targetIndex) return;
    
    // Sort items on drag-over for an interactive, immediate feedback loop
    const updated = [...data.experience];
    const item = updated[draggedExpIndex];
    updated.splice(draggedExpIndex, 1);
    updated.splice(targetIndex, 0, item);
    
    setDraggedExpIndex(targetIndex);
    updateField("experience", updated);
  };

  const handleDragEndExp = () => {
    setDraggedExpIndex(null);
    setIsGrippedExp(null);
  };

  const handleDragStartEdu = (e: React.DragEvent, index: number) => {
    setDraggedEduIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverEdu = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedEduIndex === null || draggedEduIndex === targetIndex) return;
    
    const updated = [...data.education];
    const item = updated[draggedEduIndex];
    updated.splice(draggedEduIndex, 1);
    updated.splice(targetIndex, 0, item);
    
    setDraggedEduIndex(targetIndex);
    updateField("education", updated);
  };

  const handleDragEndEdu = () => {
    setDraggedEduIndex(null);
    setIsGrippedEdu(null);
  };

  // Keyboard/accessible fallback reorder methods
  const moveWork = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.experience.length) return;
    const updated = [...data.experience];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateField("experience", updated);
  };

  const moveEdu = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.education.length) return;
    const updated = [...data.education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateField("education", updated);
  };

  const handleInlineRewrite = async (fieldKey: string, currentValue: string, index?: number) => {
    if (!currentValue || !currentValue.trim()) {
      alert("Please type a draft or draft paragraph first before asking the AI to rewrite!");
      return;
    }

    setRewritingField(fieldKey);
    try {
      const res = await fetch("/api/resume/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: currentValue,
          sectionType: fieldKey.startsWith("experience") ? "experience" : "summary"
        })
      });

      if (!res.ok) {
        let errMsg = "AI Rewrite service was unable to execute. Please verify GEMINI_API_KEY.";
        try {
          const errData = await res.json();
          if (errData && errData.error) errMsg = `AI Rewrite: ${errData.error}`;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const decoded = await res.json();
      if (decoded && decoded.rewrittenText) {
        if (fieldKey === "summary") {
          updateField("summary", decoded.rewrittenText);
        } else if (fieldKey.startsWith("experience") && typeof index === "number") {
          handleWorkChange(index, "description", decoded.rewrittenText);
        }
      }
    } catch (err: any) {
      console.error("[Inline Rewrite Error]:", err);
      alert(err.message || "Something went wrong. Please check API Key credentials and try again.");
    } finally {
      setRewritingField(null);
    }
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleWorkChange = (index: number, field: keyof WorkExperience, value: string) => {
    const updatedWork = [...data.experience];
    updatedWork[index] = { ...updatedWork[index], [field]: value };
    updateField("experience", updatedWork);
  };

  const addWork = () => {
    const newWork: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "New Company",
      position: "New Position",
      startDate: "2024-01",
      endDate: "Present",
      description: "Describe your achievements here..."
    };
    updateField("experience", [...data.experience, newWork]);
  };

  const deleteWork = (id: string) => {
    updateField("experience", data.experience.filter(w => w.id !== id));
  };

  const handleEduChange = (index: number, field: keyof Education, value: string) => {
    const updatedEdu = [...data.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    updateField("education", updatedEdu);
  };

  const addEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: "New University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2024"
    };
    updateField("education", [...data.education, newEdu]);
  };

  const deleteEdu = (id: string) => {
    updateField("education", data.education.filter(e => e.id !== id));
  };

  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (cleaned && !data.skills.includes(cleaned)) {
      updateField("skills", [...data.skills, cleaned]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateField("skills", data.skills.filter(s => s !== skillToRemove));
  };

  // Up/Down tactical ordering handlers
  const handleMoveSection = (sectionId: SectionId, direction: "up" | "down") => {
    const index = sectionOrder.indexOf(sectionId);
    if (index === -1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    updateField("sectionOrder", newOrder);
  };

  const triggerSearchSuggestions = async (sectionKey: string, initialDraft: string) => {
    if (!initialDraft || !initialDraft.trim()) {
      setAiError("Please type a short draft or bullet description first so the AI has context to enhance!");
      return;
    }

    setActiveAiSection(sectionKey);
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const res = await fetch("/api/resume/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: initialDraft,
          sectionType: sectionKey,
          tone: aiTone,
          targetRole: targetRole,
          jobDescription: aiJobDescription // Send dynamic job description for customized alignment!
        }),
      });

      if (!res.ok) {
        let errMsg = "Failed to secure AI content suggestions. Ensure GEMINI_API_KEY is configured.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = `AI Optimization Error: ${errData.error}`;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const fileJson = await res.json();
      setAiResponse(fileJson);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Something went wrong during suggested bullet optimization.");
    } finally {
      setAiLoading(false);
    }
  };

  const applyRewrite = (sectionKey: string, newValue: string, index?: number) => {
    if (sectionKey === "summary") {
      updateField("summary", newValue);
    } else if (sectionKey === "experience" && typeof index === "number") {
      handleWorkChange(index, "description", newValue);
    }
    // Close the assist drawer on perfect application
    setActiveAiSection(null);
    setAiResponse(null);
  };

  const syncJobDescriptionFromLocals = () => {
    const jd = localStorage.getItem("ats_target_job_description") || "";
    if (jd) {
      setAiJobDescription(jd);
    } else {
      alert("No Job Description found in the ATS Auditor. Please enter it there first, or write it directly below!");
    }
  };

  // Section Label Map for ordering readable strings
  const getSectionLabel = (secId: SectionId) => {
    switch (secId) {
      case "summary": return "Professional Overview";
      case "experience": return "Employment Chronicles";
      case "skills": return "Core Technical Skills";
      case "education": return "Academic Background";
      default: return secId;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Inputs Workspace Form - takes 2/3 of space on wide displays */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* APPEARANCE CUSTOMIZER BLOCK (NEW) */}
        <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 p-5 rounded-2xl shadow-xl space-y-5 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
              Template Themes & Custom Ordering
            </h3>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 active:scale-95 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest self-start">
              ✓ 100% ATS Compatible
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* Template select options */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
                <span>Choose Visual Template layout</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "classic", label: "Classic Pro", desc: "Centered, Traditional" },
                  { id: "modern", label: "Modern Left", desc: "Left border offset" },
                  { id: "executive", label: "Executive Pro", desc: "Bold header block" },
                  { id: "tech", label: "Tech Mono", desc: "Developer tag style" },
                  { id: "minimalist", label: "Compact Mini", desc: "Optimized fit A4" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField("templateType", item.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      templateType === item.id 
                        ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-black/30 border-white/10 text-slate-300 hover:bg-black/40 hover:border-white/15"
                    }`}
                  >
                    <span className="font-bold block text-[11px]">{item.label}</span>
                    <span className="text-[9px] text-slate-550 group-hover:text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography & Accent Colors block */}
            <div className="space-y-4">
              
              {/* Fonts choice */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                  <FontIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Typography Font</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "sans", label: "Inter (Sans)", preview: "Aa sans" },
                    { id: "serif", label: "Georgia (Serif)", preview: "Aa serif" },
                    { id: "mono", label: "JetBrains (Mono)", preview: "Aa mono" },
                    { id: "elegant", label: "Outfit (Elegant)", preview: "Aa elegant" }
                  ].map((fm) => (
                    <button
                      key={fm.id}
                      type="button"
                      onClick={() => updateField("fontFamily", fm.id)}
                      className={`py-1.5 px-3 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                        fontFamily === fm.id
                          ? "bg-blue-600/10 border-blue-500 text-blue-300"
                          : "bg-black/25 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] font-medium">{fm.label}</span>
                      <span className="text-[10px] font-mono text-slate-500 text-right">{fm.preview.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector Colors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Accent Styling Color</label>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5">
                  {[
                    { id: "slate", bg: "bg-slate-700", label: "Slate" },
                    { id: "navy", bg: "bg-blue-800", label: "Navy" },
                    { id: "emerald", bg: "bg-emerald-800", label: "Emerald" },
                    { id: "burgundy", bg: "bg-rose-900", label: "Burgundy" },
                    { id: "charcoal", bg: "bg-zinc-900", label: "Charcoal" }
                  ].map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      title={col.label}
                      onClick={() => updateField("colorScheme", col.id)}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${col.bg} ${
                        colorScheme === col.id 
                          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0f111a] scale-110" 
                          : "border-white/10 hover:scale-105"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 capitalize font-semibold ml-auto pr-1">Active: {colorScheme}</span>
                </div>
              </div>

              {/* Font Size Selector scale */}
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5 select-none text-left">
                  <span className="text-[11px] font-bold font-mono bg-blue-500/10 text-blue-400 px-1 rounded">A±</span>
                  <span>Document Font Size Scale</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-black/30 p-1.5 rounded-xl border border-white/5">
                  {[
                    { id: "sm", label: "Compact", size: "Compact" },
                    { id: "base", label: "Regular", size: "Standard" },
                    { id: "md", label: "Medium", size: "Medium" },
                    { id: "lg", label: "Large", size: "Readable" }
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => updateField("fontSize", sz.id)}
                      className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                        fontSize === sz.id
                          ? "bg-blue-605 bg-blue-600/15 border border-blue-500 text-blue-300"
                          : "bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-[10px] font-bold">{sz.label}</span>
                      <span className="text-[8px] opacity-60 font-mono mt-0.5">{sz.size}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Collapsible/tactical custom ordering lists */}
          <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 block">
              <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
              <span>Section layout hierarchy & order</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
              {sectionOrder.map((sec, idx) => (
                <div 
                  key={sec} 
                  className="bg-white/5 p-2 px-3 rounded-lg border border-white/5 flex items-center justify-between text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-bold font-mono">0{idx + 1}.</span>
                    <span className="font-medium text-slate-300">{getSectionLabel(sec)}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(sec, "up")}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sectionOrder.length - 1}
                      onClick={() => handleMoveSection(sec, "down")}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Personal Details Profile */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2.5">
            <User className="w-5 h-5 text-blue-400" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
              <input
                id="form-fullname"
                type="text"
                placeholder="Alex Rivera"
                className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                value={data.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Job Title Target</label>
              <input
                id="form-targetrole"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Connection</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="form-email"
                  type="email"
                  placeholder="alex@email.com"
                  className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 pl-9 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                  value={data.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="form-phone"
                  type="text"
                  placeholder="(555) 012-3456"
                  className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 pl-9 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Location / Office</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="form-location"
                  type="text"
                  placeholder="San Francisco, CA"
                  className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 pl-9 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                  value={data.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Portfolio link / LinkedIn</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="form-website"
                  type="text"
                  placeholder="linkedin.com/in/username"
                  className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-2.5 pl-9 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                  value={data.website}
                  onChange={(e) => updateField("website", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Professional Biography
            </h3>
            <div className="flex items-center gap-2">
              <button
                id="btn-inline-rewrite-summary"
                type="button"
                disabled={rewritingField === "summary"}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all border cursor-pointer ${
                  rewritingField === "summary"
                    ? "bg-purple-550/20 border-purple-500/30 text-purple-300"
                    : "text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/25"
                }`}
                onClick={() => handleInlineRewrite("summary", data.summary)}
              >
                {rewritingField === "summary" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Rewrite with AI</span>
                  </>
                )}
              </button>
              <button
                id="ai-suggest-summary"
                type="button"
                className="flex items-center gap-1.5 text-xs text-blue-300 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer"
                onClick={() => triggerSearchSuggestions("summary", data.summary)}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                AI Tool Options
              </button>
            </div>
          </div>
          <div>
            <textarea
              id="form-summary"
              rows={4}
              placeholder="Detail your overarching achievements, focus domains, and professional experience trajectory..."
              className="w-full text-sm bg-black/30 text-white border border-white/15 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-sans leading-relaxed placeholder:text-slate-500"
              value={data.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </div>
        </div>

        {/* Employment History list */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Professional Experience
            </h3>
            <button
              id="btn-add-work"
              type="button"
              onClick={addWork}
              className="flex items-center gap-1 text-xs text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-full font-semibold transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Position
            </button>
          </div>
          <div className="space-y-6">
            {data.experience.map((work, index) => {
              const isDragging = draggedExpIndex === index;
              const isGripActive = isGrippedExp === index;
              return (
                <div
                  key={work.id}
                  draggable={isGripActive}
                  onDragStart={(e) => handleDragStartExp(e, index)}
                  onDragOver={(e) => handleDragOverExp(e, index)}
                  onDragEnd={handleDragEndExp}
                  className={`p-4 rounded-xl border space-y-3 relative group text-left transition-all duration-200 ${
                    isDragging
                      ? "bg-purple-500/10 border-dashed border-purple-500/50 opacity-40 scale-[0.98]"
                      : "bg-white/2 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {/* Drag Handle */}
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-purple-300 cursor-grab active:cursor-grabbing rounded-lg hover:bg-white/10 transition-colors"
                      onMouseDown={() => setIsGrippedExp(index)}
                      onMouseUp={() => setIsGrippedExp(null)}
                      onMouseLeave={() => setIsGrippedExp(null)}
                      title="Drag to reorder section items"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Fallback Move Up */}
                    <button
                      type="button"
                      onClick={() => moveWork(index, "up")}
                      disabled={index === 0}
                      title="Move Up"
                      className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                        index === 0 ? "text-slate-650 cursor-not-allowed" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* Fallback Move Down */}
                    <button
                      type="button"
                      onClick={() => moveWork(index, "down")}
                      disabled={index === data.experience.length - 1}
                      title="Move Down"
                      className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                        index === data.experience.length - 1 ? "text-slate-650 cursor-not-allowed" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      id={`btn-delete-work-${index}`}
                      type="button"
                      onClick={() => deleteWork(work.id)}
                      title="Remove experience block"
                      className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 pr-28">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Company / Corporate Entity</label>
                    <input
                      id={`form-work-company-${index}`}
                      type="text"
                      className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 text-left"
                      value={work.company}
                      onChange={(e) => handleWorkChange(index, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Job Title</label>
                    <input
                      id={`form-work-position-${index}`}
                      type="text"
                      className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 text-left"
                      value={work.position}
                      onChange={(e) => handleWorkChange(index, "position", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Start Date</label>
                    <input
                      id={`form-work-start-${index}`}
                      type="text"
                      placeholder="YYYY-MM"
                      className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 placeholder:text-slate-650 text-left"
                      value={work.startDate}
                      onChange={(e) => handleWorkChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">End Date</label>
                    <input
                      id={`form-work-end-${index}`}
                      type="text"
                      placeholder="YYYY-MM or Present"
                      className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 placeholder:text-slate-650 text-left"
                      value={work.endDate}
                      onChange={(e) => handleWorkChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Achievements & Work Details</label>
                    <div className="flex items-center gap-2.5">
                      <button
                        id={`btn-inline-rewrite-work-${index}`}
                        type="button"
                        disabled={rewritingField === `experience-${index}`}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                          rewritingField === `experience-${index}`
                            ? "text-purple-400 animate-pulse"
                            : "text-purple-300 hover:text-purple-200"
                        }`}
                        onClick={() => handleInlineRewrite(`experience-${index}`, work.description, index)}
                      >
                        {rewritingField === `experience-${index}` ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Rewriting...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3 h-3 text-purple-300" />
                            <span className="text-purple-300">Rewrite with AI</span>
                          </>
                        )}
                      </button>
                      <button
                        id={`ai-suggest-work-${index}`}
                        type="button"
                        className="flex items-center gap-1 text-[11px] text-blue-450 hover:text-blue-300 font-bold cursor-pointer"
                        onClick={() => triggerSearchSuggestions(`experience-${index}`, work.description)}
                      >
                        <Sparkles className="w-3 h-3" /> AI Refine Bullets
                      </button>
                    </div>
                  </div>
                  <textarea
                    id={`form-work-desc-${index}`}
                    rows={4}
                    className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2.5 outline-none focus:border-blue-500 font-sans leading-relaxed text-left"
                    value={work.description}
                    onChange={(e) => handleWorkChange(index, "description", e.target.value)}
                  />
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Professional Skills Tagging block */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2.5">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            Skills & Core Competencies
          </h3>
          <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-black/30 rounded-xl border border-white/10 text-left">
            {data.skills.length === 0 ? (
              <span className="text-xs text-slate-500 self-center">No skills tagged yet. Add them below!</span>
            ) : (
              data.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white/10 border border-white/10 text-white rounded-full group shadow-sm hover:bg-white/15 transition-all text-left"
                >
                  {skill}
                  <button
                    id={`btn-remove-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-red-400 font-bold transition-colors cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>
          <div className="flex gap-2 text-xs">
            <input
              id="form-addskill"
              type="text"
              placeholder="e.g. Kubernetes, React, D3.js"
              className="text-sm flex-1 bg-black/30 text-white border border-white/15 rounded-xl p-2.5 focus:border-blue-500 outline-none placeholder:text-slate-500 text-left"
              value={tempSkill}
              onChange={(e) => setTempSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(tempSkill);
                  setTempSkill("");
                }
              }}
            />
            <button
              id="btn-addskill"
              type="button"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs"
              onClick={() => {
                addSkill(tempSkill);
                setTempSkill("");
              }}
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Education Background */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Education History
            </h3>
            <button
              id="btn-add-edu"
              type="button"
              onClick={addEdu}
              className="flex items-center gap-1 text-xs text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-full font-semibold transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add School
            </button>
          </div>
          <div className="space-y-4">
            {data.education.map((edu, index) => {
              const isDragging = draggedEduIndex === index;
              const isGripActive = isGrippedEdu === index;
              return (
                <div
                  key={edu.id}
                  draggable={isGripActive}
                  onDragStart={(e) => handleDragStartEdu(e, index)}
                  onDragOver={(e) => handleDragOverEdu(e, index)}
                  onDragEnd={handleDragEndEdu}
                  className={`p-4 rounded-xl border space-y-3 relative text-left transition-all duration-200 ${
                    isDragging
                      ? "bg-purple-500/10 border-dashed border-purple-500/50 opacity-40 scale-[0.98]"
                      : "bg-white/2 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    {/* Drag Handle */}
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-purple-300 cursor-grab active:cursor-grabbing rounded-lg hover:bg-white/10 transition-colors"
                      onMouseDown={() => setIsGrippedEdu(index)}
                      onMouseUp={() => setIsGrippedEdu(null)}
                      onMouseLeave={() => setIsGrippedEdu(null)}
                      title="Drag to reorder section items"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Fallback Move Up */}
                    <button
                      type="button"
                      onClick={() => moveEdu(index, "up")}
                      disabled={index === 0}
                      title="Move Up"
                      className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                        index === 0 ? "text-slate-650 cursor-not-allowed" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* Fallback Move Down */}
                    <button
                      type="button"
                      onClick={() => moveEdu(index, "down")}
                      disabled={index === data.education.length - 1}
                      title="Move Down"
                      className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                        index === data.education.length - 1 ? "text-slate-650 cursor-not-allowed" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      id={`btn-delete-edu-${index}`}
                      type="button"
                      onClick={() => deleteEdu(edu.id)}
                      className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-28">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">School / Alma Mater</label>
                      <input
                        id={`form-edu-school-${index}`}
                        type="text"
                        className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 text-left"
                        value={edu.school}
                        onChange={(e) => handleEduChange(index, "school", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Degree achieved</label>
                      <input
                        id={`form-edu-degree-${index}`}
                        type="text"
                        className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 text-left"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(index, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Field of Study</label>
                      <input
                        id={`form-edu-field-${index}`}
                        type="text"
                        className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 text-left"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEduChange(index, "fieldOfStudy", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 text-left">Graduation Year</label>
                      <input
                        id={`form-edu-grad-${index}`}
                        type="text"
                        placeholder="e.g. 2021"
                        className="w-full text-sm bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 placeholder:text-slate-650 text-left"
                        value={edu.graduationDate}
                        onChange={(e) => handleEduChange(index, "graduationDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* AI SUGGESTION CO-PILOT SIDE PANEL — 3rd column */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-slate-100 p-5 rounded-2xl shadow-2xl sticky top-6 text-left">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <h4 className="font-bold text-sm text-white">AI Content Assistant</h4>
          </div>

          {/* Configuration controls */}
          <div className="space-y-3 mb-4 p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-left">
            <div>
              <label className="block text-slate-450 font-bold text-[10px] uppercase tracking-wider mb-1">Target Persona Tone</label>
              <select
                id="ai-tone-select"
                className="w-full bg-[#131622] border border-white/10 rounded-lg p-1.5 focus:border-blue-500 outline-none text-white cursor-pointer"
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
              >
                <option value="Metric & Achievement Oriented (X-Y-Z)">Metric & Achievement (STAR)</option>
                <option value="Executive & High-Impact Leadership">Executive Leadership</option>
                <option value="Creative & Modern Developer">Creative & Tech-savvy</option>
                <option value="Standard Formal Academic">Conservative Formal</option>
              </select>
            </div>

            {/* NEW: Job Description input in sidebar for tailoring! */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <span>Target Job Description</span>
                <button
                  type="button"
                  onClick={syncJobDescriptionFromLocals}
                  className="text-[9.5px]/none text-blue-400 hover:text-blue-300 font-bold lowercase tracking-normal flex items-center gap-0.5 cursor-pointer"
                  title="Retrieves target job posting text parameters configured in the ATS Auditor tab"
                >
                  ⚡ sync from auditor
                </button>
              </div>
              <textarea
                id="ai-jd-sidebar-input"
                rows={4}
                value={aiJobDescription}
                onChange={(e) => {
                  setAiJobDescription(e.target.value);
                  localStorage.setItem("ats_target_job_description", e.target.value);
                }}
                placeholder="Pasting the target job description here helps the AI rewrite bullets tailored to exact keyword and verb matches..."
                className="w-full text-[10.5px] font-sans bg-[#131622] text-slate-350 border border-white/10 rounded-lg p-2 focus:border-blue-500 font-normal outline-none max-h-24 resize-none leading-relaxed placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Active section monitor */}
          {activeAiSection ? (
            <div className="space-y-4">
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-[11px] text-blue-300 flex justify-between items-center">
                <span>Optimizing: <strong className="font-bold uppercase text-white">{activeAiSection.split("-")[0]}</strong></span>
                <button 
                  type="button" 
                  onClick={() => { setActiveAiSection(null); setAiResponse(null); }}
                  className="text-slate-500 hover:text-white font-bold select-none text-xs"
                >
                  ✕ Cancel
                </button>
              </div>

              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <span className="text-xs text-slate-400">Tuning bullet benchmarks...</span>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs text-red-300 space-y-1">
                  <span className="font-semibold block">Generation Interrupted</span>
                  <p>{aiError}</p>
                </div>
              )}

              {aiResponse && (
                <div className="space-y-5 animate-fade-in text-xs">
                  
                  {/* Suggestions rewrites List */}
                  <div className="space-y-3">
                    <span className="font-bold text-[10px] tracking-wider text-slate-400 uppercase block">Tailored AI Bullet Options</span>
                    {aiResponse.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/10 hover:border-blue-500/40 transition-all space-y-2">
                        <p className="text-slate-200 italic leading-relaxed font-sans">"{suggestion}"</p>
                        <button
                          id={`btn-apply-suggestion-${idx}`}
                          type="button"
                          className="w-full flex items-center justify-center gap-1 py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                          onClick={() => {
                            if (activeAiSection === "summary") {
                              applyRewrite("summary", suggestion);
                            } else if (activeAiSection.startsWith("experience")) {
                              const match = activeAiSection.match(/\d+/);
                              if (match) {
                                applyRewrite("experience", suggestion, parseInt(match[0], 10));
                              }
                            }
                          }}
                        >
                          <Check className="w-3 h-3" /> Insert Into Resume
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Power Action Verbs suggestions */}
                  {aiResponse.actionVerbs && aiResponse.actionVerbs.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-[10px] tracking-wider text-slate-400 uppercase block">Suggested Power Action Verbs</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiResponse.actionVerbs.map(verb => (
                          <span key={verb} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/20 font-mono text-[10px]">
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended keywords list */}
                  {aiResponse.keySkills && aiResponse.keySkills.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-[10px] tracking-wider text-slate-400 uppercase block">High-Parsing Recommended Skills</span>
                      <div className="space-y-1.5">
                        {aiResponse.keySkills.map(skill => {
                          const isAlreadyAdded = data.skills.includes(skill);
                          return (
                            <div key={skill} className="flex justify-between items-center bg-black/40 p-1.5 rounded-lg border border-white/10">
                              <span className="font-semibold text-slate-200 ml-1">{skill}</span>
                              {isAlreadyAdded ? (
                                <span className="text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded-md">Added</span>
                              ) : (
                                <button
                                  id={`btn-add-copilot-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                                  type="button"
                                  onClick={() => addSkill(skill)}
                                  className="flex items-center gap-0.5 text-[9px] text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider cursor-pointer"
                                >
                                  <BookmarkPlus className="w-3" /> Insert Tag
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Specialized coaching tip */}
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-slate-200 space-y-1 text-left">
                    <span className="font-bold text-emerald-400 tracking-wider uppercase text-[9px] block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Smart Content Enhancement Tip</span>
                    </span>
                    <p className="leading-relaxed font-sans">{aiResponse.coachingTip}</p>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto text-blue-400 border border-white/10">
                <Wand2 className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                Click <span className="font-mono text-blue-300">Optimize Summary</span> or <span className="font-mono text-blue-300 font-bold">AI Refine Bullets</span> in options to load instant suggestions tailored to your job targets.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
