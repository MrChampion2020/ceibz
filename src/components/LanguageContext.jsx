import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const LanguageContext = createContext();

// Language options
const languages = [
  { name: 'English', code: 'en', flag: 'https://flagcdn.com/w20/us.png' },
  { name: 'Français', code: 'fr', flag: 'https://flagcdn.com/w20/fr.png' },
  { name: 'Español', code: 'es', flag: 'https://flagcdn.com/w20/es.png' },
  { name: '中文', code: 'zh', flag: 'https://flagcdn.com/w20/cn.png' },
];

// Translation mappings (in a real app, you would use a translation API)
const translations = {
  fr: {
    HOME: 'ACCUEIL',
    'WATCH LIVE': 'REGARDER EN DIRECT',
    MINISTRIES: 'MINISTÈRES',
    PROGRAMS: 'PROGRAMMES',
    TESTIFY: 'TÉMOIGNER',
    GIVE: 'DONNER',
    'CONTACT US': 'CONTACTEZ-NOUS',
    'FOUNDATION SCHOOL': 'ÉCOLE DE FONDATION',
    'CHILDREN MINISTRY': 'MINISTÈRE DES ENFANTS',
    'TEENS MINISTRY': 'MINISTÈRE DES ADOLESCENTS',
  },
  es: {
    HOME: 'INICIO',
    'WATCH LIVE': 'VER EN VIVO',
    MINISTRIES: 'MINISTERIOS',
    PROGRAMS: 'PROGRAMAS',
    TESTIFY: 'TESTIFICAR',
    GIVE: 'DONAR',
    'CONTACT US': 'CONTÁCTENOS',
    'FOUNDATION SCHOOL': 'ESCUELA DE FUNDACIÓN',
    'CHILDREN MINISTRY': 'MINISTERIO DE NIÑOS',
    'TEENS MINISTRY': 'MINISTERIO DE ADOLESCENTES',
  },
  zh: {
    HOME: '首页',
    'WATCH LIVE': '在线观看',
    MINISTRIES: '事工',
    PROGRAMS: '节目',
    TESTIFY: '见证',
    GIVE: '奉献',
    'CONTACT US': '联系我们',
    'FOUNDATION SCHOOL': '基础学校',
    'CHILDREN MINISTRY': '儿童事工',
    'TEENS MINISTRY': '青少年事工',
  },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentLangName, setCurrentLangName] = useState('English');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      const langObj = languages.find((lang) => lang.code === savedLanguage);
      if (langObj) {
        setCurrentLangName(langObj.name);
      }
    }
  }, []);

  // Function to change the language
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    const langObj = languages.find((lang) => lang.code === langCode);
    if (langObj) {
      setCurrentLangName(langObj.name);
    }
    localStorage.setItem('preferredLanguage', langCode);
  };

  // Function to translate text
  const translate = (text) => {
    if (currentLanguage === 'en') return text;
    return translations[currentLanguage]?.[text] || text;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLangName,
        changeLanguage,
        translate,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 