import { create } from 'zustand';
import { PROJECTS, type ProjectStatus, type ProjectSummary } from '@/mock/projects';

const STORAGE_KEY = 'weiai_ctms_projects_v1';

const loadProjects = (): ProjectSummary[] => {
  if (typeof window === 'undefined') return PROJECTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return PROJECTS;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return PROJECTS;
    return parsed as ProjectSummary[];
  } catch {
    return PROJECTS;
  }
};

const saveProjects = (projects: ProjectSummary[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    return;
  }
};

type ProjectsStore = {
  projects: ProjectSummary[];
  addProject: (project: ProjectSummary) => void;
  updateProject: (projectId: string, patch: Partial<ProjectSummary>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
};

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: loadProjects(),
  addProject: (project) =>
    set((state) => {
      const next = [project, ...state.projects];
      saveProjects(next);
      return { projects: next };
    }),
  updateProject: (projectId, patch) =>
    set((state) => {
      const next = state.projects.map((p) => (p.id === projectId ? { ...p, ...patch } : p));
      saveProjects(next);
      return { projects: next };
    }),
  updateProjectStatus: (projectId, status) =>
    set((state) => {
      const next = state.projects.map((p) => (p.id === projectId ? { ...p, status } : p));
      saveProjects(next);
      return { projects: next };
    })
}));

