import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectWizard } from '@/components/projects/wizard/ProjectWizard'
import { Centers } from '@/pages/centers'
import { CenterDetail } from '@/pages/centers/detail'
import { Dashboard } from '@/pages/dashboard'
import { Departments } from '@/pages/departments'
import { Dimensions } from '@/pages/dimensions'
import { MiniProgram } from '@/pages/miniprogram'
import { ProjectDetail } from '@/pages/projects/detail'
import { ProjectList } from '@/pages/projects'
import { Roles } from '@/pages/roles'
import { Users } from '@/pages/users'

// EDC 模块页面
import { ProjectListPage as EdcProjects } from '@/pages/edc/projects/ProjectListPage'
import ProjectDetailPage from '@/pages/edc/projects/ProjectDetailPage'
import { AppointmentPage as EdcAppointments } from '@/pages/edc/appointments/AppointmentPage'
import { TemplateCenterPage as EdcTemplates } from '@/pages/edc/templates/TemplateCenterPage'
import { TemplateBuilderPage as EdcTemplateBuilder } from '@/pages/edc/templates/TemplateBuilderPage'

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
        <Route path="centers/:centerId" element={<CenterDetail />} />
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<Users />} />
        
        {/* EDC 子系统路由 */}
        <Route path="edc/projects" element={<EdcProjects />} />
        <Route path="edc/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="edc/appointments" element={<EdcAppointments />} />
        <Route path="edc/templates" element={<EdcTemplates />} />
        <Route path="edc/templates/builder" element={<EdcTemplateBuilder />} />
      </Route>
      <Route path="/miniprogram" element={<MainLayout />}>
        <Route index element={<MiniProgram />} />
      </Route>
      <Route path="/" element={<Navigate to="/index" replace />} />
    </Routes>
  )
}
