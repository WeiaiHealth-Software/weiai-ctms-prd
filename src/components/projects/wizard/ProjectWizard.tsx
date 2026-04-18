import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../../store/useHeaderStore';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Dimensions } from './Step2Dimensions';
import { Step3Grouping } from './Step3Grouping';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const ProjectWizard: React.FC = () => {
  const { currentStep, setStep, reset } = useProjectWizardStore();
  const setTitle = useHeaderStore(state => state.setTitle);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('创建新项目', '请按照向导指引完成临床研究项目的各项初始化配置', [
      { text: '系统向导', color: 'brand' }
    ]);
  }, [setTitle]);

  const handleClose = () => {
    reset();
    navigate('/index/projects');
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setStep(currentStep + 1);
    } else {
      // 提交逻辑
      console.log('提交项目配置');
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-slate-50">
      {/* 进度指示器 */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full -z-10 overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
          </div>
          
          {[
            { step: 1, title: '基础设置', desc: '项目基本信息' },
            { step: 2, title: '维度选择', desc: '配置实验维度' },
            { step: 3, title: '分组配置', desc: '设定分组与人数' }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center w-1/3 group cursor-pointer" onClick={() => setStep(item.step)}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ring-4 ring-white ${
                currentStep >= item.step 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-110' 
                  : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                {item.step}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-sm font-bold transition-colors ${currentStep >= item.step ? 'text-slate-800' : 'text-slate-400'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50 relative">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-5xl mx-auto w-full min-h-full">
          {currentStep === 1 && <Step1BasicInfo />}
          {currentStep === 2 && <Step2Dimensions />}
          {currentStep === 3 && <Step3Grouping />}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="bg-white border-t border-slate-200 p-5 px-8 flex justify-between items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] sticky bottom-0 z-20 flex-shrink-0">
        <button 
          onClick={handlePrev} 
          className={`px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ArrowLeft className="w-4 h-4" /> 上一步
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleClose} 
            className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleNext} 
            className="px-8 py-2.5 rounded-xl bg-brand-600 text-white font-bold shadow-xl shadow-brand-500/30 hover:bg-brand-700 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            {currentStep === 3 ? '完成创建' : '下一步'} 
            {currentStep !== 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
