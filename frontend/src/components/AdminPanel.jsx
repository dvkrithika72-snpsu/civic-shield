import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { MapPin, Clock, ShieldAlert, History, Image as ImageIcon, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Create a red icon for 'Before' pin
const RedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CountdownTimer = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

  useEffect(() => {
    if (!expiryTime) return;
    const interval = setInterval(() => {
      setTimeLeft(expiryTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (!expiryTime) return <span className="text-slate-400 text-xs">No SLA</span>;
  if (timeLeft <= 0) return <span className="text-red-600 font-bold text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> SLA Breached</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
};

export const AdminPanel = () => {
  const { ticketRegistry, setTicketRegistry, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState(null);
  
  const { t } = useTranslation();

  const tickets = Object.values(ticketRegistry);
  const filteredTickets = tickets.filter(ticket => {
    if (!currentUser) return false;
    if (currentUser.role === 'central') return true;
    return ticket.ward === currentUser.role;
  });

  const activeTickets = filteredTickets.filter(t => t.status !== 'RESOLVED');
  const archivedTickets = filteredTickets.filter(t => t.status === 'RESOLVED');

  const updateTicket = (id, updates) => {
    setTicketRegistry(prev => {
      const existingTicket = prev[id];
      const updatedTicket = { ...existingTicket, ...updates };
      
      if (selectedTicket?.id === id) {
        setSelectedTicket(updatedTicket);
      }
      return { ...prev, [id]: updatedTicket };
    });
  };

  const assignSla = (id, slaTime) => {
    const existingTicket = ticketRegistry[id];
    updateTicket(id, { 
      sla: slaTime, 
      status: 'ACKNOWLEDGED',
      history: [...(existingTicket.history || []), { status: 'ACKNOWLEDGED', user: currentUser?.name || 'Admin', timestamp: Date.now() }]
    });
  };

  const resolveTicket = (id) => {
    const existingTicket = ticketRegistry[id];
    updateTicket(id, { 
      status: 'RESOLVED', 
      closedBy: currentUser?.name || 'Admin',
      history: [...(existingTicket.history || []), { status: 'RESOLVED', user: currentUser?.name || 'Admin', timestamp: Date.now() }]
    });
  };

  const handleEditLocationSubmit = (e, ticket) => {
    e.preventDefault();
    const lat = e.target.latitude.value;
    const lng = e.target.longitude.value;
    const address = e.target.address.value;
    const reason = e.target.reason.value;
    
    if (!reason.trim()) return;

    const locHistoryEntry = {
      oldLat: ticket.latitude,
      oldLng: ticket.longitude,
      newLat: lat,
      newLng: lng,
      reason,
      adminName: currentUser?.name || 'Admin',
      timestamp: Date.now()
    };

    updateTicket(ticket.id, {
      latitude: lat,
      longitude: lng,
      loc: address,
      verifiedAddress: address,
      mockLocation: { latitude: lat, longitude: lng, address },
      evidenceBoard: {
        ...ticket.evidenceBoard,
        locationHistory: [...(ticket.evidenceBoard?.locationHistory || []), locHistoryEntry]
      }
    });
    setEditingLocationId(null);
  };

  const handleAddAnnotation = (e, ticketId) => {
    e.preventDefault();
    const text = e.target.annotation.value;
    if (!text.trim()) return;

    setTicketRegistry(prev => {
      const ticket = prev[ticketId];
      const newAnnotation = {
        text,
        user: currentUser?.name || 'Admin',
        timestamp: Date.now()
      };
      
      const updatedTicket = {
        ...ticket,
        evidenceBoard: {
          ...ticket.evidenceBoard,
          annotations: [...(ticket.evidenceBoard?.annotations || []), newAnnotation]
        }
      };
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      return { ...prev, [ticketId]: updatedTicket };
    });
    e.target.reset();
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'border-red-500';
      case 'High': return 'border-amber-500';
      case 'Medium': return 'border-blue-500';
      default: return 'border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-white">Command Center: {currentUser?.ward || 'Central'}</h2>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button onClick={() => setActiveTab('active')} className={`pb-3 font-bold text-[#0F172A] dark:text-white ${activeTab === 'active' ? 'border-b-2 border-[#0F172A] dark:border-white' : 'text-slate-500 dark:text-slate-400'}`}>Active Incidents</button>
        <button onClick={() => setActiveTab('archive')} className={`pb-3 font-bold text-[#0F172A] dark:text-white ${activeTab === 'archive' ? 'border-b-2 border-[#059669] dark:border-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>Resolved Archive</button>
      </div>

      {/* Content Rendering */}
      {activeTab === 'active' ? (
        <div className="grid grid-cols-1 gap-6">
          {activeTickets.map(ticket => (
            <div key={ticket.id} className={`p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4 border-l-4 ${getSeverityColor(ticket.severity)}`}>
              
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left Side: Evidence Board Photo */}
                <div className="md:w-1/3 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{ticket.id}</span>
                    {ticket.severity && (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.severity === 'Critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : ticket.severity === 'High' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'}`}>
                        {ticket.severity}
                      </span>
                    )}
                  </div>
                  
                  {ticket.evidenceBoard?.photoUrl ? (
                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group shadow-sm">
                      <img src={ticket.evidenceBoard.photoUrl} alt="Incident Evidence" className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
                        <ImageIcon className="w-3 h-3" /> Evidence
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 h-48 flex items-center justify-center text-slate-400 text-xs font-medium">
                      No Photo Provided
                    </div>
                  )}

                  {/* Location Audit Trail Mini Map */}
                  {ticket.evidenceBoard?.locationHistory && ticket.evidenceBoard.locationHistory.length > 0 && (
                     <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden relative shadow-sm">
                        <div className="bg-slate-100 p-2 text-xs font-bold text-slate-700 flex justify-between border-b border-slate-200">
                          <span>Location Audit</span>
                          <span className="flex items-center gap-2">
                             <span className="flex items-center gap-1 text-[9px]"><span className="w-2 h-2 rounded-full bg-red-500"></span>Original</span>
                             <span className="flex items-center gap-1 text-[9px]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Current</span>
                          </span>
                        </div>
                        <div className="h-32 w-full z-0 relative">
                           <MapContainer 
                             center={[ticket.latitude, ticket.longitude]} 
                             zoom={14} 
                             scrollWheelZoom={false} 
                             className="h-full w-full"
                             zoomControl={false}
                           >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker position={[ticket.evidenceBoard.locationHistory[0].oldLat, ticket.evidenceBoard.locationHistory[0].oldLng]} icon={RedIcon}>
                                <Popup>Original Auto-Detected Location</Popup>
                              </Marker>
                              <Marker position={[ticket.latitude, ticket.longitude]} icon={DefaultIcon}>
                                <Popup>Admin Corrected Location</Popup>
                              </Marker>
                           </MapContainer>
                        </div>
                     </div>
                  )}
                </div>

                {/* Right Side: Diagnostics & Metadata */}
                <div className="md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-xl text-slate-900 dark:text-white">{ticket.title}</p>
                        
                        {editingLocationId !== ticket.id ? (
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> 
                            <span className="font-medium">{ticket.verifiedAddress || ticket.mockLocation?.address || ticket.ward}</span>
                          </p>
                        ) : null}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <CountdownTimer expiryTime={ticket.expiryTime} />
                        <div className="flex gap-2 mt-2">
                          {ticket.latitude && ticket.longitude && (
                            <>
                              {editingLocationId !== ticket.id && (
                                <button onClick={() => setEditingLocationId(ticket.id)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">{t('editLocation')}</button>
                              )}
                              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.verifiedAddress || ticket.mockLocation?.address || `${ticket.latitude},${ticket.longitude}`)}`} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-sm">
                                <MapPin className="w-3 h-3" /> {t('viewOnMap')}
                              </a>
                            </>
                          )}
                          {ticket.status === 'Pending Action' && <button onClick={() => assignSla(ticket.id, 'Acknowledged')} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">{t('acknowledge')}</button>}
                          {ticket.status !== 'RESOLVED' && <button onClick={() => resolveTicket(ticket.id)} className="bg-[#059669] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">{t('resolve')}</button>}
                        </div>
                      </div>
                    </div>

                    {/* AI Diagnostic Summary */}
                    {ticket.aiDescription && (
                      <div className="mt-4 p-4 bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg">
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            AI Diagnostic Summary
                          </p>
                          {ticket.aiTags && ticket.aiTags.length > 0 && (
                             <div className="flex gap-1 flex-wrap justify-end">
                               {ticket.aiTags.map(tag => (
                                 <span key={tag} className="text-[9px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono uppercase border border-blue-200 dark:border-blue-800">[{tag}]</span>
                               ))}
                             </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{ticket.aiDescription}</p>
                      </div>
                    )}
                    
                    {/* Inline Location Edit Form with Mandatory Reason */}
                    {editingLocationId === ticket.id && (
                      <form onSubmit={(e) => handleEditLocationSubmit(e, ticket)} className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800 mb-2">
                           <AlertTriangle className="w-4 h-4"/> 
                           Editing location triggers an unalterable audit log. Please provide a reason.
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" name="latitude" defaultValue={ticket.latitude} className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-1.5 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-slate-900 dark:text-white" required placeholder="Latitude" />
                          <input type="text" name="longitude" defaultValue={ticket.longitude} className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-1.5 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-slate-900 dark:text-white" required placeholder="Longitude" />
                        </div>
                        <input type="text" name="address" defaultValue={ticket.verifiedAddress || ticket.loc || ticket.mockLocation?.address} className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-1.5 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-slate-900 dark:text-white" required placeholder="Verified Address / Landmark" />
                        
                        <textarea name="reason" placeholder={t('reasonForChange')} required className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white" />

                        <div className="flex gap-2 justify-end pt-2">
                          <button type="button" onClick={() => setEditingLocationId(null)} className="text-xs px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition-colors">{t('cancel')}</button>
                          <button type="submit" className="text-xs px-3 py-1.5 bg-[#059669] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded font-bold transition-colors shadow-sm">{t('saveLocation')}</button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  {/* Annotations Section */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500"/> {t('annotations')}
                    </h4>
                    
                    {ticket.evidenceBoard?.annotations?.length > 0 && (
                      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {ticket.evidenceBoard.annotations.map((ann, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-md text-xs border border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{ann.user}:</span> <span className="text-slate-600 dark:text-slate-400">{ann.text}</span>
                            <span className="text-slate-400 dark:text-slate-500 ml-2 text-[10px] block mt-1">{new Date(ann.timestamp).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => handleAddAnnotation(e, ticket.id)} className="flex gap-2 relative">
                      <input type="text" name="annotation" placeholder={t('addAnnotation')} className="flex-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md pl-3 pr-16 py-2 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white shadow-sm" required autoComplete="off" />
                      <button type="submit" className="absolute right-1 top-1 bottom-1 text-xs bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-3 rounded font-bold transition-colors">Post</button>
                    </form>
                  </div>

                </div>
              </div>

              {/* History Toggle */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
                <button onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors">
                  <History className="w-3.5 h-3.5" /> {expandedTicket === ticket.id ? 'Hide Audit Trail' : 'View Audit Trail'}
                </button>
                
                {expandedTicket === ticket.id && (
                  <div className="mt-3 space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    {/* Status History */}
                    {ticket.history && ticket.history.map((log, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{log.status}</span> by <span className="font-medium text-slate-600 dark:text-slate-400">{log.user}</span> 
                        <span className="text-slate-400 dark:text-slate-500 ml-2">({new Date(log.timestamp).toLocaleString()})</span>
                      </div>
                    ))}
                    
                    {/* Location Change History (Audit Log) */}
                    {ticket.evidenceBoard?.locationHistory && ticket.evidenceBoard.locationHistory.map((log, idx) => (
                      <div key={`loc-${idx}`} className="text-xs bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-100 dark:border-amber-800 w-full max-w-md">
                        <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold mb-1">
                          <AlertTriangle className="w-3 h-3" /> Location Adjusted
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 font-mono text-[10px] flex items-center gap-2 mb-2">
                           <span className="line-through">{log.oldLat}, {log.oldLng}</span> 
                           <ArrowRight className="w-3 h-3" /> 
                           <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newLat}, {log.newLng}</span>
                        </div>
                        <p className="italic text-slate-700 dark:text-slate-300">" {log.reason} "</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">— {log.adminName} at {new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
          {activeTickets.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed dark:border-slate-700 rounded-lg">No active incidents in your jurisdiction.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {archivedTickets.map(ticket => (
            <div key={ticket.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 shadow-sm opacity-80">
               <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 mb-2 inline-block">{ticket.id}</span>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{ticket.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end"><ShieldAlert className="w-4 h-4"/> Resolved</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Closed by {ticket.closedBy}</p>
                  </div>
               </div>
            </div>
          ))}
          {archivedTickets.length === 0 && (
             <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed dark:border-slate-700 rounded-lg">No resolved incidents.</div>
          )}
        </div>
      )}
    </div>
  );
};