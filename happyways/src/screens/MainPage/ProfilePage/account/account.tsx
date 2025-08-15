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
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text className={`text-center text-lg font-semibold my-3 ${isDark ? 'text-white' : 'text-black'}`}>{t('profile:myAccount')}</Text>

       
        
        <TouchableOpacity className={`px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-row justify-between mb-[16px]`}
         onPress={() => navigation.navigate("MePage")}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>{t('profile:personalInfo')}</Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>

        
        <TouchableOpacity className={`px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-row justify-between mb-[16px]`}
         onPress={() => navigation.navigate("MineReservationPage")}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>{t('profile:myReservations')}</Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>       
        <View className="px-4 mb-[10px]">
          <Text className={`${isDark ? 'text-orange-400' : 'text-[#FE5502]'} font-semibold mb-3`}>{t('common:settings')}</Text>

          <LanguageSelector />

          <TouchableOpacity className={`flex-row items-center justify-between py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center space-x-3">
              <Icon name="money" size={20} />
              <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{t('profile:currency')}</Text>
            </View>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>₺ TRY</Text>
          </TouchableOpacity>

          <ThemeSelector />
        </View>

       
 <TouchableOpacity
          className="mx-6 bg-[#FF0000] rounded-lg py-3 shadow-lg mb-[70px]"
          onPress={handleLogout}
        >
          <Text className="text-white text-center text-base font-semibold">{t('common:logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-row justify-between mb-[20px]`}
        onPress={() => navigation.navigate("ContactPage")}
        >
          <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>{t('profile:contactUs')}</Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </TouchableOpacity>

       
        <View className="p-4 items-center">
           <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{t('profile:SocialMediaAccounts')}</Text>
          <View className="flex-row space-x-6">
            <Icon name="linkedin" size={22} />
            <Icon name="instagram" size={22} />
            <Icon name="x" size={22} />
            <Icon name="youtube" size={22} />
            <Icon name="facebook" size={22} />
          </View>
          <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mt-3`}>{t('profile:version')}</Text>
          <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>01.01</Text>
        </View>
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="ProfilePage" />
    </View>
  )
}

export default AccountPage;
