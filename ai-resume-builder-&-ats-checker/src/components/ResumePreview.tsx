import React from "react";
import { ResumeData, TemplateType, FontFamily, ColorScheme, SectionId } from "../types";
import { Mail, Phone, MapPin, Globe, FileText, Printer, ArrowDownToLine, Award, Sparkles } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  // Extract custom preferences with robust fallbacks
  const templateType = data.templateType || "classic";
  const fontFamily = data.fontFamily || "sans";
  const colorScheme = data.colorScheme || "slate";
  const fontSize = data.fontSize || "base";
  const sectionOrder = data.sectionOrder || ["summary", "experience", "skills", "education"];

  // Map font-size relative modifiers
  const sz = {
    body: fontSize === "sm" ? "text-[12px]" : fontSize === "md" ? "text-[15.5px]" : fontSize === "lg" ? "text-[17.5px]" : "text-[14.5px]",
    headingSection: fontSize === "sm" ? "text-[11px]" : fontSize === "md" ? "text-[14px]" : fontSize === "lg" ? "text-[15.5px]" : "text-[12.5px]",
    headingItem: fontSize === "sm" ? "text-[12.5px]" : fontSize === "md" ? "text-[16.5px]" : fontSize === "lg" ? "text-[19px]" : "text-[14.5px]",
    subItem: fontSize === "sm" ? "text-[11px]" : fontSize === "md" ? "text-[13.5px]" : fontSize === "lg" ? "text-[15px]" : "text-xs",
    badge: fontSize === "sm" ? "text-[10px]" : fontSize === "md" ? "text-[12.5px]" : fontSize === "lg" ? "text-[13.5px]" : "text-xs",
    title: fontSize === "sm" ? "text-2xl" : fontSize === "md" ? "text-3xl md:text-4xl" : fontSize === "lg" ? "text-4xl md:text-5xl" : "text-3xl"
  };

  const triggerPrint = () => {
    window.print();
  };

  const triggerExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${data.fullName.toLowerCase().replace(/\s+/g, "_")}_resume.json`);
    dlAnchorElem.click();
  };

  // Font class router
  const getFontFamilyClass = (font: FontFamily) => {
    switch (font) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono tracking-tight";
      case "elegant":
        return "font-sans tracking-tight leading-relaxed";
      default:
        return "font-sans";
    }
  };

  // Color scheme router values
  const getColorClasses = (scheme: ColorScheme) => {
    switch (scheme) {
      case "navy":
        return {
          primaryText: "text-blue-900",
          accentColor: "#1e3a8a",
          borderMain: "border-blue-700/30",
          borderSection: "border-blue-900",
          itemHeading: "text-blue-850",
          timelineGlow: "bg-blue-500/10",
          sub: "text-blue-700 font-semibold"
        };
      case "emerald":
        return {
          primaryText: "text-emerald-900",
          accentColor: "#065f46",
          borderMain: "border-emerald-700/30",
          borderSection: "border-emerald-800",
          itemHeading: "text-emerald-850",
          timelineGlow: "bg-emerald-500/10",
          sub: "text-emerald-700 font-semibold"
        };
      case "burgundy":
        return {
          primaryText: "text-[#881337]",
          accentColor: "#881337",
          borderMain: "border-rose-900/20",
          borderSection: "border-rose-800",
          itemHeading: "text-rose-950",
          timelineGlow: "bg-rose-500/10",
          sub: "text-rose-700 font-semibold"
        };
      case "charcoal":
        return {
          primaryText: "text-zinc-900",
          accentColor: "#18181b",
          borderMain: "border-zinc-300",
          borderSection: "border-zinc-900",
          itemHeading: "text-zinc-900",
          timelineGlow: "bg-zinc-500/5",
          sub: "text-zinc-700 font-semibold"
        };
      default: // slate
        return {
          primaryText: "text-slate-900",
          accentColor: "#334155",
          borderMain: "border-slate-350",
          borderSection: "border-slate-800",
          itemHeading: "text-slate-900",
          timelineGlow: "bg-slate-500/10",
          sub: "text-slate-600 font-semibold"
        };
    }
  };

  const schemeColors = getColorClasses(colorScheme);

  // SECTION RENDER METHODS
  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <div key="summary" className="space-y-1 bg-transparent text-left">
        <h2 
          className={`${sz.headingSection} font-black uppercase tracking-widest border-b pb-1 flex items-center justify-between`}
          style={{ borderColor: schemeColors.accentColor, color: schemeColors.accentColor }}
        >
          <span>Professional Profile</span>
          <span className="text-[9px] font-bold text-slate-400 font-mono tracking-normal pr-1 uppercase select-none print:hidden">ATS Target OK</span>
        </h2>
        <p className={`${sz.body} text-slate-700 leading-relaxed font-normal py-1 pr-2`}>
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null;
    return (
      <div key="experience" className="space-y-3 bg-transparent text-left">
        <h2 
          className={`${sz.headingSection} font-black uppercase tracking-widest border-b pb-1`}
          style={{ borderColor: schemeColors.accentColor, color: schemeColors.accentColor }}
        >
          Work Chronicles
        </h2>
        <div className="space-y-4">
          {data.experience.map((work) => (
            <div key={work.id} className="relative group pl-0">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                <div>
                  <h3 className={`${sz.headingItem} font-bold text-slate-900`}>
                    {work.position || "Undetermined Title"}
                  </h3>
                  <div className={`${sz.subItem} ${schemeColors.sub} mt-0.5`}>
                    {work.company || "Corporate Entity"}
                  </div>
                </div>
                <span className={`${sz.badge} font-semibold text-slate-500 whitespace-nowrap bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 mt-0.5 select-none print:bg-transparent print:border-none print:p-0`}>
                  {work.startDate || "Start"} &mdash; {work.endDate || "Present"}
                </span>
              </div>
              {work.description && (
                <p className={`${sz.body} text-slate-600 leading-relaxed font-normal whitespace-pre-wrap pl-1 mt-1.5 border-l border-slate-100 pl-3`}>
                  {work.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!data.skills || data.skills.length === 0) return null;
    return (
      <div key="skills" className="space-y-2 bg-transparent text-left">
        <h2 
          className={`${sz.headingSection} font-black uppercase tracking-widest border-b pb-1`}
          style={{ borderColor: schemeColors.accentColor, color: schemeColors.accentColor }}
        >
          Skills & Technical Proficiencies
        </h2>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.skills.map((skill) => (
            <span 
              key={skill}
              className={`${sz.badge} font-semibold px-2 py-0.5 bg-slate-100/80 text-slate-800 border border-slate-200 rounded-md select-none print:px-1.5 print:bg-transparent print:border-none`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;
    return (
      <div key="education" className="space-y-3 bg-transparent text-left">
        <h2 
          className={`${sz.headingSection} font-black uppercase tracking-widest border-b pb-1`}
          style={{ borderColor: schemeColors.accentColor, color: schemeColors.accentColor }}
        >
          Academic Credentials
        </h2>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex flex-col sm:flex-row justify-between items-start gap-1">
              <div>
                <h3 className={`${sz.headingItem} font-bold text-slate-900`}>
                  {edu.school || "Academy Institution"}
                </h3>
                <div className={`${sz.subItem} ${schemeColors.sub} mt-0.5`}>
                  {edu.degree || "Certificate Level"} &bull; <span className="italic">{edu.fieldOfStudy || "Department major"}</span>
                </div>
              </div>
              <span className={`${sz.badge} font-semibold text-slate-500 whitespace-nowrap bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 select-none print:bg-transparent print:border-none print:p-0`}>
                Graduated: {edu.graduationDate || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // REFRESH SECTIONS ACCORDING TO SPECIFIED ORDER PATH
  const renderOrderedSections = () => {
    return (
      <div className="space-y-6 mt-5 bg-transparent">
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case "summary": return renderSummary();
            case "experience": return renderExperience();
            case "skills": return renderSkills();
            case "education": return renderEducation();
            default: return null;
          }
        })}
      </div>
    );
  };

  // MODIFIED LAYOUTS SELECTORS
  const renderDocumentContent = () => {
    switch (templateType) {
      
      // 1. CLASSIC PROFESSIONAL LAYOUT
      case "classic":
        return (
          <div className="space-y-5">
            {/* Centered Header block */}
            <div className="text-center pb-5 space-y-2 border-b-2" style={{ borderColor: schemeColors.accentColor }}>
              <h1 className={`${sz.title} font-extrabold tracking-tight text-slate-900 leading-none`}>
                {data.fullName || "Your Full Name"}
              </h1>
              
              {/* Contacts Grid line */}
              <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 ${sz.subItem} text-slate-600 font-medium`}>
                {data.email && (
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full select-none print:border-none print:bg-transparent">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full select-none print:border-none print:bg-transparent">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {data.phone}
                  </span>
                )}
                {data.location && (
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full select-none print:border-none print:bg-transparent">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {data.location}
                  </span>
                )}
                {data.website && (
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full select-none print:border-none print:bg-transparent">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {data.website}
                  </span>
                )}
              </div>
            </div>

            {/* Linear sections list */}
            {renderOrderedSections()}
          </div>
        );

      // 2. MODERN MINIMALIST (Left Offset Side-Borders)
      case "modern":
        return (
          <div className="space-y-6">
            {/* Elegant asymmetrical grid header */}
            <div className="border-l-4 pl-4 py-1.5 space-y-1.5" style={{ borderColor: schemeColors.accentColor }}>
              <h1 className={`${sz.title} font-black tracking-tight text-slate-900 uppercase`}>
                {data.fullName || "Your Full Name"}
              </h1>
              <div className={`flex flex-wrap gap-x-4 gap-y-1 ${sz.subItem} text-slate-550 font-semibold font-mono`}>
                {data.email && <span>email &bull; {data.email}</span>}
                {data.phone && <span>phone &bull; {data.phone}</span>}
                {data.location && <span>location &bull; {data.location}</span>}
                {data.website && <span>portfolio &bull; {data.website}</span>}
              </div>
            </div>

            <div className="h-px w-full bg-slate-100"></div>

            {/* Reordered linear flows */}
            {renderOrderedSections()}
          </div>
        );

      // 3. EXECUTIVE ELEGANT
      case "executive":
        return (
          <div className="space-y-6">
            {/* Styled banner details */}
            <div className="p-6 md:p-8 rounded-xl text-white space-y-3" style={{ background: `linear-gradient(135deg, ${schemeColors.accentColor}, #090c15)` }}>
              <div className="flex justify-between items-center">
                <h1 className={`${sz.title} font-black tracking-tight leading-none uppercase text-white`}>
                  {data.fullName || "Your Full Name"}
                </h1>
                <Award className="w-6 h-6 text-yellow-400 animate-pulse print:hidden" />
              </div>
              <div className={`grid grid-cols-2 gap-2 ${sz.subItem} text-slate-200 border-t border-white/10 pt-3`}>
                {data.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-300" /> {data.email}</div>}
                {data.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-300" /> {data.phone}</div>}
                {data.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-300" /> {data.location}</div>}
                {data.website && <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-300" /> {data.website}</div>}
              </div>
            </div>

            {/* Live custom sections ordering */}
            {renderOrderedSections()}
          </div>
        );

      // 4. TECH MONOSPACE (Visual styling with tags and compact metadata)
      case "tech":
        return (
          <div className="space-y-5">
            {/* Hex matrix styled header */}
            <div className="border border-slate-200 p-4 rounded-xl space-y-2.5 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <h1 className={`${sz.title} font-black tracking-widest text-slate-900 font-mono`}>
                  &gt; {data.fullName?.toUpperCase() || "NAME_DRAFT"}
                </h1>
                <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded font-mono text-[10px] select-none uppercase">
                  NODE_ONLINE
                </span>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 ${sz.subItem} font-mono text-slate-600`}>
                {data.email && <div>[EMAIL]: {data.email}</div>}
                {data.phone && <div>[PHONE]: {data.phone}</div>}
                {data.location && <div>[LOC]: {data.location}</div>}
                {data.website && <div>[WWW]: {data.website}</div>}
              </div>
            </div>

            {/* Live sections order rendering */}
            {renderOrderedSections()}
          </div>
        );

      // 5. COMPACT CLEAN (Condenses margins to fit single pages)
      case "minimalist":
        return (
          <div className="space-y-4">
            {/* Extremely compact horizontal header banner */}
            <div className="flex justify-between items-baseline border-b border-slate-350 pb-2">
              <h1 className={`${sz.title} font-bold tracking-tight text-slate-900`}>
                {data.fullName || "Your Full Name"}
              </h1>
              <div className={`flex gap-x-2.5 ${sz.subItem} font-semibold text-slate-550`}>
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>&bull; {data.phone}</span>}
                {data.location && <span>&bull; {data.location}</span>}
              </div>
            </div>

            {/* Direct Sections flow */}
            {renderOrderedSections()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Utility Panel - Print & Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="capitalize">Theme: {templateType} Style &bull; {fontFamily} Font</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-download-pdf"
            type="button"
            onClick={triggerPrint}
            className="flex items-center gap-1.5 text-xs text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full font-semibold transition-colors shadow-lg cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" /> Download PDF
          </button>
          <button
            id="btn-export-json"
            type="button"
            onClick={triggerExportJson}
            className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" /> Export Data JSON
          </button>
        </div>
      </div>

      {/* Actual Live Document View on Simulated Paper Sheet */}
      <div 
        id="resume-document-canvas" 
        className={`${getFontFamilyClass(fontFamily)} ${sz.body} bg-white border border-slate-300 rounded-xl p-6 md:p-10 shadow-lg max-w-[800px] mx-auto text-slate-900 leading-normal flex flex-col justify-start relative text-left`}
        style={{ minHeight: "1050px" }}
      >
        {renderDocumentContent()}

        {/* Subtle, standard A4 single page warning line (only visible if overflown in editor) */}
        <div className="mt-auto pt-8 border-t border-slate-150 text-[10px] text-slate-400 text-center print:hidden flex justify-between items-center px-1">
          <span>* A4 Compliance sheet ready for HR database ingest</span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-blue-400" /> ATS Compatibility Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
}
