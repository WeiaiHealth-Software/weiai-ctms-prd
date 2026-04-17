import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { Plus, Search, Filter } from 'lucide-react';
import { PROJECTS } from '../../mock/projects';

export const ProjectList: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  useEffect(() => {
    setTitle('项目管理', '管理所有临床研究项目', [{ text: '所有角色', color: 'slate' }]);
  }, [setTitle]);

  const projects = PROJECTS;

  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status === '进行中';
    if (filter === 'ended') return p.status === '已结束';
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* 筛选与操作区 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto">
          <button 
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            onClick={() => setFilter('all')}
          >
            全部项目 <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{projects.length}</span>
          </button>
          <button 
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'active' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            onClick={() => setFilter('active')}
          >
            进行中
          </button>
          <button 
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'ended' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            onClick={() => setFilter('ended')}
          >
            已结束
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="搜索项目名称或编号..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand-600 transition-all">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/index/projects/create')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">新建项目</span>
          </button>
        </div>
      </div>

      {/* 项目列表网格区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            {...project}
            onClick={() => navigate(`/index/projects/${project.id}`)}
            onDelete={() => alert(`删除项目: ${project.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
