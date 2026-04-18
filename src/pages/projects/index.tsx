import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus, Search, Filter, GitFork, AlertTriangle } from 'lucide-react';
import { PROJECTS } from '../../mock/projects';

export const ProjectList: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    setTitle('项目管理', '管理所有临床研究项目', [{ text: '所有角色', color: 'slate' }]);
  }, [setTitle]);

  const projects = PROJECTS;

  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status === '进行中';
    if (filter === 'ended') return p.status === '已结束';
    return true;
  });

  const handleDeleteClick = (id: string, name: string) => {
    setProjectToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      // 执行删除逻辑
      console.log('软删除项目:', projectToDelete.id);
    }
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">
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

      {/* 项目列表表格区 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">项目编号</th>
                <th className="px-6 py-4 w-1/3">项目名称</th>
                <th className="px-6 py-4 whitespace-nowrap">状态</th>
                <th className="px-6 py-4 whitespace-nowrap">负责人</th>
                <th className="px-6 py-4 whitespace-nowrap">进度</th>
                <th className="px-6 py-4 whitespace-nowrap">创建日期</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border bg-brand-50 text-brand-600 border-brand-100">
                      {project.code}
                    </span>
                    {project.isFission && (
                      <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <GitFork className="w-3 h-3" />
                        裂变
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 leading-relaxed">{project.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border ${project.status === '进行中' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {project.status === '进行中' && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      {project.status === '已结束' && (
                        <span className="flex h-2 w-2 relative">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300"></span>
                        </span>
                      )}
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.leader || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${Math.min(100, (project.currentCount / project.totalCount) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        <span className="text-brand-600">{project.currentCount}</span>
                        <span className="text-slate-400"> / {project.totalCount}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {project.date}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/index/projects/${project.id}`)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        查看详情
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(project.id, project.title)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    暂无项目数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-5">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">
                确认删除项目？
              </h3>
              <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
                您将删除项目 <span className="font-bold text-slate-700">"{projectToDelete?.name}"</span>。<br />
                <span className="text-red-500 font-medium">注意：此操作为软删除，数据库中的项目数据不会被清空，仅在当前列表中隐藏不再显示。</span>
              </p>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
