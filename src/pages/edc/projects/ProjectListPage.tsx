import { Plus, Search, RefreshCw, Info, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { useHeaderStore } from '../../../store/useHeaderStore'
import { useEdcProjectStore } from '../../../store/useEdcProjectStore'
import SectionCard from '../../../components/common/SectionCard'
import Drawer from '../../../components/overlay/Drawer'
import { PROJECTS as iwrsProjects, ProjectSummary } from '../../../mock/projects'
import { classNames } from '../../../lib/classNames'
import { statusClassMap } from '../../../lib/statusMap'
import type { Project } from '../../../types/project'

const PAGE_SIZE = 10

export function ProjectListPage() {
  const setTitle = useHeaderStore(state => state.setTitle)
  const { projects, addProject, removeProject } = useEdcProjectStore()
  const [search, setSearch] = useState('')
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
      targetEnrollment: iwrsProject.totalCount,
      desc: iwrsProject.description,
    }

    addProject(newEdcProject)
  }

  const handleDelete = (projectId: string) => {
    const targetProject = projects.find((project) => project.id === projectId)
    if (!targetProject) return

    // IDE Webview issue workaround: avoid using window.confirm
    removeProject(projectId)
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

  const syncedIwrsCount = useMemo(
    () => iwrsProjects.filter((iwrs) => projects.some((project) => project.code === iwrs.code)).length,
    [projects]
  )

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredProjects.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredProjects, safeCurrentPage])

  return (
    <div className="space-y-6 p-6">
      <SectionCard
        title="项目列表"
        contentClassName="p-0"
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
        <div className="overflow-hidden rounded-b-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-[1240px] w-full table-fixed text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="w-[30%] px-6 py-4 text-left whitespace-nowrap">项目名称</th>
                  <th className="w-28 px-6 py-4 text-left whitespace-nowrap">编号</th>
                  <th className="w-28 px-6 py-4 text-left whitespace-nowrap">PI</th>
                  {/* <th className="px-4 py-3 text-left font-medium">申办方</th> */}
                  <th className="w-[19%] px-6 py-4 text-left whitespace-nowrap">参与中心</th>
                  <th className="w-28 px-6 py-4 text-left whitespace-nowrap">状态</th>
                  <th className="w-32 px-6 py-4 text-left whitespace-nowrap">参与人数</th>
                  <th className="w-40 px-6 py-4 text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProjects.length > 0 ? (
                  paginatedProjects.map((project) => {
                    const isSynced = iwrsProjects.some(iwrs => iwrs.code === project.code)

                    return (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <p className="leading-relaxed font-semibold text-slate-900">
                          {isSynced && (
                            <span className="mr-2 inline-flex translate-y-[-1px] items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-semibold leading-none text-indigo-700 align-middle">
                              <Check className="w-3 h-3 text-indigo-600" />
                              已同步
                            </span>
                          )}
                          <span className="align-middle">{project.name}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono">{project.code}</td>
                      <td className="px-6 py-4 text-slate-600">{project.pi}</td>
                      {/* <td className="px-4 py-4 text-slate-600">{project.sponsor}</td> */}
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">{project.centers.join('、')}</td>
                      <td className="px-6 py-4">
                        <span
                          className={classNames(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                            statusClassMap[project.status]
                          )}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">
                        {project.enrolled}/{project.targetEnrollment}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 text-sm">
                          <Link to={`/index/edc/projects/${project.id}`} className="cursor-pointer rounded-md px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800">
                            查看详情
                          </Link>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            className="cursor-pointer text-rose-600 hover:text-rose-700"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      暂无匹配的项目
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredProjects.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
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
        width="720px"
        headerClassName="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 pb-3.5 pt-3"
        bodyClassName="bg-slate-50 px-6 pb-6 pt-4"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">同步概览</p>
                <p className="mt-1 text-sm text-slate-600">同步后会在 EDC 项目列表中生成对应项目，供后续受试者和表单配置使用。</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  共 {iwrsProjects.length} 个
                </span>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  已同步 {syncedIwrsCount}
                </span>
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  待同步 {iwrsProjects.length - syncedIwrsCount}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold whitespace-nowrap">项目名称</th>
                  <th className="w-40 px-6 py-3.5 text-left text-xs font-semibold whitespace-nowrap">项目码</th>
                  <th className="w-24 px-6 py-3.5 text-left text-xs font-semibold whitespace-nowrap">负责人</th>
                  <th className="w-24 px-6 py-3.5 text-right text-xs font-semibold whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {iwrsProjects.map(iwrs => {
                  const isSynced = projects.some(p => p.code === iwrs.code)
                  return (
                    <tr key={iwrs.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1">
                          <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-800" title={iwrs.title}>{iwrs.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{iwrs.code}</span>
                          {iwrs.isFission && (
                            <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                              裂变项目
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-600">{iwrs.leader}</td>
                      <td className="px-6 py-4 text-right align-top">
                        <button
                          onClick={() => handleSyncProject(iwrs)}
                          disabled={isSynced}
                          className={classNames(
                            "min-w-[60px] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
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
