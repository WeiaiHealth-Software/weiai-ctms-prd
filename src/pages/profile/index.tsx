import React, { useEffect } from 'react';
import { useHeaderStore } from '@/store/useHeaderStore';

export const Profile: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);

  useEffect(() => {
    setTitle('个人中心', '查看与维护个人信息（占位）', []);
  }, [setTitle]);

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="text-sm text-slate-600">个人中心页面占位</div>
      </div>
    </div>
  );
};

