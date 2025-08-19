import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../types';
import Icon from '../../../../../Components/Icons/Icons';
import ThemeSelector from '../../../../../Components/ThemeSelector/ThemeSelector';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../../../../Components/LanguageSelector/LanguageSelector';
import TabBar from '../../../../../Components/TabBar/TapBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../../../contexts/AuthContext';
import BackButton from '../../../../../Components/BackButton/BackButton';

type ProfilePageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ProfilePage">;
};

const AccountPage = ({ navigation }: ProfilePageProp) => {
  const { theme, isDark } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation(['common', 'profile']);
  
 const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'LoginPage' }] });
  };
  
 return (
  <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Üst Başlık */}
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <BackButton onPress={() => navigation.goBack()} />
        <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          {t('profile:myAccount')}
        </Text>
        <View style={{ width: 32, height: 32 }} />
      </View>

      {/* Liste (Üyelik Bilgilerim, Rezervasyonlarım, İletişim) 
          — Sadece üst ve alt çizgi, iç ayraç YOK */}
      <View
        className={`mx-0 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        style={{ borderTopWidth: 1, borderBottomWidth: 1 }}
      >
        <TouchableOpacity
          className="px-4 py-4 flex-row items-center justify-between"
          onPress={() => navigation.navigate('MePage')}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
            {t('profile:personalInfo')}
          </Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-4 py-4 flex-row items-center justify-between"
          onPress={() => navigation.navigate('MineReservationPage')}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
            {t('profile:myReservations')}
          </Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-4 py-4 flex-row items-center justify-between"
          onPress={() => navigation.navigate('ContactPage')}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
            {t('profile:contactUs')}
          </Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Ayarlar başlık */}
      <View className="px-5 mt-6 mb-2">
        <Text className={`${isDark ? 'text-orange-300' : 'text-[#FE5502]'} font-semibold`}>
          {t('common:settings')}
        </Text>
      </View>

      {/* Ayarlar — ortaya hizalı kart, İÇ ÇİZGİ YOK */}
      <View
        className={`mx-5 mt-1 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} px-4 py-2`}
        style={{
          shadowColor: '#000',
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: isDark ? 0 : 2,
        }}
      >
        <View className="py-2">
          <LanguageSelector />
        </View>

        {/* Para Birimi — ayrac YOK, sadece satır */}
        <TouchableOpacity className="py-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/* İkonlar assets/Account içinden okunuyor */}
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor: isDark ? 'rgba(254,85,2,0.15)' : 'rgba(254,85,2,0.12)',
              }}
            >
              <Icon name="money" size={18} />
            </View>
            <Text className={`${isDark ? 'text-white' : 'text-black'}`}>
              {t('profile:currency')}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mr-2`}>₺ TRY</Text>
            <Icon name="arrow" size={14} />
          </View>
        </TouchableOpacity>

        <View className="py-2">
          <ThemeSelector />
        </View>
      </View>

      {/* Çıkış — yuvarlatılmış ve BORDER'LI (outline) */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mx-6 mt-5 rounded-full py-3 items-center justify-center"
        style={{
          borderWidth: 1.5,
          borderColor: '#FF3B30',
          backgroundColor: 'transparent',
        }}
      >
        <Text style={{ color: '#FF3B30' }} className="text-base font-semibold">
          {t('common:logout')}
        </Text>
      </TouchableOpacity>

      {/* Sosyal Medya & Versiyon — tamamen ortada */}
      <View className="px-4 mt-8 items-center">
        <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 text-center`}>
          {t('profile:SocialMediaAccounts')}
        </Text>

        <View className="flex-row items-center justify-center">
          {['linkedin', 'instagram', 'x', 'youtube', 'facebook'].map((n, i) => (
            <View
              key={i}
              className="w-10 h-10 mx-3 rounded-full items-center justify-center"
              style={{
                backgroundColor: isDark ? 'rgba(254,85,2,0.18)' : 'rgba(254,85,2,0.12)',
              }}
            >
              <Icon name={n as any} size={20} />
            </View>
          ))}
        </View>

        <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mt-4`}>
          {t('profile:version')}
        </Text>
        <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>01.01</Text>
      </View>
    </ScrollView>

    <TabBar navigation={navigation} activeRoute="ProfilePage" />
  </View>
);
}
export default AccountPage;
