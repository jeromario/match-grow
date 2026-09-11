export type WorkMode = "Presencial" | "Híbrido" | "Remoto" | "Indiferente";
export type Seniority = "Estágio" | "Júnior" | "Pleno" | "Sênior" | "Especialista" | "Liderança";
export type SkillType = "hard" | "soft" | "tool" | "tech";

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string;
  technologies: string;
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  issueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  desiredRole: string;
  desiredArea: string;
  experienceLevel: Seniority | "";
  desiredLocation: string;
  salaryExpectation: string;
  contractType: string;
  preferredWorkMode: WorkMode | "";
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

export interface ResumeContent {
  headline: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

export interface Resume {
  id: string;
  name: string;
  type: "base" | "tailored";
  jobId?: string;
  content: ResumeContent;
  atsScore?: number;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  seniority: Seniority;
  salary: string;
  url: string;
  description: string;
  requirements: string;
  niceToHave: string;
  benefits: string;
  area: string;
  isDemo?: boolean;
  createdAt: string;
  publishedAt: string;
}

export interface MatchBreakdownData {
  skills: number;
  experience: number;
  education: number;
  seniority: number;
  location: number;
  keywords: number;
}

export interface MatchResult {
  jobId: string;
  score: number;
  breakdown: MatchBreakdownData;
  matchedSkills: string[];
  missingSkills: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
  why: string;
  gaps: string;
  howToImprove: string;
  createdAt: string;
}

export type ApplicationStatus =
  | "Interessado"
  | "Aplicar"
  | "Aplicado"
  | "Entrevista"
  | "Oferta"
  | "Rejeitado"
  | "Encerrado";

export interface Application {
  id: string;
  jobId: string;
  resumeId?: string;
  status: ApplicationStatus;
  matchScore?: number;
  appliedAt?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "resume" | "job" | "match" | "application" | "profile";
  message: string;
  createdAt: string;
}

export interface AppState {
  sessionId: string;
  onboarded: boolean;
  profile: Profile;
  resumes: Resume[];
  jobs: Job[];
  matches: MatchResult[];
  applications: Application[];
  activity: ActivityItem[];
}
