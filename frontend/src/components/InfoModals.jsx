import React, { useState, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { X, UserCircle, Settings, Bell, HelpCircle, Info, Moon, Mail, Globe, Shield, DownloadCloud, ArrowLeft, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const InfoModals = () => {
  const { 
    activeModal, setActiveModal, currentUser,
    theme, setTheme,
    pushNotifications, setPushNotifications,
    emailUpdates, setEmailUpdates,
    locationServices, setLocationServices,
    dataSaverMode, setDataSaverMode,
    offlineSync, setOfflineSync,
    profilePhoto, setProfilePhoto,
    setIsDrawerOpen
  } = useAppContext();

  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  if (!activeModal || !currentUser) return null;

  const handleClose = () => {
    setActiveModal(null);
    setIsDrawerOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
    }
  };

  const renderContent = () => {
    switch (activeModal) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm mb-4 relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserCircle className="w-16 h-16 text-[#059669] dark:text-emerald-400 group-hover:opacity-50 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold flex-col gap-1">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              
              <h3 className="font-bold text-2xl text-[#0F172A] dark:text-white">{currentUser.name}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{currentUser.name.toLowerCase().replace(' ', '.')}@civicshield.gov</p>
              <span className="inline-block bg-[#0F172A] dark:bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-2">
                {currentUser.role === 'citizen' ? t('roleCitizen') : t('roleAdmin')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-3xl font-black text-[#059669] dark:text-emerald-400">12</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{t('infoModals.profile.totalReports')}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-3xl font-black text-[#059669] dark:text-emerald-400">8</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{t('infoModals.profile.resolved')}</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"><Settings className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl text-[#0F172A] dark:text-white">{t('infoModals.settings.title')}</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Moon, title: t('infoModals.settings.darkModeTitle'), desc: t('infoModals.settings.darkModeDesc'), isOn: theme === 'dark', onToggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
                { icon: Bell, title: t('infoModals.settings.pushTitle'), desc: t('infoModals.settings.pushDesc'), isOn: pushNotifications, onToggle: () => setPushNotifications(!pushNotifications) },
                { icon: Mail, title: t('infoModals.settings.emailTitle'), desc: t('infoModals.settings.emailDesc'), isOn: emailUpdates, onToggle: () => setEmailUpdates(!emailUpdates) },
                { icon: Globe, title: t('infoModals.settings.locTitle'), desc: t('infoModals.settings.locDesc'), isOn: locationServices, onToggle: () => setLocationServices(!locationServices) },
                { icon: Shield, title: t('infoModals.settings.dataTitle'), desc: t('infoModals.settings.dataDesc'), isOn: dataSaverMode, onToggle: () => setDataSaverMode(!dataSaverMode) },
                { icon: DownloadCloud, title: t('infoModals.settings.offlineTitle'), desc: t('infoModals.settings.offlineDesc'), isOn: offlineSync, onToggle: () => setOfflineSync(!offlineSync) },
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <setting.icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] dark:text-white">{setting.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{setting.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch isOn={setting.isOn} onToggle={setting.onToggle} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Bell className="w-6 h-6" /></div>
                <h3 className="font-bold text-xl text-[#0F172A] dark:text-white">{t('infoModals.notifications.title')}</h3>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">2 {t('infoModals.notifications.newBadge')}</span>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <NotificationItem 
                title={t('infoModals.notifications.n1Title')} 
                time={t('infoModals.notifications.n1Time')} 
                desc={t('infoModals.notifications.n1Desc')}
                isNew={true}
              />
              <NotificationItem 
                title={t('infoModals.notifications.n2Title')} 
                time={t('infoModals.notifications.n2Time')} 
                desc={t('infoModals.notifications.n2Desc')}
                isNew={true}
              />
              <NotificationItem 
                title={t('infoModals.notifications.n3Title')} 
                time={t('infoModals.notifications.n3Time')} 
                desc={t('infoModals.notifications.n3Desc')}
                isNew={false}
              />
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-6">
             <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><HelpCircle className="w-6 h-6" /></div>
              <h3 className="font-bold text-xl text-[#0F172A] dark:text-white">{t('infoModals.faq.title')}</h3>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <FaqItem q={t('infoModals.faq.q1')} a={t('infoModals.faq.a1')} />
              <FaqItem q={t('infoModals.faq.q2')} a={t('infoModals.faq.a2')} />
              <FaqItem q={t('infoModals.faq.q3')} a={t('infoModals.faq.a3')} />
              <FaqItem q={t('infoModals.faq.q4')} a={t('infoModals.faq.a4')} />
              <FaqItem q={t('infoModals.faq.q5')} a={t('infoModals.faq.a5')} />
              <FaqItem q={t('infoModals.faq.q6')} a={t('infoModals.faq.a6')} />
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6 text-center">
             <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 mb-4 shadow-sm">
                <Shield className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
             </div>
             <h3 className="font-black text-2xl text-[#0F172A] dark:text-white">{t('infoModals.about.title')}</h3>
             <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">{t('infoModals.about.version')}</p>
             
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left">
               {t('infoModals.about.desc')}
             </p>

             <div className="text-xs text-slate-400 dark:text-slate-500 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                &copy; {new Date().getFullYear()} {t('infoModals.about.copyright')}
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] flex flex-col border dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-t-3xl border-b border-transparent">
          <button 
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('infoModals.goBack')}
          </button>
          
          <button 
            onClick={handleClose}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-8 pb-8 pt-2 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Modals ---

const ToggleSwitch = ({ isOn, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors relative ${isOn ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
    </button>
  );
};

const NotificationItem = ({ title, time, desc, isNew }) => (
  <div className={`p-4 rounded-xl border ${isNew ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'}`}>
    <div className="flex justify-between items-start mb-1">
      <h4 className={`text-sm font-bold ${isNew ? 'text-[#0F172A] dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{title}</h4>
      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{time}</span>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex justify-between items-center"
      >
        <span className="text-sm font-bold text-[#0F172A] dark:text-white pr-4">{q}</span>
        <span className="text-slate-400 dark:text-slate-500 font-bold text-xl leading-none">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};
