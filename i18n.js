import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
 
import { en } from "./assets/translations/en";
import { ru } from "./assets/translations/ru";
 
i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
   resources: {
     en: {
       translation: en
     },
     ru: {
       translation: ru
     }
   }
 });
 
i18n.changeLanguage("ru");