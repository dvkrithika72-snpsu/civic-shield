import React from 'react';
import { useAppContext } from '../store/AppContext';
import { X, ShieldCheck } from 'lucide-react';
import { footerContent } from '../utils/footerContent';

export const InfoModal = () => {
  const { activeModalContent, setActiveModalContent } = useAppContext();

  if (!activeModalContent) return null;
  
  // Extract content based on id if it exists, otherwise fallback to the content string
  const content = activeModalContent.id ? footerContent[activeModalContent.id] : activeModalContent.content;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={() => setActiveModalContent(null)}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-t-3xl border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-[#0F172A] dark:text-white">{activeModalContent.title}</h3>
          </div>
          <button 
            onClick={() => setActiveModalContent(null)}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-loose space-y-6">
            {content || <p>Content is currently being updated by the administration.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

