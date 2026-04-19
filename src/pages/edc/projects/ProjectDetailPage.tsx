import { ArrowLeft, Filter, MoreHorizontal, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import SectionCard from '../../components/common/SectionCard'
import TabButton from '../../components/common/TabButton'
import StatCard from '../../modules/dashboard/StatCard'
import SubjectTable from '../../modules/projects/components/SubjectTable'
import SubjectDrawer from '../../modules/projects/drawers/SubjectDrawer'
import { projects } from '../../data/projects'
import { projectSubjects } from '../../data/subjects'
import { classNames } from '../../lib/classNames'
import { statusClassMap } from '../../lib/statusMap'

type ProjectTabKey = 'subjects' | 'visits' | 'forms' | 'settings'

const projectVisitOverview = [
  { name: 'V0 基线期', assignedForms: ['基线期采集表'], subjects: 26, status: '执行中' },
  { name: 'V1 3M', assignedForms: ['3M 随访表', '异常事件记录表'], subjects: 18, status: '执行中' },
  { name: 'V2 6M', assignedForms: ['3M 随访表', '异常事件记录表'], subjects: 9, status: '待开始' },
]

const projectBoundForms = [
  { visit: 'V0 基线期', form: '基线期采集表', version: 'v1.0.0', status: '启用中' },
  { visit: 'V1 3M', form: '3M 随访表', version: 'v1.0.0', status: '启用中' },
  { visit: 'V1 3M', form: '异常事件记录表', version: 'v0.9.2', status: '草稿' },
]

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [tab, setTab] = useState<ProjectTabKey>('subjects')
  const [showSubjectDrawer, setShowSubjectDrawer] = useState(false)

  const project = useMemo(() => projects.find((p) => p.id === projectId) || null, [projectId])
  const subjects = projectId ? projectSubjects[projectId] || [] : []

  if (!project) {
    return <div className="text-sm text-slate-500">未找到项目</div>
  }

  return (
    <>
      <div className="space-y-6">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          返回项目列表
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className={classNames('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[project.status])}>
                {project.status}
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">{project.name}</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-4xl leading-6">{project.desc}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSubjectDrawer(true)}
                className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                新增受试者
              </button>
              <button className="h-10 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="text-xs text-slate-400">项目编号</div>
              <div className="mt-1 text-sm font-semibold text-blue-700">{project.code}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">主要研究者</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{project.pi}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">参与中心</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{project.centers.length} 个</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">申办方</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{project.sponsor}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">当前入组人数</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">{project.enrolled}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TabButton active={tab === 'subjects'} onClick={() => setTab('subjects')}>
            受试者管理
          </TabButton>
          <TabButton active={tab === 'visits'} onClick={() => setTab('visits')}>
            访视管理
          </TabButton>
          <TabButton active={tab === 'forms'} onClick={() => setTab('forms')}>
            项目表单
          </TabButton>
          <TabButton active={tab === 'settings'} onClick={() => setTab('settings')}>
            项目设置
          </TabButton>
        </div>

        {tab === 'subjects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="筛选中" value="1" hint="待确认是否入组" />
              <StatCard title="已入组" value="1" hint="基线完成，进入研究" />
              <StatCard title="随访中" value="1" hint="已有后续访视安排" />
              <StatCard title="提前退出" value="1" hint="已终止后续流程" />
            </div>

            <SectionCard
              title="受试者管理"
              extra={
                <div className="flex items-center gap-2">
                  <button className="h-9 px-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    筛选
                  </button>
                  <button className="h-9 px-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                    导出数据
                  </button>
                </div>
              }
            >
              <SubjectTable subjects={subjects} />
            </SectionCard>
          </div>
        )}

        {tab === 'visits' && (
          <SectionCard title="访视执行概览">
            <div className="space-y-4">
              {projectVisitOverview.map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{item.name}</div>
                      <div className="mt-2 text-sm text-slate-500">
                        已绑定表单：{item.assignedForms.join('、')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">涉及受试者</div>
                      <div className="text-xl font-bold text-blue-700 mt-1">{item.subjects}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500">当前状态：{item.status}</span>
                    <button className="text-sm text-blue-600 hover:text-blue-800">查看访视详情</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === 'forms' && (
          <SectionCard title="项目已绑定表单">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">访视节点</th>
                    <th className="text-left px-4 py-3 font-medium">表单名称</th>
                    <th className="text-left px-4 py-3 font-medium">版本</th>
                    <th className="text-left px-4 py-3 font-medium">状态</th>
                    <th className="text-right px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectBoundForms.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-4 text-slate-700">{row.visit}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">{row.form}</td>
                      <td className="px-4 py-4 text-slate-600">{row.version}</td>
                      <td className="px-4 py-4">
                        <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[row.status])}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">调整绑定</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {tab === 'settings' && (
          <div className="grid grid-cols-2 gap-6">
            <SectionCard title="基础设置">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">项目状态</span>
                  <span className="font-medium text-slate-800">{project.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">默认中心</span>
                  <span className="font-medium text-slate-800">{project.centers[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">编号规则</span>
                  <span className="font-medium text-slate-800">S-项目编号-流水号</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">随机号规则</span>
                  <span className="font-medium text-slate-800">R-流水号</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="流程设置建议">
              <ul className="space-y-3 text-sm text-slate-600 leading-6">
                <li>• 建议按访视绑定模板，不在项目页面直接堆叠所有表单。</li>
                <li>• 受试者状态、访视状态、表单状态需分开维护，避免混用。</li>
                <li>• 对提前退出和失访受试者，应限制后续访视自动创建。</li>
                <li>• 预约复查模块与访视状态联动，减少重复登记。</li>
              </ul>
            </SectionCard>
          </div>
        )}
      </div>

      <SubjectDrawer
        open={showSubjectDrawer}
        onClose={() => setShowSubjectDrawer(false)}
        project={project}
      />
    </>
  )
}
