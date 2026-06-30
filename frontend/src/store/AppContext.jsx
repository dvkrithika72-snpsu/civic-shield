import React, { createContext, useContext, useState, useEffect } from 'react';
import { localHazardDataset, nonHazardImages } from '../utils/data';

/**
 * TICKET REGISTRY SCHEMA
 * 
 * Each ticket object in `ticketRegistry` adheres to the following structure:
 * {
 *   id: string,               // Tracking ID
 *   timestamp: string,        // Creation timestamp
 *   status: string,           // e.g., 'Pending Action', 'ACKNOWLEDGED', 'RESOLVED'
 *   ward: string,             // City corporation / ward mapping
 *   latitude: string,         // Pin latitude
 *   longitude: string,        // Pin longitude
 *   severity: string,         // 'Critical', 'High', 'Medium'
 *   expiryTime: number,       // SLA expiration timestamp (ms)
 *   history: Array<{ status: string, user: string, timestamp: number }>, // Audit trail
 *   
 *   // --- NEW: AI-Driven Diagnostic Schema ---
 *   aiDescription: string,    // AI-generated diagnostic summary of the hazard
 *   verifiedAddress: string,  // Human-readable, user-confirmed location fallback
 *   evidenceBoard: {
 *     photoUrl: string,       // URL of the submitted incident photo
 *     annotations: Array<{ text: string, user: string, timestamp: number }> // Admin comments
 *   }
 * }
 */

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage
  const [ticketRegistry, setTicketRegistry] = useState(() => {
    const saved = localStorage.getItem('global_civic_tickets');
    return saved ? JSON.parse(saved) : {};
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('civic_lang') || 'en';
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [globalAlert, setGlobalAlert] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [adminPasswords, setAdminPasswords] = useState({ central: 'admin123' });
  const [selectedCorporation, setSelectedCorporation] = useState(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [activeModalContent, setActiveModalContent] = useState(null);

  const [theme, setTheme] = useState('light');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [dataSaverMode, setDataSaverMode] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);
  const [profilePhotos, setProfilePhotos] = useState({});
  
  const setProfilePhoto = (url) => {
    if (currentUser) {
      setProfilePhotos(prev => ({ ...prev, [currentUser.name]: url }));
    }
  };
  
  const profilePhoto = currentUser ? profilePhotos[currentUser.name] : null;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [storageMatrix, setStorageMatrix] = useState([]);

  const addIncident = (file) => {
    const fileUrl = URL.createObjectURL(file);
    const newItem = {
      id: `TK-${Date.now().toString().slice(-4)}`,
      img: fileUrl,
      type: 'real'
    };
    setStorageMatrix(prev => [newItem, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem('global_civic_tickets', JSON.stringify(ticketRegistry));
  }, [ticketRegistry]);

  const addTicket = (ticket) => {
    setTicketRegistry(prev => ({
      ...prev,
      [ticket.id]: ticket
    }));
  };

  const triggerAlert = (message, type = 'info') => {
    let classes = 'bg-slate-800 text-white border-slate-700';
    if (type === 'error') classes = 'bg-red-50 text-red-600 border-red-200';
    if (type === 'success') classes = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (type === 'warning') classes = 'bg-amber-50 text-amber-600 border-amber-200';

    setGlobalAlert({ message, classes });
    setTimeout(() => setGlobalAlert(null), 3000);
  };

  const login = (name, role, city) => {
    setCurrentUser({ name, role, ward: city });
    setActiveTab(role === 'citizen' ? 'report' : 'admin');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const registerAdmin = (type, password) => {
    setAdminPasswords(prev => ({ ...prev, [type]: password }));
  };

  const flushOfflineCache = () => {
    triggerAlert('Offline cache flushed', 'success');
  };

  const upvoteTicket = (ticketId) => {
    setTicketRegistry(prev => {
      const ticket = prev[ticketId];
      if (!ticket) return prev;
      return {
        ...prev,
        [ticketId]: {
          ...ticket,
          upvotes: (ticket.upvotes || 0) + 1
        }
      };
    });
  };

  return (
    <AppContext.Provider value={{
      ticketRegistry, setTicketRegistry, addTicket,
      lang, setLang,
      currentUser, setCurrentUser,
      activeTab, setActiveTab,
      globalAlert, triggerAlert,
      isGalleryOpen, setIsGalleryOpen,
      isOfflineSimulated, setIsOfflineSimulated,
      isAudioPlaying, setIsAudioPlaying,
      selectedTicket, setSelectedTicket,
      isAiLoading, setIsAiLoading,
      adminPasswords, registerAdmin,
      login, logout,
      flushOfflineCache, upvoteTicket,
      storageMatrix, addIncident,
      selectedCorporation, setSelectedCorporation,
      isLocationPickerOpen, setIsLocationPickerOpen,
      isDrawerOpen, setIsDrawerOpen,
      isLogoutModalOpen, setIsLogoutModalOpen,
      activeModal, setActiveModal,
      activeModalContent, setActiveModalContent,
      theme, setTheme,
      pushNotifications, setPushNotifications,
      emailUpdates, setEmailUpdates,
      locationServices, setLocationServices,
      dataSaverMode, setDataSaverMode,
      offlineSync, setOfflineSync,
      profilePhoto, setProfilePhoto
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);