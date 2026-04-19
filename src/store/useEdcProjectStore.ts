import { create } from 'zustand'
import { projects as initialProjects } from '../data/edc/projects'
import type { Project } from '../types/project'

interface EdcProjectState {
  projects: Project[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
}

export const useEdcProjectStore = create<EdcProjectState>((set) => ({
  projects: initialProjects,
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) }))
}))
