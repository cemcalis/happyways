import React from "react";
import { View, Text } from "react-native";
import BackButton from "../../../../../../Components/BackButton/BackButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../types";
import { useTheme } from "../../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

type CarsHeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AllCarsPage">;
  searchInfo: any;
};

const CarsHeader = ({ navigation, searchInfo }: CarsHeaderProps) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('cars');
  
  return (
    <View className={`px-4 pt-4 pb-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="flex-row items-center justify-between mb-8">
        <View className="items-center">
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <Text className={`text-xl font-semibold text-center flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
          {searchInfo ? t('availableCars') : t('allCars')}
        </Text>
        <View className="w-8" />
      </View>
      
      {searchInfo && (
        <View className={`${isDark ? 'bg-orange-900/30 border-orange-600' : 'bg-orange-50 border-orange-200'} rounded-xl p-3 mb-6 border`}>
          <Text className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
            {searchInfo.pickup_location} - {searchInfo.dropoff_location}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchInfo.pickupDate} {searchInfo.pickupTime} - {searchInfo.dropDate} {searchInfo.dropTime}{searchInfo.pickup_date} {searchInfo.pickup_time} - {searchInfo.dropoff_date} {searchInfo.dropoff_time}
          </Text>
          <Text className="text-xs text-orange-600 font-semibold mt-1">
            {t('availableCount', { count: searchInfo.availableCarsCount })}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CarsHeader;
