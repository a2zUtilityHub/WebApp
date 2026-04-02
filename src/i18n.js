import { default as i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, 
    },
  });

export default i18n;