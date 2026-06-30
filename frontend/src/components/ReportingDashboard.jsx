import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { getCorporationName } from '../utils/data';
import { Camera, MapPin, Activity, ThumbsUp, RadioReceiver, Loader2, CheckCircle2, UploadCloud, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useImageValidator } from '../hooks/useImageValidator';
import { LocationPicker } from './LocationPicker';

export const ReportingDashboard = () => {
  const { 
    currentUser, storageMatrix, 
    selectedTicket, setSelectedTicket,
    ticketRegistry, addTicket,
    isAiLoading, setIsAiLoading,
    isOfflineSimulated, triggerAlert,
    upvoteTicket, isGalleryOpen, setIsGalleryOpen, addIncident
  } = useAppContext();
  
  const [draftTicket, setDraftTicket] = useState(null);
  const { t } = useTranslation();
  const { validateImage, isModelLoading } = useImageValidator();

  const handleAssetClick = async (item) => {
    if (isOfflineSimulated) {
      triggerAlert(t('alertOffline'), 'warning');
      return;
    }
    
    if (item.type === 'fake') {
      triggerAlert(t('alertFake'), 'error');
      return;
    }

    const existingTicket = Object.values(ticketRegistry).find(tk => tk.matrixSourceId === item.id);
    if (existingTicket) {
      if (existingTicket.createdBy !== currentUser.name) {
         upvoteTicket(existingTicket.id);
         triggerAlert("Community Fusion: You have joined an active report for this location.", 'success');
      } else {
         triggerAlert(t('alertDup'), 'info');
      }
      setSelectedTicket(ticketRegistry[existingTicket.id] || existingTicket);
      setIsGalleryOpen(false);
      return;
    }

    setIsGalleryOpen(false);
    setIsAiLoading(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = item.img;
    
    img.onload = async () => {
      const validationResult = await validateImage(img);
      setIsAiLoading(false);

      if (!validationResult.isValid) {
        triggerAlert(t('aiAnalysisBlocked'), 'error');
        return;
      }

      const derivedWard = currentUser.ward || 'unassigned';
      const mockAddress = getCorporationName(derivedWard);

      const initiateDraft = (lat, lng) => {
        setDraftTicket({
          item,
          latitude: lat,
          longitude: lng,
          address: mockAddress,
          aiLabels: validationResult.labels,
          relevantLabels: validationResult.relevantLabels
        });
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initiateDraft(position.coords.latitude.toFixed(4), position.coords.longitude.toFixed(4));
          },
          (error) => {
            initiateDraft((10 + Math.random() * 20).toFixed(4), (70 + Math.random() * 20).toFixed(4));
          }
        );
      } else {
        initiateDraft((10 + Math.random() * 20).toFixed(4), (70 + Math.random() * 20).toFixed(4));
      }
    };
    
    img.onerror = () => {
       setIsAiLoading(false);
       triggerAlert("Error loading image for AI validation.", 'error');
    };
  };

  const handleConfirmLocation = (e) => {
    e.preventDefault();
    const address = e.target.address.value;
    
    if (!address.trim()) {
       triggerAlert("Address/Landmark is mandatory.", 'error');
       return;
    }

    const derivedWard = currentUser.ward || 'unassigned';
    const trackingId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString();
    
    const severities = ['Critical', 'High', 'Medium'];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    let hoursToAdd = 24;
    if (randomSeverity === 'Critical') hoursToAdd = 2;
    else if (randomSeverity === 'High') hoursToAdd = 6;
    
    const expiryTime = Date.now() + (hoursToAdd * 60 * 60 * 1000);

    const detectedStr = draftTicket.relevantLabels && draftTicket.relevantLabels.length > 0
      ? draftTicket.relevantLabels.join(', ')
      : "infrastructure hazard";

    let aiDesc = t('aiAnalysisPassed');
    if (aiDesc) {
      aiDesc = aiDesc.replace('{{labels}}', detectedStr);
    } else {
      aiDesc = `AI Analysis: Detected ${detectedStr} requiring attention.`;
    }

    const newTicket = {
      ...draftTicket.item,
      id: trackingId,
      matrixSourceId: draftTicket.item.id,
      timestamp: timestamp,
      votes: 1,
      sla: null,
      slaTracker: `${hoursToAdd} Hours Remaining`,
      status: 'Pending Action',
      workerLocation: 'En Route from Depot',
      ward: derivedWard,
      branch: derivedWard, 
      createdBy: currentUser.name,
      loc: address,
      latitude: draftTicket.latitude,
      longitude: draftTicket.longitude,
      mockLocation: { latitude: draftTicket.latitude, longitude: draftTicket.longitude, address: address },
      severity: randomSeverity,
      expiryTime: expiryTime,
      history: [{
        status: 'Pending Action',
        user: currentUser.name,
        timestamp: Date.now()
      }],
      aiDescription: aiDesc,
      aiTags: draftTicket.aiLabels || [],
      verifiedAddress: address,
      evidenceBoard: {
        photoUrl: draftTicket.item.img,
        annotations: [],
        locationHistory: []
      }
    };
    
    addTicket(newTicket);
    setSelectedTicket(newTicket);
    setDraftTicket(null);
    triggerAlert("Work order successfully verified and routed.", 'success');
  };

  const updateDraftLocation = (newPos) => {
    setDraftTicket(prev => ({ ...prev, latitude: newPos.lat, longitude: newPos.lng }));
  };

  const formatAddressData = (addressStr) => {
    if (!addressStr) return null;
    
    // Check if it matches the specific mock format
    if (addressStr.includes('Company:') || addressStr.includes('Address:')) {
      let company = '';
      let address = '';
      let cityState = '';
      let pin = '';
      
      const companyMatch = addressStr.match(/Company:\s*(.*?)\s*Address:/);
      if (companyMatch) company = companyMatch[1];
      
      const addressMatch = addressStr.match(/Address:\s*(.*?)\s*City\/State:/);
      if (addressMatch) address = addressMatch[1];
      
      const cityStateMatch = addressStr.match(/City\/State:\s*(.*?)\s*PIN Code:/);
      if (cityStateMatch) cityState = cityStateMatch[1];
      
      const pinMatch = addressStr.match(/PIN Code:\s*(.*)/);
      if (pinMatch) pin = pinMatch[1];

      if (company || address || cityState || pin) {
        return (
          <div className="flex flex-col gap-0.5 mt-1 text-xs">
            {company && <div><span className="font-bold text-slate-700 dark:text-slate-300">{t('labels.company')}:</span> {company}</div>}
            {address && <div><span className="font-bold text-slate-700 dark:text-slate-300">{t('labels.address')}:</span> {address}</div>}
            {cityState && <div><span className="font-bold text-slate-700 dark:text-slate-300">{t('labels.cityState')}:</span> {cityState}</div>}
            {pin && <div><span className="font-bold text-slate-700 dark:text-slate-300">{t('labels.pinCode')}:</span> {pin}</div>}
          </div>
        );
      }
    }
    
    return <span>{addressStr}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-wider text-[#059669] dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
          <RadioReceiver className="w-4 h-4" /> {t('routingPlatform')}
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">{t('dashboard.portalName')}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium tracking-wide">
            {t('dashboard.authStream')} <strong className="font-bold text-[#0F172A] dark:text-white">{currentUser.name}</strong>
          </p>
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-[#059669] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3 h-3" /> {t('dashboard.publicVerified')}
          </span>
        </div>
      </div>

      {!selectedTicket && !isAiLoading && !draftTicket && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center relative">
            {isModelLoading && (
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
            )}
            <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">{t('uploadHeadline')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">{t('uploadDesc')}</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            id="incident-upload" 
            className="hidden" 
            disabled={isModelLoading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                addIncident(e.target.files[0]);
                setIsGalleryOpen(true);
                // Reset input to allow uploading the same file again if needed
                e.target.value = '';
              }
            }}
          />
          <label 
            htmlFor="incident-upload"
            className={`font-bold px-8 py-3.5 rounded-md shadow-sm inline-flex items-center gap-2 transition-colors cursor-pointer ${
              isModelLoading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#0F172A] hover:bg-slate-800 text-white'
            }`}
          >
            <Camera className="w-5 h-5" /> {isModelLoading ? (t('dashboard.loadingAI') || 'Loading AI Model...') : (t('dashboard.uploadBtn') || 'Upload Photo / Report Issue')}
          </label>
        </div>
      )}

      {draftTicket && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <MapPin className="w-5 h-5 text-[#059669] dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">{t('dashboard.verifyLocation')}</h3>
           </div>
           <p className="text-sm text-slate-600 dark:text-slate-400">{t('dashboard.confirmLocationDesc')}</p>
           
           <LocationPicker 
             defaultLocation={{ lat: parseFloat(draftTicket.latitude), lng: parseFloat(draftTicket.longitude) }} 
             onLocationChange={updateDraftLocation}
           />
           
           <form onSubmit={handleConfirmLocation} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    {t('dashboard.addressLandmark')} <span className="text-red-500">*</span>
                 </label>
                 <textarea name="address" defaultValue={draftTicket.address} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm h-24 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]" required placeholder={t('dashboard.addressPlaceholder')} />
              </div>
              <div className="pt-4 flex gap-3 border-t border-slate-100">
                 <button type="button" onClick={() => setDraftTicket(null)} className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-md hover:bg-slate-50 transition-colors shadow-sm">{t('cancel')}</button>
                 <button type="submit" className="flex-1 px-4 py-2.5 bg-[#059669] text-white font-bold rounded-md hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <CheckCircle2 className="w-4 h-4"/> {t('dashboard.confirmSubmit')}
                 </button>
              </div>
           </form>
        </div>
      )}

      {(selectedTicket || isAiLoading) && !draftTicket && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0F172A] dark:text-white">{t('aiDeskTitle')}</h3>
              <p className="text-[11px] text-[#059669] dark:text-emerald-400 font-mono flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-emerald-400"></span>
                <span>{t('aiStatus')}</span>
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              {t('nodeTypeActive')}
            </span>
          </div>

          {isAiLoading && (
            <div className="min-h-[250px] flex flex-col items-center justify-center space-y-4 text-center relative z-10">
              <Loader2 className="w-10 h-10 text-[#059669] animate-spin" />
              <p className="text-xs text-[#059669] font-mono tracking-wide max-w-[200px] leading-relaxed">
                {t('aiProcessing')}
              </p>
            </div>
          )}

          {selectedTicket && !isAiLoading && (
            <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Receipt */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h5 className="text-xs font-bold text-[#059669] uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {t('receiptHeader')}
                  </h5>
                  <span className="font-mono bg-emerald-50 text-[#059669] px-2 py-1 rounded text-[10px] border border-emerald-100">Verified</span>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 mb-1">{t('recId')}</p>
                      <p className="text-[#0F172A] font-mono font-bold">{selectedTicket.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Timestamp</p>
                      <p className="text-slate-700 font-mono text-[10px]">{selectedTicket.timestamp}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t('recLoc')}</p>
                    <div className="text-slate-900 dark:text-white font-medium">{formatAddressData(selectedTicket.mockLocation?.address)}</div>
                  </div>
                  
                  <div>
                    <p className="text-slate-500 mb-1">{t('recDesc')}</p>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed text-[11px]">
                      {selectedTicket.aiDescription || selectedTicket.title}
                    </p>
                  </div>
                </div>

                {/* Community Fusion Multi-Report Visual */}
                {selectedTicket.votes > 1 && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex -space-x-3 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-amber-50 flex items-center justify-center overflow-hidden z-[4]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTicket.createdBy}`} alt="avatar" />
                      </div>
                      {Array.from({ length: Math.min(selectedTicket.votes - 1, 3) }).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-amber-50 flex items-center justify-center overflow-hidden relative" style={{ zIndex: 3 - i }}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTicket.id}-${i}`} alt="avatar" />
                        </div>
                      ))}
                      {selectedTicket.votes > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-700 z-[0] shadow-sm">
                          +{selectedTicket.votes - 4}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed flex-1">
                      “Reported by you and <strong className="font-bold">{selectedTicket.votes - 1} other citizens</strong> near this live location. Priority Level Raised.”
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex gap-2 mt-4">
                  <button 
                    onClick={() => setSelectedTicket(null)} 
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-md shadow-sm transition-all"
                  >
                    {t('dashboard.reportAnother')}
                  </button>
                  <button 
                    onClick={() => upvoteTicket(selectedTicket.id)} 
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" /> {t('btnUpvote')} ({selectedTicket.votes})
                  </button>
                </div>
              </div>

              {/* Live Tracking */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center text-[11px] uppercase font-bold text-[#0F172A] border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> {t('dashboard.liveTracking')}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> {t('dashboard.connected')}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="text-slate-500">{t('dashboard.status')}</span>
                    <span className={`font-bold ${selectedTicket.status === 'BREACHED' ? 'text-red-600' : 'text-blue-600'}`}>
                      {selectedTicket.status === 'RESOLVED' ? t('buttons.resolve') : (selectedTicket.status === 'Pending Action' ? t('thUrgency') : selectedTicket.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="text-slate-500">{t('dashboard.slaCommitment')}</span>
                    <span className="font-bold">{selectedTicket.sla || t('unassignedSla')}</span>
                  </div>
                  
                  {/* Pipeline visualization */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-2 px-1">
                      <span className="text-blue-600 font-bold">{t('dashboard.log')}</span>
                      <span className={selectedTicket.sla ? "text-blue-600 font-bold" : ""}>{t('dashboard.ack')}</span>
                      <span className={selectedTicket.status === 'RESOLVED' ? "text-[#059669] font-bold" : ""}>{t('dashboard.fix')}</span>
                    </div>
                    <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
                        selectedTicket.status === 'RESOLVED' ? 'w-full bg-[#059669]' : 
                        selectedTicket.sla ? 'w-1/2 bg-blue-500' : 
                        'w-1/4 bg-slate-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* My Filed Grievances History Panel */}
      <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner max-w-4xl mx-auto mt-12">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#059669] dark:text-emerald-400" />
          {t('dashboard.myGrievances')}
        </h3>
        
        {Object.values(ticketRegistry).filter(t => t.createdBy === currentUser.name).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.noGrievances')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(ticketRegistry)
              .filter(tk => tk.createdBy === currentUser.name)
              .map(ticket => (
                <div key={ticket.id} className="bg-white border border-slate-200 rounded-md p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#0F172A]">{ticket.id}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                        {ticket.timestamp}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-1 shrink-0" /> 
                      <div>{formatAddressData(ticket.mockLocation?.address)}</div>
                    </div>
                    <p className="pl-4 text-[10px] text-emerald-600/70 font-mono mt-0.5">
                      {t('dashboard.lat')}: {ticket.mockLocation?.latitude} | {t('dashboard.lng')}: {ticket.mockLocation?.longitude}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full w-fit flex items-center gap-1 ${
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-[#059669]' : 
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {ticket.status === 'RESOLVED' && <CheckCircle2 className="w-3 h-3" />}
                      {ticket.status === 'IN_PROGRESS' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {ticket.status === 'RESOLVED' ? t('buttons.resolve') : (ticket.status === 'Pending Action' ? t('thUrgency') : ticket.status)}
                    </span>
                    
                    {ticket.status === 'RESOLVED' && (
                      <div className="text-[10px] text-[#059669] font-bold max-w-[220px] text-left sm:text-right">
                        <div>{t('dashboard.issueResolvedPrefix')}</div>
                        <div className="my-1 border-l-2 border-[#059669] pl-2 ml-1 text-left bg-emerald-50 dark:bg-emerald-900/20 p-1 rounded-r">
                          {formatAddressData(ticket.mockLocation?.address)}
                        </div>
                        <div>{t('dashboard.headSuffix')}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Simulated Device Gallery Modal */}
      {isGalleryOpen && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-full max-w-5xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shadow-sm">
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('dashboard.goBackToDash')}
              </button>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                  <Camera className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('dashboard.galleryTitle')}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-1">{storageMatrix.length} {t('dashboard.items')}</span>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)} 
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 p-2 rounded-full transition-colors flex items-center justify-center shadow-sm"
                  aria-label="Close Gallery"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {storageMatrix.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-20">
                  <Camera className="w-12 h-12 text-slate-300" />
                  <p className="font-medium text-lg">{t('dashboard.noIncidents')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {storageMatrix.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleAssetClick(item)}
                      className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200 p-1 flex flex-col justify-between hover:border-[#059669] hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="w-full h-32 rounded-lg overflow-hidden relative">
                        <img src={item.img} alt="Sample" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {Object.values(ticketRegistry).some(t => t.matrixSourceId === item.id) && (
                          <div className="absolute top-1 right-1 bg-[#059669] text-white p-1 rounded-full shadow-sm">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="pt-2 px-1 pb-1 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 truncate max-w-[90px]">{item.id}</span>
                        {Object.values(ticketRegistry).some(t => t.matrixSourceId === item.id) ? (
                          <span className="text-[#059669] font-bold">{t('dashboard.synced')}</span>
                        ) : (
                          <span className="text-slate-400">{t('dashboard.local')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
