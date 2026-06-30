import React from 'react';
import { useAppContext } from '../store/AppContext';
import { X, User, Settings, Bell, Clock, HelpCircle, Info, LogOut, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ProfileDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen, setIsLogoutModalOpen, currentUser, setActiveTab, triggerAlert, setActiveModal, profilePhoto } = useAppContext();
  const { t } = useTranslation();

  if (!isDrawerOpen || !currentUser) return null;

  const handleLogoutClick = () => {
    setIsDrawerOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleIncidentHistoryClick = () => {
    setActiveTab('report');
    setIsDrawerOpen(false);
  };

  const handleOpenModal = (modalName) => {
    setIsDrawerOpen(false);
    setActiveModal(modalName);
  };

  const menuItems = [
    { icon: User, label: t('profileDrawer.myProfile'), onClick: () => handleOpenModal('profile') },
    { icon: Settings, label: t('profileDrawer.settings'), onClick: () => handleOpenModal('settings') },
    { icon: Bell, label: t('profileDrawer.notifications'), onClick: () => handleOpenModal('notifications') },
    { icon: Clock, label: t('profileDrawer.incidentHistory'), onClick: handleIncidentHistoryClick },
    { icon: HelpCircle, label: t('profileDrawer.faq'), onClick: () => handleOpenModal('faq') },
    { icon: Info, label: t('profileDrawer.aboutApp'), onClick: () => handleOpenModal('about') },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={() => setIsDrawerOpen(false)}
      />
      <div 
        className="fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl z-[110] flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
      >
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 relative">
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm mb-3">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCircle className="w-12 h-12 text-[#059669] dark:text-emerald-400" />
              )}
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] dark:text-white">{currentUser.name}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{currentUser.name.toLowerCase().replace(' ', '.')}@civicshield.gov</p>
            <span className="inline-block bg-[#0F172A] dark:bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">
              {currentUser.role === 'citizen' ? t('roleCitizen') : t('roleAdmin')}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-4">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx}>
                  <button 
                    onClick={item.onClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('profileDrawer.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};
