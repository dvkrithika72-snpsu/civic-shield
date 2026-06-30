import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { municipalCorporations } from '../utils/data';
import { MapPin, Search, ChevronRight, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LocationPickerModal = () => {
  const { setIsLocationPickerOpen, setSelectedCorporation } = useAppContext();
  const [status, setStatus] = useState('loading'); // 'loading', 'detected', 'search'
  const [detectedCity, setDetectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const lex = new Proxy({}, { get: (target, prop) => t(prop) });

  useEffect(() => {
    // Attempt Geolocation
    if (!navigator.geolocation) {
      setStatus('search');
      return;
    }

    const timeoutId = setTimeout(() => {
      // If it takes too long, fallback to search to ensure fast UI
      if (status === 'loading') {
        setStatus('search');
      }
    }, 4000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Geocoding failed');
          const data = await res.json();
          
          let city = data.address?.city || data.address?.state_district || data.address?.town || data.address?.county;
          
          if (city) {
            // Find a rough match in our corps
            const match = municipalCorporations.find(c => c.name.toLowerCase().includes(city.toLowerCase()) || c.id.toLowerCase().includes(city.toLowerCase()));
            if (match) {
              setDetectedCity(match);
            } else {
              // Mock fallback for demo if city not in list, fallback to BMC or search
              setStatus('search');
              return;
            }
            setStatus('detected');
          } else {
            setStatus('search');
          }
        } catch (e) {
          console.error(e);
          setStatus('search');
        }
        clearTimeout(timeoutId);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus('search');
        clearTimeout(timeoutId);
      },
      { timeout: 3000 } // Fast timeout
    );

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (status === 'search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const handleConfirm = () => {
    if (detectedCity) {
      setSelectedCorporation(detectedCity.id);
      setIsLocationPickerOpen(false);
    }
  };

  const handleSelectCorp = (corpId) => {
    setSelectedCorporation(corpId);
    setIsLocationPickerOpen(false);
  };

  const filteredCorps = municipalCorporations.filter(corp => 
    corp.name.toLowerCase().includes(searchQuery.toLowerCase()) || corp.id.toLowerCase().includes(searchQuery.toLowerCase()) || lex[`corps.${corp.id}`].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-white mb-2 tracking-tight">Select Region</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Choose your municipal corporation to access the local portal.</p>
          </div>
          <button 
            onClick={() => setIsLocationPickerOpen(false)}
            className="p-2 -mr-2 -mt-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {status === 'loading' && (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#059669] animate-spin" />
            <p className="text-sm font-bold text-slate-600">Detecting your location...</p>
          </div>
        )}

        {status === 'detected' && detectedCity && (
          <div className="p-8 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-800">
              <MapPin className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Detected Location</h3>
              <p className="text-3xl font-black text-[#0F172A] dark:text-white mt-1 tracking-tight">{lex[`corps.${detectedCity.id}`]}</p>
            </div>
            
            <div className="space-y-3 pt-4">
              <button 
                onClick={handleConfirm}
                className="w-full bg-[#059669] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                Confirm & Continue <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setStatus('search')}
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-xl transition-colors"
              >
                Not right? Search manually
              </button>
            </div>
          </div>
        )}

        {status === 'search' && (
          <div className="flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text"
                  placeholder="Type your city name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-[#0F172A] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredCorps.length > 0 ? (
                <div className="space-y-1">
                  {filteredCorps.map(corp => (
                  <button
                    key={corp.id}
                    onClick={() => {
                      setSelectedCorporation(corp.id);
                      setIsLocationPickerOpen(false);
                    }}
                    className="w-full text-left px-4 py-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-[#0F172A] dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{lex[`corps.${corp.id}`] || corp.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{corp.state}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500 font-medium">No municipal corporations found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
