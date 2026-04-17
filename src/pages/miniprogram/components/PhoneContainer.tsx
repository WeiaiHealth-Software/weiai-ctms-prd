import React from 'react';

export const PhoneContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-[360px] h-[700px] bg-slate-100 rounded-[30px] border-[12px] border-slate-800 overflow-hidden shadow-2xl shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-slate-800 rounded-b-xl z-50"></div>
      {children}
    </div>
  );
};
