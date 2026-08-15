import { create } from 'zustand'
import { projects as initialProjects } from '../data/edc/projects'
import type { Project, FormConfig, ProjectStatus } from '../types/project'

interface EdcProjectState {
  projects: Project[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProjectBaselineForm: (projectId: string, form: FormConfig) => void
  updateProjectVisitForm: (projectId: string, form: FormConfig) => void
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void
  markProjectConfigured: (projectId: string, baselineForm: FormConfig, visitForm: FormConfig) => void
  startProject: (projectId: string) => void
  finishProject: (projectId: string) => void
  getProject: (projectId: string) => Project | undefined
}

export const useEdcProjectStore = create<EdcProjectState>((set, get) => ({
  projects: initialProjects,
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),
  updateProjectBaselineForm: (projectId, form) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, baselineForm: form } : p)
  })),
  updateProjectVisitForm: (projectId, form) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, visitForm: form } : p)
  })),
  updateProjectStatus: (projectId, status) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, status } : p)
  })),
  markProjectConfigured: (projectId, baselineForm, visitForm) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? {
      ...p,
      baselineForm,
      visitForm,
      isConfigForm: true,
      status: '筹备中'
    } : p)
  })),
  startProject: (projectId) => set((state) => ({
    projects: state.projects.map(p => (p.id === projectId && p.status === '筹备中') ? { ...p, status: '进行中' } : p)
  })),
  finishProject: (projectId) => set((state) => ({
    projects: state.projects.map(p => (p.id === projectId && p.status === '进行中') ? { ...p, status: '已结束' } : p)
  })),
  getProject: (projectId) => get().projects.find(p => p.id === projectId)
}))
