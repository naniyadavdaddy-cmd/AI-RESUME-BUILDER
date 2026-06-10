export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
}

export type TemplateType = "classic" | "modern" | "minimalist" | "executive" | "tech";
export type FontFamily = "sans" | "serif" | "mono" | "elegant";
export type ColorScheme = "slate" | "navy" | "emerald" | "burgundy" | "charcoal";
export type FontSizeValue = "sm" | "base" | "md" | "lg";
export type SectionId = "summary" | "experience" | "skills" | "education";

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: WorkExperience[];
  skills: string[];
  education: Education[];
  templateType?: TemplateType;
  fontFamily?: FontFamily;
  colorScheme?: ColorScheme;
  fontSize?: FontSizeValue;
  sectionOrder?: SectionId[];
}

export interface AtsKeyword {
  keyword: string;
  importance: "High" | "Medium" | "Low";
  tips: string;
}

export interface AtsCheck {
  check: string;
  passed: boolean;
  details: string;
}

export interface AtsSectionAnalysis {
  contact: string;
  experience: string;
  skills: string;
  education: string;
}

export interface AtsAnalysis {
  matchScore: number;
  readabilityScore: number;
  missingKeywords: AtsKeyword[];
  matchedKeywords: string[];
  formattingChecks: AtsCheck[];
  sectionAnalysis: AtsSectionAnalysis;
  criticalFixes: string[];
}
