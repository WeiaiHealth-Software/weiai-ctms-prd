import { create } from 'zustand';
import { PROJECTS, type ProjectStatus, type ProjectSummary } from '@/mock/projects';

const createInitialProjects = (): ProjectSummary[] => {
  if (typeof structuredClone === 'function') {
    return structuredClone(PROJECTS);
  }

  return JSON.parse(JSON.stringify(PROJECTS)) as ProjectSummary[];
};

type ProjectsStore = {
  projects: ProjectSummary[];
  addProject: (project: ProjectSummary) => void;
  updateProject: (projectId: string, patch: Partial<ProjectSummary>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
};

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: createInitialProjects(),
  addProject: (project) =>
    set((state) => {
      return { projects: [project, ...state.projects] };
    }),
  updateProject: (projectId, patch) =>
    set((state) => {
      return { projects: state.projects.map((p) => (p.id === projectId ? { ...p, ...patch } : p)) };
    }),
  updateProjectStatus: (projectId, status) =>
    set((state) => {
      return { projects: state.projects.map((p) => (p.id === projectId ? { ...p, status } : p)) };
    })
}));
