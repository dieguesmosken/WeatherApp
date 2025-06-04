import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

export const I18nProvider = ({ children, defaultLang = 'pt' }) => {
  const [language, setLanguage] = useState(defaultLang);

  const t = (key, params = {}) => {
    let string = translations[language][key] || translations['en'][key] || key; // Fallback to English then key
    Object.keys(params).forEach(param => {
      string = string.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    return string;
  };

  // Basic language switcher function, can be expanded later
  // const switchLanguage = (lang) => {
  //   setLanguage(lang);
  // };

  return (
    <I18nContext.Provider value={{ t, language /*, switchLanguage */ }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
