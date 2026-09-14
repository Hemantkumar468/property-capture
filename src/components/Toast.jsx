import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ toastMsg }) {
  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#171722] text-white px-5 py-2.5 rounded-xl text-[13px] font-medium shadow-2xl z-50 flex items-center gap-2 border border-white/10 animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-[#1E9E5A]" />
      <span>{toastMsg}</span>
    </div>
  );
}
