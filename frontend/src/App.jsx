import React from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { ReportingDashboard } from './components/ReportingDashboard';
import { AdminPanel } from './components/AdminPanel';
import { LocationPickerModal } from './components/LocationPickerModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { LogoutModal } from './components/LogoutModal';
import { InfoModals } from './components/InfoModals';
import { InfoModal } from './components/InfoModal';
import { CivicAssistant } from './components/CivicAssistant';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
  const { activeTab, setActiveTab, globalAlert, isGalleryOpen, setIsGalleryOpen, isLocationPickerOpen } = useAppContext();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/20">
      <Header />

      <main className="relative min-h-[calc(100vh-73px)] overflow-hidden">
        {/* Subtle Civic Landmark Watermark Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-center bg-cover bg-no-repeat bg-fixed opacity-[0.12] grayscale mix-blend-multiply"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=80')" }}
        />

        <div className="relative z-10">
          {/* Global Breadcrumb Navigation */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center text-xs font-bold text-slate-500 dark:text-slate-400">
              <button onClick={() => setActiveTab('home')} className="hover:text-[#0F172A] dark:hover:text-white transition-colors flex items-center gap-1">
                {t('navbar.home')}
              </button>
              {activeTab === 'auth' && (
                <><span className="mx-2 text-slate-300">/</span><span className="text-[#0F172A]">{t('loginTitle')}</span></>
              )}
              {activeTab === 'report' && (
                <>
                  <span className="mx-2 text-slate-300">/</span>
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className={`hover:text-[#0F172A] dark:hover:text-white transition-colors ${!isGalleryOpen ? 'text-[#0F172A] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {t('navbar.report')}
                  </button>
                  <span className="mx-2 text-slate-300">/</span>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className={`hover:text-[#0F172A] dark:hover:text-white transition-colors ${isGalleryOpen ? 'text-[#0F172A] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {t('uploadHeadline')}
                  </button>
                </>
              )}
              {activeTab === 'admin' && (
                <><span className="mx-2 text-slate-300">/</span><span className="text-[#0F172A]">{t('navbar.admin')}</span></>
              )}
            </div>
          </div>
          {/* Global Alert Toast */}
          {globalAlert && (
            <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl pointer-events-none">
              <div className={`p-4 rounded-xl border backdrop-blur-xl text-sm font-bold shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 ${globalAlert.classes} dark:border-opacity-20`}>
                {globalAlert.message}
              </div>
            </div>
          )}

          {activeTab === 'home' && <LandingPage />}
          {activeTab === 'auth' && <><LandingPage /><AuthModal /></>}
          {activeTab === 'report' && <ReportingDashboard />}
          {activeTab === 'admin' && <AdminPanel />}
        </div>
      </main>

      {/* Global Modals (Outside of main to avoid stacking context trapping) */}
      {isLocationPickerOpen && <LocationPickerModal />}
      <ProfileDrawer />
      <LogoutModal />
      <InfoModals />
      <InfoModal />
      <CivicAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}