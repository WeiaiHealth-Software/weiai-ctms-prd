import { useNavigate } from 'react-router'
import { statusClassMap } from '../../../lib/statusMap'
import { classNames } from '../../../lib/classNames'
import type { Project } from '../../../types/project'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/projects/${project.id}`)}
      className="text-left rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition bg-white"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[project.status])}>
          {project.status}
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono">
          {project.code}
        </div>
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 leading-6">{project.name}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-6">{project.desc}</p>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-400 text-xs">主要研究者</div>
          <div className="text-slate-800 font-medium mt-1">{project.pi}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">当前入组人数</div>
          <div className="text-blue-700 font-semibold mt-1">{project.enrolled}</div>
        </div>
        <div className="col-span-2">
          <div className="text-slate-400 text-xs">参与中心</div>
          <div className="text-slate-800 mt-1">{project.centers.join('、')}</div>
        </div>
        <div className="col-span-2">
          <div className="text-slate-400 text-xs">申办方</div>
          <div className="text-slate-800 mt-1">{project.sponsor}</div>
        </div>
      </div>
    </button>
  )
}
