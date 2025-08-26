import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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
  <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
       <ScrollView showsVerticalScrollIndicator={false} className="px-4">
         <View className="flex-row items-center justify-center py-4 mb-2">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {t('myAccount')}
              </Text>
            </View>
         <BackButton
           onPress={() => navigation.goBack()}
         />


      <View className="w-[110%] self-center">

   
        <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-4`}>
          <TouchableOpacity
            className="px-4 py-4 flex-row items-center justify-between"
            onPress={() => navigation.navigate('MePage')}
          >
            <Text className={`${isDark ? 'text-white' : 'text-black'} text-base`}>{t('profile:personalInfo')}</Text>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
          </TouchableOpacity>

          <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-300 border-gray-200'} h-[2px]`} />

          <TouchableOpacity
            className="px-4 py-4 flex-row items-center justify-between"
            onPress={() => navigation.navigate('MineReservationPage')}
          >
            <Text className={`${isDark ? 'text-white' : 'text-black'} text-base`}>{t('profile:myReservations')}</Text>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
          </TouchableOpacity>
        </View>

       
        <View className={`w-[95%] self-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-4 p-4`}>
          <Text className={`${isDark ? 'text-orange-400' : 'text-[#FE5502]'} font-semibold mb-3`}>
            {t('common:settings')}
          </Text>

          <LanguageSelector />

          <View className="h-2" />

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className={`flex-row items-center  ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Icon name="money" size={20} />
              <Text className={`${isDark ? 'text-white' : 'text-black'} ml-3`}>{t('profile:currency')}</Text>
            </View>
            <View className="flex-row items-center ">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`}>₺ TRY</Text>
              <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          <View className={`${isDark ? 'bg-gray-600' : 'bg-gray-300'} h-[2px] my-1`} />

          <ThemeSelector />

          
          <TouchableOpacity
            className="self-center mt-3 rounded-2xl px-10 py-3 shadow-lg"
            style={{ backgroundColor: '#FF0000' }}
            onPress={handleLogout}
          >
            <Text className="text-white text-center text-base font-semibold">{t('common:logout')}</Text>
          </TouchableOpacity>
        </View>

    
        <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-4`}>
          <TouchableOpacity
            className="px-4 py-4 flex-row items-center justify-between"
            onPress={() => navigation.navigate('ContactPage')}
          >
            <Text className={`${isDark ? 'text-white' : 'text-black'} text-base`}>{t('profile:contactUs')}</Text>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        
        <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 items-center mb-20`}>
          <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
            {t('profile:SocialMediaAccounts')}
          </Text>
          <View className="flex-row items-center justify-center space-x-6">
            <Icon name="linkedin" size={22} fill={isDark ? '#fff' : '#000'} />
            <Icon name="instagram" size={22} fill={isDark ? '#000' : '#fff'} />
            <Icon name="x" size={22} fill={isDark ? '#000' : '#fff'} />
            <Icon name="youtube" size={22} fill={isDark ? '#000' : '#fff'} />
            <Icon name="facebook" size={22} fill={isDark ? '#000' : '#fff'} />
          </View>
          <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mt-3`}>{t('profile:version')}</Text>
          <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>01.01</Text>
        </View>

      </View>
    </ScrollView>

    <TabBar navigation={navigation} activeRoute="ProfilePage" />
  </SafeAreaView>
);

}

export default AccountPage;
