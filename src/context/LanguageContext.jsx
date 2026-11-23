import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages, CATEGORIES } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const [lang, setLangState] = useState(() => {
    return initialLang || localStorage.getItem('kharcha_lang') || 'en';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('kharcha_lang', newLang);
  };

  const t = (key) => {
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  const getCategoryLabel = (type, catId) => {
    const list = CATEGORIES[type] || [];
    const item = list.find((c) => c.id === catId);
    if (!item) return catId;
    return item[lang] || item.en || catId;
  };

  const formatCurrency = (n, showSign = false) => {
    const val = Number(n) || 0;
    const isNeg = val < -0.004;
    const absVal = Math.abs(val);
    const formatted = '₹' + absVal.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: absVal % 1 === 0 ? 0 : 2
    });
    if (showSign) {
      if (val > 0) return '+' + formatted;
      if (isNeg) return '−' + formatted;
    }
    return isNeg ? '−' + formatted : formatted;
  };

  const formatMonth = (ymStr) => {
    if (!ymStr) return '';
    const parts = ymStr.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
    
    // Choose locale based on selected language
    let locale = 'en-IN';
    if (lang === 'hi') locale = 'hi-IN';
    else if (lang === 'mr') locale = 'mr-IN';

    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    
    let locale = 'en-IN';
    if (lang === 'hi') locale = 'hi-IN';
    else if (lang === 'mr') locale = 'mr-IN';

    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        languages,
        getCategoryLabel,
        formatCurrency,
        formatMonth,
        formatShortDate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
