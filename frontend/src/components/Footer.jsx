import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const lex = new Proxy({}, { get: (target, prop) => t(prop) });

  return (
    <div className="pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 mt-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.explore']}</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/dashboard" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.dashboard']}</Link></li>
            <li><Link to="/coverage-maps" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.coverageMaps']}</Link></li>
            <li><Link to="/live-feeds" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.liveFeeds']}</Link></li>
            <li><Link to="/impact-analytics" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.regionalImpact']}</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">{lex['landing.footer.learnHelp']}</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/support" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.supportDesk']}</Link></li>
            <li><Link to="/documentation" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.documentation']}</Link></li>
            <li><Link to="/system-status" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.systemStatus']}</Link></li>
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
            <li><Link to="/terms" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.termsOfService']}</Link></li>
            <li><Link to="/privacy" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.privacyPolicy']}</Link></li>
            <li><Link to="/data-retention" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">{lex['landing.footer.dataRetention']}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
