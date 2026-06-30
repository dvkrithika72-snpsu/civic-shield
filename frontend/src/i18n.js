import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import knTranslation from './locales/kn/translation.json';
import hiTranslation from './locales/hi/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      kn: { translation: knTranslation },
      hi: { translation: hiTranslation }
    },
    lng: localStorage.getItem('civic_lang') || 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
