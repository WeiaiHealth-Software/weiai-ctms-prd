import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { Plus, Search, Filter } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  useEffect(() => {
    setTitle('项目管理', '管理所有临床研究项目', [{ text: '所有角色', color: 'slate' }]);
  }, [setTitle]);

  const projects = [
    {
      id: 'p1',
      code: 'CHILD_ELESCREEN',
      status: '进行中' as const,
      title: '光刻微结构近视管理镜片在儿童青少年近视防控中的有效性及佩戴安全舒适性的随机对照临床研究',
      date: '2025-12-25',
      description: '主要目的：评价不同光刻微结构近视管理镜片对控制儿童青少年近视进展的有效性和佩戴的安全舒适性，探索对近视防控有效的离焦微透镜设计及光刻微结构近视管理镜片应用于近视防控的可行性。次要目的：了解和分析儿童青少年近视防控诊疗情况和相关影响因素，例如初发年龄、性别、佩戴时长、用眼习惯等。',
      currentCount: 46,
      totalCount: 100,
      themeColor: 'brand' as const,
      isFission: false
    },
    {
      id: 'p2',
      code: 'CARDIO_01',
      status: '进行中' as const,
      title: '冠心病介入治疗术后心脏康复分级干预策略的多中心随机对照研究',
      date: '2024-06-30',
      description: '本研究旨在评价冠心病患者在经皮冠状动脉介入治疗(PCI)后，采用不同级别的心脏康复干预策略(包括运动处方、营养指导、心理干预)对改善患者心肺运动耐量、降低主要不良心血管事件(MACE)发生率的作用。',
      currentCount: 380,
      totalCount: 1000,
      themeColor: 'indigo' as const,
      isFission: true
    },
    {
      id: 'p3',
      code: 'GLAUCOMA_PH3',
      status: '已结束' as const,
      title: '新型降眼压滴眼液在原发性开角型青光眼患者中的 III 期临床试验',
      date: '2023-11-15',
      description: '评估试验药物在原发性开角型青光眼或高眼压症患者中连续使用 12 周降低眼内压(IOP)的疗效和安全性。与现有的一线前列腺素类药物进行非劣效性比较。',
      currentCount: 240,
      totalCount: 240,
      themeColor: 'brand' as const,
      isFission: false
    }
  ];

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
            全部项目 <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">3</span>
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
            onClick={() => alert(`导航到项目详情: ${project.id}`)}
            onDelete={() => alert(`删除项目: ${project.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
