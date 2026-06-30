import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PlaceholderLayout = ({ title }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-4xl mx-auto my-12">
    <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-1.5 rounded-full text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-6">
      <ShieldCheck className="w-4 h-4" />
      <span>Secure Routing Activated</span>
    </div>
    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-4">{title}</h1>
    <p className="text-slate-600 dark:text-slate-400">This module is currently being configured by the administrative team.</p>
  </div>
);

export const DashboardPage = () => <PlaceholderLayout title="Municipal Dashboard" />;
export const CoverageMapsPage = () => <PlaceholderLayout title="Coverage Maps" />;
export const LiveFeedsPage = () => <PlaceholderLayout title="Live Camera Feeds" />;
export const ImpactAnalyticsPage = () => <PlaceholderLayout title="Regional Impact Analytics" />;
export const SupportPage = () => <PlaceholderLayout title="Support Desk" />;
export const DocumentationPage = () => <PlaceholderLayout title="Documentation" />;
export const SystemStatusPage = () => <PlaceholderLayout title="System Status" />;
export const TermsPage = () => <PlaceholderLayout title="Terms of Service" />;
export const PrivacyPage = () => <PlaceholderLayout title="Privacy Policy" />;
export const DataRetentionPage = () => <PlaceholderLayout title="Data Retention Guidelines" />;
