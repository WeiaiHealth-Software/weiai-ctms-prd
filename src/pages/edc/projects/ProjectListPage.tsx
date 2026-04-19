import { Plus, Search, RefreshCw, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { useHeaderStore } from '../../../store/useHeaderStore'
import SectionCard from '../../../components/common/SectionCard'
import StatCard from '../../../modules/edc/dashboard/StatCard'
import Drawer from '../../../components/overlay/Drawer'
import { projects as initialProjects } from '../../../data/edc/projects'
import { PROJECTS as iwrsProjects, ProjectSummary } from '../../../mock/projects'
import { classNames } from '../../../lib/classNames'
import { statusClassMap } from '../../../lib/statusMap'
import type { Project } from '../../../types/project'

const PAGE_SIZE = 10

export function ProjectListPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState(initialProjects)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false)

  useEffect(() => {
    setTitle('EDC 项目管理', '管理电子数据采集系统的所有项目及进度', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ])
  }, [setTitle])

  const handleSyncProject = (iwrsProject: ProjectSummary) => {
    // Check if it's already synced
    const exists = projects.find(p => p.code === iwrsProject.code)
    if (exists) {
      alert(`项目 [${iwrsProject.code}] 已经存在于 EDC 系统中！`)
      return
    }

    const newEdcProject: Project = {
      id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Generate a mock ID
      code: iwrsProject.code,
      name: iwrsProject.title,
      pi: iwrsProject.leader || '--',
      sponsor: '已同步的申办方', // Placeholder since IWRS mock doesn't have sponsor
      centers: iwrsProject.centers || [],
      status: iwrsProject.status === '进行中' ? '筹备中' : '已结束', // Default to 筹备中
      enrolled: 0, // Fresh sync, no baseline yet
      desc: iwrsProject.description,
    }

    setProjects(prev => [newEdcProject, ...prev])
    alert(`项目 [${iwrsProject.code}] 同步成功！`)
  }

  const handleDelete = (projectId: string) => {
    const targetProject = projects.find((project) => project.id === projectId)
    if (!targetProject) return

    const shouldDelete = window.confirm(`确认删除项目「${targetProject.name}」吗？`)
    if (!shouldDelete) return

    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId))
  }

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects
    return projects.filter(
      (p) =>
        p.name.includes(search) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.pi.includes(search)
    )
  }, [projects, search])

  const stats = useMemo(() => {
    const ongoingCount = projects.filter((project) => project.status === '进行中').length
    const preparingCount = projects.filter((project) => project.status === '筹备中').length
    const finishedCount = projects.filter((project) => project.status === '已结束').length
    const totalEnrolled = projects.reduce((sum, project) => sum + project.enrolled, 0)

    return {
      ongoingCount,
      preparingCount,
      finishedCount,
      totalEnrolled,
    }
  }, [projects])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredProjects.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredProjects, safeCurrentPage])

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="进行中项目"
          value={String(stats.ongoingCount)}
          hint="当前核心执行项目"
          className="border-emerald-200 bg-emerald-50"
          titleClassName="text-emerald-700"
          valueClassName="text-emerald-800"
          hintClassName="text-emerald-600"
        />
        <StatCard
          title="筹备中项目"
          value={String(stats.preparingCount)}
          hint="待配置表单与访视"
          className="border-amber-200 bg-amber-50"
          titleClassName="text-amber-700"
          valueClassName="text-amber-800"
          hintClassName="text-amber-600"
        />
        <StatCard
          title="已结束项目"
          value={String(stats.finishedCount)}
          hint="已停止入组与随访"
          className="border-slate-200 bg-slate-100"
          titleClassName="text-slate-600"
          valueClassName="text-slate-700"
          hintClassName="text-slate-500"
        />
        <StatCard
          title="累计受试者"
          value={String(stats.totalEnrolled)}
          hint="当前系统内所有项目合计"
          className="border-blue-200 bg-blue-50"
          titleClassName="text-blue-700"
          valueClassName="text-blue-800"
          hintClassName="text-blue-600"
        />
      </div>

      <SectionCard
        title="项目列表"
        extra={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="搜索项目名称 / 编号 / PI"
                className="h-10 w-72 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="relative group">
              <button
                onClick={() => setIsSyncDrawerOpen(true)}
                className="h-10 pl-4 pr-10 rounded-xl bg-white border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 flex items-center gap-2 relative"
              >
                <RefreshCw className="w-4 h-4" />
                同步 IWRS 项目
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600" title="此按钮只在部署完整科研系统的时候才显示，单独部署 EDC 系统的时候不带这个同步的能力">
                  <Info className="w-4 h-4" />
                </div>
              </button>
            </div>
            <button className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建项目
            </button>
          </div>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">项目名称</th>
                <th className="px-4 py-3 text-left font-medium">编号</th>
                <th className="px-4 py-3 text-left font-medium">PI</th>
                {/* <th className="px-4 py-3 text-left font-medium">申办方</th> */}
                <th className="px-4 py-3 text-left font-medium">参与中心</th>
                <th className="px-4 py-3 text-left font-medium">状态</th>
                <th className="px-4 py-3 text-left font-medium">入组人数</th>
                <th className="px-4 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProjects.length > 0 ? (
                paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-medium text-slate-800">{project.name}</td>
                    <td className="px-4 py-4 text-slate-600 font-mono">{project.code}</td>
                    <td className="px-4 py-4 text-slate-600">{project.pi}</td>
                    {/* <td className="px-4 py-4 text-slate-600">{project.sponsor}</td> */}
                    <td className="px-4 py-4 text-slate-600">{project.centers.join('、')}</td>
                    <td className="px-4 py-4">
                      <span
                        className={classNames(
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                          statusClassMap[project.status]
                        )}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{project.enrolled}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <Link to={`/index/edc/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                          查看详情
                        </Link>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    暂无匹配的项目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredProjects.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
              <div className="text-sm text-slate-500">
                显示第 {(safeCurrentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(safeCurrentPage * PAGE_SIZE, filteredProjects.length)} 条，共 {filteredProjects.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={classNames(
                        'h-9 min-w-9 rounded-lg border px-3 text-sm',
                        safeCurrentPage === pageNumber
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <Drawer
        open={isSyncDrawerOpen}
        onClose={() => setIsSyncDrawerOpen(false)}
        title="同步 IWRS 项目"
        subtitle="将中央随机化系统中的项目同步至 EDC 电子数据采集系统"
        width={800}
      >
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">项目名称</th>
                  <th className="px-4 py-3 text-left font-medium w-40">项目码</th>
                  <th className="px-4 py-3 text-left font-medium w-24">负责人</th>
                  <th className="px-4 py-3 text-right font-medium w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {iwrsProjects.map(iwrs => {
                  const isSynced = projects.some(p => p.code === iwrs.code)
                  return (
                    <tr key={iwrs.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-800 line-clamp-2" title={iwrs.title}>{iwrs.title}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{iwrs.code}</span>
                          {iwrs.isFission && (
                            <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-medium shrink-0">
                              裂变项目
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{iwrs.leader}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleSyncProject(iwrs)}
                          disabled={isSynced}
                          className={classNames(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            isSynced 
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          )}
                        >
                          {isSynced ? '已同步' : '同步'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
