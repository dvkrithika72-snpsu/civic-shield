import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ShieldCheck, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
  const { setActiveTab, selectedCorporation, setIsLocationPickerOpen, setActiveModalContent } = useAppContext();
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();
  const lex = new Proxy({}, { get: (target, prop) => t(prop) });

  const faqs = [
    {
      q: t('faq.privacy.question'),
      a: t('faq.privacy.answer')
    },
    {
      q: t('faq.offline.question'),
      a: t('faq.offline.answer')
    },
    {
      q: t('faq.routing.question'),
      a: t('faq.routing.answer')
    },
    {
      q: t('faq.aiValidation.question'),
      a: t('faq.aiValidation.answer')
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-6">
      
      {/* Official Civic Landmark Hero Section */}
      <div className="grid md:grid-cols-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Left: Official Welcome Text & CTA */}
        <div className="p-8 md:p-12 lg:p-16 space-y-6 flex flex-col justify-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-1.5 rounded-full text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Government-Identity Verified Protocol</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.1]">
              {lex.mainHeadline}
            </h1>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            {lex.subHeadline}
          </p>
          
          <div className="pt-4">
            {selectedCorporation ? (
              <button 
                onClick={() => setActiveTab('auth')} 
                className="group w-full md:w-auto bg-[#059669] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-8 py-4 rounded-md text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Access Portal - {lex[`corps.${selectedCorporation}`] || selectedCorporation} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => setIsLocationPickerOpen(true)} 
                className="group w-full md:w-auto bg-[#0F172A] hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 px-8 py-4 rounded-md text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {t('buttons.selectCorp')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Civic Landmark Visual & Badge */}
        <div className="relative h-72 md:h-full min-h-[400px] w-full border-l border-slate-200 dark:border-slate-800">
          <img 
            src="/images/civic-hero.jpg" 
            alt="Civic Workers" 
            className="absolute inset-0 w-full h-full object-cover dark:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg inline-block max-w-sm">
              <p className="text-white font-bold text-sm leading-relaxed tracking-wide shadow-sm">
                {lex.heroBadgeText}
              </p>
            </div>
          </div>
        </div>
        
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-8 text-center">{lex['landing.faqTitle']}</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-bold text-[#0F172A] dark:text-white text-sm">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 pt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 animate-in fade-in slide-in-from-top-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* About the National Civic Redressal Initiative */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50 dark:opacity-20 dark:invert"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">{lex['landing.about.title']}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {lex['landing.about.desc']}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-[#0F172A] dark:text-white">3,421</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-2 tracking-wider">{lex['landing.stats.activeDispatches']}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-[#059669] dark:text-emerald-400">98.4%</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-2 tracking-wider">{lex['landing.stats.resolutionEfficiency']}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Enterprise Sitemap Footer */}
      <div className="pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.explore']}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.dashboard'], id: 'dashboard' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.dashboard']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.coverageMaps'], id: 'coverageMaps' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.coverageMaps']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.liveFeeds'], id: 'liveFeeds' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.liveFeeds']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.regionalImpact'], id: 'regionalImpact' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.regionalImpact']}</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.learnHelp']}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.supportDesk'], id: 'supportDesk' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.supportDesk']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.documentation'], id: 'documentation' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.documentation']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.systemStatus'], id: 'systemStatus' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.systemStatus']}</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.municipalPartners']}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="https://bbmp.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.bbmpCommand']}</a></li>
              <li><a href="https://portal.mcgm.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.bmcCentral']}</a></li>
              <li><a href="https://mohua.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.urbanDevMinistry']}</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.termsPolicy']}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.termsOfService'], id: 'terms' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.termsOfService']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.privacyPolicy'], id: 'privacy' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.privacyPolicy']}</button></li>
              <li><button onClick={(e) => { e.preventDefault(); setActiveModalContent({ title: lex['landing.footer.dataRetention'], id: 'dataRetention' })}} className="hover:text-[#0F172A] dark:hover:text-white transition-colors text-left">{lex['landing.footer.dataRetention']}</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
