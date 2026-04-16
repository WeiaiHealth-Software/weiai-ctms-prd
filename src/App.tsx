import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/dashboard'
import { ProjectList } from './pages/projects'
import { ProjectWizard } from './components/projects/wizard/ProjectWizard'
import { Dimensions } from './pages/dimensions'
import { Departments } from './pages/departments'
import { Centers } from './pages/centers'
import { Roles } from './pages/roles'
import { Users } from './pages/users'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/index" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<ProjectWizard />} />
        <Route path="dimensions" element={<Dimensions />} />
        <Route path="departments" element={<Departments />} />
        <Route path="centers" element={<Centers />} />
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/" element={<Navigate to="/index" replace />} />
    </Routes>
  )
}

export default App