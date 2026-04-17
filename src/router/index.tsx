import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectWizard } from '@/components/projects/wizard/ProjectWizard'
import { Centers } from '@/pages/centers'
import { Dashboard } from '@/pages/dashboard'
import { Departments } from '@/pages/departments'
import { Dimensions } from '@/pages/dimensions'
import { MiniProgram } from '@/pages/miniprogram'
import { ProjectDetail } from '@/pages/projects/detail'
import { ProjectList } from '@/pages/projects'
import { Roles } from '@/pages/roles'
import { Users } from '@/pages/users'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/index" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/create" element={<ProjectWizard />} />
        <Route path="dimensions" element={<Dimensions />} />
        <Route path="departments" element={<Departments />} />
        <Route path="centers" element={<Centers />} />
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/miniprogram" element={<MainLayout />}>
        <Route index element={<MiniProgram />} />
      </Route>
      <Route path="/" element={<Navigate to="/index" replace />} />
    </Routes>
  )
}
