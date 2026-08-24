import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

export const I18nProvider = ({ children, defaultLang = 'pt' }) => {
  const [language, setLanguage] = useState(defaultLang);

  const t = (key, params = {}) => {
    let string = translations[language][key] || translations['en'][key] || key; // Fallback to English then key
    if (!params || Object.keys(params).length === 0) return string;
    return string.replace(/\{\{([^}]+)\}\}/g, (match, param) => {
      return params.hasOwnProperty(param) ? params[param] : match;
    });
  };

  return (
    <I18nContext.Provider value={{ t, language }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
