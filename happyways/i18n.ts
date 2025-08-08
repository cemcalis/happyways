import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import trCommon from './locales/tr/common.json';
import trAuth from './locales/tr/auth.json';
import trProfile from './locales/tr/profile.json';
import trHome from './locales/tr/home.json';
import trCars from './locales/tr/cars.json';
import trCampaign from './locales/tr/campaign.json';
import trReservation from './locales/tr/reservation.json';
import trNotifications from './locales/tr/notifications.json';
import trPayment from './locales/tr/payment.json';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enHome from './locales/en/home.json';
import enCars from './locales/en/cars.json';
import enCampaign from './locales/en/campaign.json';
import enReservation from './locales/en/reservation.json';
import enNotifications from './locales/en/notifications.json';
import enPayment from './locales/en/payment.json';

const resources = {
  tr: {
    common: trCommon,
    auth: trAuth,
    profile: trProfile,
    home: trHome,
    cars: trCars,
    campaign: trCampaign,
    reservation: trReservation,
    notifications: trNotifications,
    payment: trPayment,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    profile: enProfile,
    home: enHome,
    cars: enCars,
    campaign: enCampaign,
    reservation: enReservation,
    notifications: enNotifications,
    payment: enPayment,
  },
};

const initI18n = async () => {
  let savedLanguage = 'tr'; 
  
  try {
    const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      savedLanguage = storedLanguage;
    }
  } catch (error) {
    console.log('Dil yüklenirken hata:', error);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'tr',
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      defaultNS: 'common',
      ns: ['common', 'auth', 'profile'],
    });
};

initI18n();

export default i18n;
