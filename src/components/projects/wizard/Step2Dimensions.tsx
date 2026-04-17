import React from 'react';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { AVAILABLE_DIMENSIONS } from '../../../constants/dimensions';

export const Step2Dimensions: React.FC = () => {
  const { selectedDimensions, updateDimensions } = useProjectWizardStore();

  const handleToggleDimension = (id: string) => {
    if (selectedDimensions.includes(id)) {
      updateDimensions(selectedDimensions.filter(d => d !== id));
    } else {
      updateDimensions([...selectedDimensions, id]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">维度选择</h3>
        <p className="text-sm text-slate-500 mb-6">选择系统维护的自定义维度名称和选项，维度将决定后续的分组因子组合。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_DIMENSIONS.map(dim => {
            const isSelected = selectedDimensions.includes(dim.id);
            return (
              <div 
                key={dim.id}
                onClick={() => handleToggleDimension(dim.id)}
                className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all shadow-sm relative overflow-hidden group ${
                  isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="mt-1 h-5 w-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 pointer-events-none" 
                />
                <div className="ml-4">
                  <span className={`block text-base font-bold transition-colors ${isSelected ? 'text-brand-700' : 'text-slate-700 group-hover:text-brand-600'}`}>
                    {dim.name}
                  </span>
                  <div className={`mt-2 text-xs ${isSelected ? 'text-brand-600/70' : 'text-slate-500'}`}>
                    {dim.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDimensions.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-100 animate-fade-in">
          <h3 className="text-lg font-bold text-slate-900">已选维度配置预览</h3>
          <div className="space-y-4">
            {selectedDimensions.map(id => {
              const dim = AVAILABLE_DIMENSIONS.find(d => d.id === id)!;
              return (
                <div key={dim.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{dim.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">系统内置维度，不可修改选项</p>
                  </div>
                  <div className="flex gap-2">
                    {dim.options.map(opt => (
                      <span key={opt} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
