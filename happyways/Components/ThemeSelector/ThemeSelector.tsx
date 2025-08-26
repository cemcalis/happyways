import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';
import Icon from '../Icons/Icons';
import { useTranslation } from 'react-i18next';
const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themeOptions, isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const {t} = useTranslation('common');
  const selectedOption = themeOptions.find(option => option.value === theme);

  const handleSelect = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: { label: string; value: ThemeMode } }) => (
    <TouchableOpacity
      className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'} ${
        item.value === theme 
          ? (isDark ? 'bg-orange-900' : 'bg-orange-50') 
          : (isDark ? 'bg-gray-800' : 'bg-white')
      }`}
      onPress={() => handleSelect(item.value)}
    >
      <View className="flex-row items-center justify-between">
        <Text className={`text-base ${
          item.value === theme 
            ? (isDark ? 'text-orange-400 font-semibold' : 'text-orange-600 font-semibold')
            : (isDark ? 'text-white' : 'text-black')
        }`}>
          {item.label}
        </Text>
        {item.value === theme && (
          <Icon name="forward" size={16} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        className="flex-row items-center justify-between py-3"
        onPress={() => setIsVisible(true)}
      >
        <View className="flex-row items-center space-x-3">
          <Icon name="thema" size={20} />
          <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{t("Theme")}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedOption?.label || t("system")}
          </Text>
          <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{'>'}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          
          <View className={`flex-row items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text className={`text-base ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t("cancel")}</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t("selectTheme")}</Text>
            <View style={{ width: 50 }} />
          </View>

          
          <FlatList
            data={themeOptions}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            className="flex-1"
          />

          
          <View className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
              {t("infoPage.mescription")}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ThemeSelector;
