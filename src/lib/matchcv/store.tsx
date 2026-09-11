import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoJobs } from "./seed";
import type {
  ActivityItem,
  AppState,
  Application,
  Job,
  MatchResult,
  Profile,
  Resume,
} from "./types";

const STORAGE_KEY = "matchcv:state:v1";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const emptyProfile: Profile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  country: "Brasil",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  desiredRole: "",
  desiredArea: "",
  experienceLevel: "",
  desiredLocation: "",
  salaryExpectation: "",
  contractType: "",
  preferredWorkMode: "",
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

function initialState(): AppState {
  return {
    sessionId: uid(),
    onboarded: false,
    profile: emptyProfile,
    resumes: [],
    jobs: demoJobs,
    matches: [],
    applications: [],
    activity: [],
  };
}

function load(): AppState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...initialState(), ...parsed, profile: { ...emptyProfile, ...parsed.profile } };
  } catch {
    return initialState();
  }
}

interface StoreValue {
  state: AppState;
  hydrated: boolean;
  setProfile: (updater: (p: Profile) => Profile) => void;
  completeOnboarding: () => void;
  addActivity: (type: ActivityItem["type"], message: string) => void;
  upsertResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  upsertJob: (job: Job) => void;
  removeJob: (id: string) => void;
  saveMatch: (match: MatchResult) => void;
  upsertApplication: (application: Application) => void;
  removeApplication: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function MatchCVProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state, hydrated]);

  const addActivity = useCallback((type: ActivityItem["type"], message: string) => {
    setState((s) => ({
      ...s,
      activity: [
        { id: uid(), type, message, createdAt: new Date().toISOString() },
        ...s.activity,
      ].slice(0, 40),
    }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      hydrated,
      setProfile: (updater) => setState((s) => ({ ...s, profile: updater(s.profile) })),
      completeOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
      addActivity,
      upsertResume: (resume) =>
        setState((s) => ({
          ...s,
          resumes: s.resumes.some((r) => r.id === resume.id)
            ? s.resumes.map((r) => (r.id === resume.id ? resume : r))
            : [resume, ...s.resumes],
        })),
      removeResume: (id) => setState((s) => ({ ...s, resumes: s.resumes.filter((r) => r.id !== id) })),
      upsertJob: (job) =>
        setState((s) => ({
          ...s,
          jobs: s.jobs.some((j) => j.id === job.id)
            ? s.jobs.map((j) => (j.id === job.id ? job : j))
            : [job, ...s.jobs],
        })),
      removeJob: (id) =>
        setState((s) => ({
          ...s,
          jobs: s.jobs.filter((j) => j.id !== id),
          matches: s.matches.filter((m) => m.jobId !== id),
        })),
      saveMatch: (match) =>
        setState((s) => ({
          ...s,
          matches: [match, ...s.matches.filter((m) => m.jobId !== match.jobId)],
        })),
      upsertApplication: (application) =>
        setState((s) => ({
          ...s,
          applications: s.applications.some((a) => a.id === application.id)
            ? s.applications.map((a) => (a.id === application.id ? application : a))
            : [application, ...s.applications],
        })),
      removeApplication: (id) =>
        setState((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== id) })),
      resetAll: () => setState(initialState()),
    }),
    [state, hydrated, addActivity],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMatchCV() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMatchCV precisa estar dentro de MatchCVProvider");
  return ctx;
}

export function profileCompletion(profile: Profile) {
  const checks = [
    !!profile.fullName,
    !!profile.email || !!profile.phone,
    !!profile.city,
    !!profile.desiredRole,
    !!profile.experienceLevel,
    !!profile.preferredWorkMode,
    !!profile.summary,
    profile.experiences.length > 0,
    profile.education.length > 0,
    profile.skills.length >= 3,
    profile.languages.length > 0,
    !!profile.linkedinUrl || !!profile.githubUrl || !!profile.portfolioUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function resumeFromProfile(profile: Profile, name = "Currículo Principal"): Resume {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name,
    type: "base",
    content: {
      headline: profile.desiredRole,
      summary: profile.summary,
      experiences: profile.experiences,
      education: profile.education,
      skills: profile.skills,
      languages: profile.languages,
      certifications: profile.certifications,
      projects: profile.projects,
    },
    createdAt: now,
    updatedAt: now,
  };
}
