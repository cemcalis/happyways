import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
interface CarInfo {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

interface SelectedCarInfoProps {
  carInfo?: CarInfo | null;
}

const SelectedCarInfo: React.FC<SelectedCarInfoProps> = ({ carInfo }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('reservation');
1
  if (!carInfo) {
    return null;
  }

  return (
    <View 
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-4 mb-4`}
      style={styles.shadowContainer}
    >
      <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
        {t('selectedCar')}
      </Text>
      
      <View className="flex-row items-center">
        <Image
          source={{ uri: carInfo.image }}
          className="w-16 h-16 rounded-lg mr-4"
          resizeMode="cover"
        />
        
        <View className="flex-1">
          <Text className={`${isDark ? 'text-white' : 'text-black'} font-semibold text-base mb-1`}>
            {carInfo.brand} {carInfo.model}
          </Text>
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>
            {carInfo.year}
          </Text>
          <Text className={`${isDark ? 'text-orange-400' : 'text-orange-500'} font-bold text-lg`}>
            ₺{carInfo.price}/gün
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default SelectedCarInfo;
