import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { municipalCorporations } from '../utils/data';
import { User, ShieldAlert, LogIn, X, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AuthModal = () => {
  const { login, setActiveTab, adminPasswords, registerAdmin, selectedCorporation } = useAppContext();
  const { t } = useTranslation();
  const lex = new Proxy({}, { get: (target, prop) => t(prop) });

  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('citizen');
  const [adminType, setAdminType] = useState(selectedCorporation || 'central');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [citizenWard, setCitizenWard] = useState(selectedCorporation || 'BMC');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');

    if (recoveryStep === 1) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        if (recoveryKey === 'DEMO-SECRET') {
          setRecoveryStep(2);
        } else {
          setAuthError('Recovery Denied: Invalid Security Key for this Branch.');
        }
      }, 1500);
    } else if (recoveryStep === 2) {
      if (adminPassword !== confirmAdminPassword) {
        setAuthError('Registration Error: Passwords do not match.');
        return;
      }
      registerAdmin(adminType, adminPassword);
      setSuccessMsg('Password reset successful. Redirecting to Login...');
      setTimeout(() => {
        setIsRecovering(false);
        setRecoveryStep(1);
        setRecoveryKey('');
        setAdminPassword('');
        setConfirmAdminPassword('');
        setSuccessMsg('');
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');
    if (authName.trim()) {
      if (authRole === 'admin') {
        if (isRegistering) {
          if (adminPassword !== confirmAdminPassword) {
            setAuthError('Registration Error: Passwords do not match.');
            return;
          }
          registerAdmin(adminType, adminPassword);
          setSuccessMsg('Account successfully created for this Municipal Corporation! Shifting to login phase...');
          setAdminPassword('');
          setConfirmAdminPassword('');
          setTimeout(() => {
            setSuccessMsg('');
            setIsRegistering(false);
          }, 2000);
          return;
        } else {
          if (adminPassword !== adminPasswords[adminType]) {
            setAuthError('Error: Authentication failed for this specific Municipal Corporation. Session access denied.');
            setAdminPassword('');
            return;
          }
        }
      }
      const finalRole = authRole === 'admin' ? adminType : 'citizen';
      const finalCity = authRole === 'citizen' ? citizenWard : null;
      login(authName, finalRole, finalCity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={() => setActiveTab('home')}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setActiveTab('home')}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-[#0F172A] dark:hover:text-white transition-colors z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6 overflow-y-auto w-full custom-scrollbar">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
              {isRecovering ? "Secure Account Recovery" : lex.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isRecovering ? "Verify identity to reset your municipal credentials." : lex.subtitle}
            </p>
          </div>

          {isRecovering ? (
            <form onSubmit={handleRecoverySubmit} className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Municipal Branch Dropdown</label>
                <select 
                  value={adminType}
                  onChange={(e) => setAdminType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all appearance-none"
                  required
                  disabled={recoveryStep === 2 || isVerifying}
                >
                  <option value="central">{lex['corps.central']}</option>
                  {municipalCorporations.map(corp => (
                    <option key={corp.id} value={corp.id}>{lex['authModal.corpHead']}: {lex[`corps.${corp.id}`]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Admin Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={authName} 
                    onChange={(e) => setAuthName(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                    placeholder="Enter your username" 
                    required
                    disabled={recoveryStep === 2 || isVerifying}
                  />
                </div>
              </div>

              {recoveryStep === 1 && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Verification Key (Security Check)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      value={recoveryKey} 
                      onChange={(e) => setRecoveryKey(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                      placeholder="Enter 'DEMO-SECRET'" 
                      required
                      disabled={isVerifying}
                    />
                  </div>
                </div>
              )}

              {recoveryStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        value={adminPassword} 
                        onChange={(e) => setAdminPassword(e.target.value)} 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                        placeholder="••••••••••••" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        value={confirmAdminPassword} 
                        onChange={(e) => setConfirmAdminPassword(e.target.value)} 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                        placeholder="••••••••••••" 
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {authError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-4">
                  <p className="text-red-700 text-xs font-bold">{authError}</p>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mt-4">
                  <p className="text-emerald-700 text-xs font-bold">{successMsg}</p>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="w-full bg-[#059669] hover:bg-emerald-700 py-3.5 rounded-md text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Security Verification in Progress...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      {recoveryStep === 1 ? "Authenticate Identity" : "Confirm & Reset Password"}
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsRecovering(false);
                      setRecoveryStep(1);
                      setAuthError('');
                      setSuccessMsg('');
                      setRecoveryKey('');
                    }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold hover:underline transition-colors"
                  >
                    Cancel Recovery and Return to Login
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">{lex.labelName}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={authName} 
                  onChange={(e) => setAuthName(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                  placeholder={lex.placeholderName}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">{lex.labelRole}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAuthRole('citizen')}
                  className={`py-3 rounded-md text-sm font-bold border transition-all ${
                    authRole === 'citizen' 
                      ? 'bg-[#0F172A] dark:bg-emerald-600 border-[#0F172A] dark:border-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lex.roleCitizen}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole('admin')}
                  className={`py-3 rounded-md text-sm font-bold border transition-all ${
                    authRole === 'admin' 
                      ? 'bg-[#0F172A] dark:bg-emerald-600 border-[#0F172A] dark:border-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lex.roleAdmin}
                </button>
              </div>
            </div>

            {authRole === 'admin' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">{lex.labelBranch}</label>
                  <select 
                    value={adminType}
                    onChange={(e) => setAdminType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all appearance-none"
                    required
                  >
                    <option value="central">{lex['corps.central']}</option>
                    {municipalCorporations.map(corp => (
                      <option key={corp.id} value={corp.id}>{lex['authModal.corpHead']}: {lex[`corps.${corp.id}`]}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Strict Secure Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                      placeholder="••••••••••••" 
                      required
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">Confirm Admin Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        value={confirmAdminPassword} 
                        onChange={(e) => setConfirmAdminPassword(e.target.value)} 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all placeholder:text-slate-400" 
                        placeholder="••••••••••••" 
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {authRole === 'citizen' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-200 ml-1">{lex.labelBranch}</label>
                <select 
                  value={citizenWard}
                  onChange={(e) => setCitizenWard(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all appearance-none"
                >
                  {municipalCorporations.map(corp => (
                    <option key={corp.id} value={corp.id}>{lex[`corps.${corp.id}`]}</option>
                  ))}
                </select>
              </div>
            )}

            {authError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-4">
                <p className="text-red-700 text-xs font-bold">{authError}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mt-4">
                <p className="text-emerald-700 text-xs font-bold">{successMsg}</p>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button 
                type="submit" 
                className="w-full bg-[#059669] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 py-3.5 rounded-md text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {authRole === 'admin' && isRegistering ? "Initialize & Register Branch Account" : lex.btnSubmit}
              </button>

              {authRole === 'admin' && (
                <div className="text-center space-y-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setAuthError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-[#059669] hover:text-[#047857] font-bold hover:underline transition-colors block w-full"
                  >
                    {isRegistering ? "Already have an account? Login here." : "New Branch Admin? Register & Set Branch Credentials"}
                  </button>
                  {!isRegistering && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsRecovering(true);
                        setAuthError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 font-bold hover:underline transition-colors block w-full"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 py-3.5 rounded-md text-sm font-bold text-slate-600 shadow-sm transition-all"
              >
                {lex.btnCancel}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};
