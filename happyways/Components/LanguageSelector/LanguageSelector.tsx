import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isDark } = useTheme();
  const { t } = useTranslation('common');

  const languages = [
    { code: 'tr', name: 'Türkçe',},
    { code: 'en', name: 'English'},
  ];

  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (languageCode: 'tr' | 'en') => {
    try {
      await changeLanguage(languageCode);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Dil değiştirilemedi');
    }
  };

  return (
    <>
      <TouchableOpacity 
        className={`flex-row items-center justify-between py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        onPress={() => setIsModalVisible(true)}
      >
        <View className="flex-row items-center space-x-3">
          <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{t('language')}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentLanguageInfo?.name}
          </Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{'>'}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6`}>
            <Text className={`text-lg font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-black'}`}>
              {t('language')} {t('select')}
            </Text>
            
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                className={`flex-row items-center justify-between py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                onPress={() => handleLanguageChange(language.code as 'tr' | 'en')}
              >
                <View className="flex-row items-center space-x-3">
                  <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Text className="text-orange-500 text-lg">✓</Text>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LanguageSelector;
