import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

const ReservationHeader: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <View className="flex-row items-center justify-center py-4 mb-2">
      <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
        Araç Ara
      </Text>
    </View>
  );
};

export default ReservationHeader;
