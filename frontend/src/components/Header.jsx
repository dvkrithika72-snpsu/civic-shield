import React from 'react';
import { Shield, Wifi, WifiOff, Volume2, UserCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { 
    isOfflineSimulated, setIsOfflineSimulated, 
    lang, setLang, 
    currentUser, logout, setActiveTab,
    isAudioPlaying, setIsAudioPlaying,
    flushOfflineCache,
    setIsDrawerOpen
  } = useAppContext();
  
  const { t, i18n } = useTranslation();

  const executeVoiceSynthesis = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Assuming voicePrompt is added to translation
    const utterance = new SpeechSynthesisUtterance(t('voicePrompt') || 'System Ready');
    const code = { 'en': 'en-US', 'hi': 'hi-IN', 'kn': 'kn-IN' }[lang];
    utterance.lang = code || 'en-US';
    utterance.onstart = () => setIsAudioPlaying(true);
    utterance.onend = () => setIsAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLang(val);
    i18n.changeLanguage(val);
    localStorage.setItem('civic_lang', val);
  };

  return (
    <header className="w-full bg-[#0F172A] dark:bg-slate-950 border-b border-slate-800 dark:border-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setActiveTab('home')}
      >
        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="text-lg text-white font-bold tracking-wide flex items-center gap-2">
          Civic<span className="text-emerald-400">Shield</span>
        </span>
      </div>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={executeVoiceSynthesis}
          className={`flex items-center space-x-2 text-xs transition-colors ${isAudioPlaying ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
          title="Voice Command"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {isOfflineSimulated ? (
          <button 
            onClick={flushOfflineCache}
            className="flex items-center space-x-2 text-[10px] sm:text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-all shadow-sm font-bold tracking-wide animate-pulse"
          >
            <span>[ 🔄 {t('header.forceSync')} ]</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full shadow-sm font-bold tracking-wide">
            <span>● {t('header.systemConnected')}</span>
          </div>
        )}
        
        <div className="h-4 w-[1px] bg-white/10"></div>
        
        <select
          value={lang}
          onChange={handleLanguageChange}
          className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer hover:text-white font-medium"
        >
          <option value="en" className="bg-[#0F172A]">EN</option>
          <option value="kn" className="bg-[#0F172A]">KN</option>
          <option value="hi" className="bg-[#0F172A]">HI</option>
        </select>
        
        {currentUser ? (
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <UserCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-200 font-medium">
                {currentUser.name} <span className="text-slate-500">({currentUser.role === 'citizen' ? t('roleCitizen') : t('roleAdmin')})</span>
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setActiveTab('auth')} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-md font-bold transition-all shadow-sm"
          >
            {t('buttons.accessPortal')}
          </button>
        )}
      </div>
    </header>
  );
};
