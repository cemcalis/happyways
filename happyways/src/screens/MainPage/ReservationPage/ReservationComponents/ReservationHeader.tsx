import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

const ReservationHeader: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation('reservation');  
  return (
    <View className="flex-row items-center justify-center py-4 mb-2">
      <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
        {t('searchCars')}
      </Text>
    </View>
  );
};

export default ReservationHeader;
