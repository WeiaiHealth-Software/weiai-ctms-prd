import React from 'react';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { Plus, X } from 'lucide-react';

export const Step1BasicInfo: React.FC = () => {
  const { basicInfo, updateBasicInfo } = useProjectWizardStore();

  const handleCriteriaAdd = (type: 'inclusion' | 'exclusion') => {
    const key = type === 'inclusion' ? 'inclusionCriteria' : 'exclusionCriteria';
    updateBasicInfo({
      [key]: [...basicInfo[key], '']
    });
  };

  const handleCriteriaChange = (type: 'inclusion' | 'exclusion', index: number, value: string) => {
    const key = type === 'inclusion' ? 'inclusionCriteria' : 'exclusionCriteria';
    const newList = [...basicInfo[key]];
    newList[index] = value;
    updateBasicInfo({ [key]: newList });
  };

  const handleCriteriaRemove = (type: 'inclusion' | 'exclusion', index: number) => {
    const key = type === 'inclusion' ? 'inclusionCriteria' : 'exclusionCriteria';
    const newList = basicInfo[key].filter((_, i) => i !== index);
    updateBasicInfo({ [key]: newList });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <div className="md:col-span-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">项目名称 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors" 
            placeholder="例如：儿童近视防控临床研究"
            value={basicInfo.name}
            onChange={(e) => updateBasicInfo({ name: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">项目码 (Code) <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm font-mono uppercase focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors" 
            placeholder="CODE_2024"
            value={basicInfo.code}
            onChange={(e) => updateBasicInfo({ code: e.target.value })}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">随机码前缀 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm font-mono uppercase focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors" 
            placeholder="如 R"
            value={basicInfo.randomPrefix}
            onChange={(e) => updateBasicInfo({ randomPrefix: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">产品码前缀 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm font-mono uppercase focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors" 
            placeholder="如 D"
            value={basicInfo.productPrefix}
            onChange={(e) => updateBasicInfo({ productPrefix: e.target.value })}
          />
        </div>
        
        <div className="md:col-span-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">是否共享数据</label>
          <label className="relative inline-flex items-center cursor-pointer mt-1.5">
            <input type="checkbox" className="sr-only peer" checked={basicInfo.isShared} onChange={(e) => updateBasicInfo({ isShared: e.target.checked })} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            <span className={`ml-3 text-sm font-medium ${basicInfo.isShared ? 'text-brand-600 font-bold' : 'text-slate-500'}`}>
              {basicInfo.isShared ? '共享' : '不共享'}
            </span>
          </label>
        </div>
        <div className="md:col-span-3 relative flex items-end gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">是否双盲</label>
            <label className="relative inline-flex items-center cursor-pointer mt-1.5">
              <input type="checkbox" className="sr-only peer" checked={basicInfo.isBlind} onChange={(e) => updateBasicInfo({ isBlind: e.target.checked })} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              <span className={`ml-3 text-sm font-medium ${basicInfo.isBlind ? 'text-brand-600 font-bold' : 'text-slate-500'}`}>
                {basicInfo.isBlind ? '开启' : '不开启'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-bold text-slate-700 mb-2">项目描述</label>
        <textarea 
          rows={2} 
          className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors" 
          placeholder="简述项目的研究目的、背景及主要入排标准..."
          value={basicInfo.description}
          onChange={(e) => updateBasicInfo({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">关联研究中心 <span className="text-red-500">*</span></label>
          <select 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
            value={basicInfo.centers[0] || ''}
            onChange={(e) => updateBasicInfo({ centers: [e.target.value] })}
          >
            <option value="">已选择 1 个中心</option>
            <option value="1">上海眼病防治中心</option>
            <option value="2">北京同仁医院</option>
          </select>
        </div>
        <div className="md:col-span-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">项目负责人 <span className="text-red-500">*</span></label>
          <select 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
            value={basicInfo.leader}
            onChange={(e) => updateBasicInfo({ leader: e.target.value })}
          >
            <option value="">请选择负责人...</option>
            <option value="admin">王强 (徐州眼视光中心)</option>
          </select>
        </div>
        <div className="md:col-span-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">协作医生</label>
          <select 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
            value={basicInfo.collab}
            onChange={(e) => updateBasicInfo({ collab: e.target.value })}
          >
            <option value="">请选择协作医生...</option>
            <option value="doctor1">李医生</option>
          </select>
        </div>
        <div className="md:col-span-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">临床研究协调员 CRC <span className="text-red-500">*</span></label>
          <select 
            className="w-full rounded-lg border-slate-300 bg-slate-50 border px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
            value={basicInfo.crc}
            onChange={(e) => updateBasicInfo({ crc: e.target.value })}
          >
            <option value="">已选择 1 人</option>
            <option value="crc1">张协调员</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">纳入标准</label>
          <div className="space-y-3 mb-4">
            {basicInfo.inclusionCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 rounded-lg border-slate-200 bg-white border px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  value={criteria}
                  onChange={(e) => handleCriteriaChange('inclusion', index, e.target.value)}
                  placeholder={`标准 ${index + 1}`}
                />
                <button onClick={() => handleCriteriaRemove('inclusion', index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => handleCriteriaAdd('inclusion')} className="w-full py-2.5 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-600 text-sm font-bold hover:bg-emerald-50 hover:border-emerald-300 transition-all flex justify-center items-center gap-1">
            <Plus className="w-4 h-4" /> 添加纳入标准
          </button>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">排除标准</label>
          <div className="space-y-3 mb-4">
            {basicInfo.exclusionCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 rounded-lg border-slate-200 bg-white border px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                  value={criteria}
                  onChange={(e) => handleCriteriaChange('exclusion', index, e.target.value)}
                  placeholder={`标准 ${index + 1}`}
                />
                <button onClick={() => handleCriteriaRemove('exclusion', index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => handleCriteriaAdd('exclusion')} className="w-full py-2.5 border-2 border-dashed border-red-200 rounded-xl text-red-600 text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-all flex justify-center items-center gap-1">
            <Plus className="w-4 h-4" /> 添加排除标准
          </button>
        </div>
      </div>
    </div>
  );
};
