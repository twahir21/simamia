import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, translations } from "./translations";

type ContextType = {
  lang: Language;
  t: (key: keyof typeof translations.en) => string;
  setLanguage: (l: Language) => void;
};

const LanguageContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "APP_LANG";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "en" || saved === "sw") setLang(saved);
    });
  }, []);

  const setLanguage = async (l: Language) => {
    setLang(l);
    await AsyncStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: keyof typeof translations.en) =>
    translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
};
