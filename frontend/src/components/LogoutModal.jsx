import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { LogOut, X, CheckCircle2 } from 'lucide-react';

export const LogoutModal = () => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout, setActiveTab } = useAppContext();
  const [phase, setPhase] = useState('confirm'); // 'confirm', 'success'

  if (!isLogoutModalOpen) {
    if (phase !== 'confirm') setPhase('confirm');
    return null;
  }

  const handleClose = () => {
    setIsLogoutModalOpen(false);
    setTimeout(() => setPhase('confirm'), 300);
  };

  const handleConfirmLogout = () => {
    setPhase('success');
  };

  const handleFinalizeLogout = () => {
    handleClose();
    logout();
    setActiveTab('auth');
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={phase === 'confirm' ? handleClose : undefined}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative text-center"
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl relative p-8 text-center border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === 'confirm' ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-2">
              <LogOut className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] dark:text-white">Oh no! You're leaving...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Are you sure you want to log out of the Civic Shield portal?</p>
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleConfirmLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Yes, Log Me Out
              </button>
              <button 
                onClick={handleClose}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors"
              >
                Nah, Just Kidding
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] dark:text-white">You've successfully logged out</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Your session has been securely cleared. See you next time!</p>
            <div className="pt-4">
              <button 
                onClick={handleFinalizeLogout}
                className="w-full bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-slate-800 dark:hover:bg-slate-200 font-bold py-3 rounded-xl transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
