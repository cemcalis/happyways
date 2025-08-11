import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icons/Icons';

interface ReservationCardProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupTime?: string;
  dropoffTime?: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  pickupLocation = "Alış Lokasyonu",
  dropoffLocation = "Teslim Lokasyonu", 
  pickupDate = "01.12.2024",
  dropoffDate = "03.12.2024",
  pickupTime = "14:00",
  dropoffTime = "14:00"
}) => {
  return (
    <View 
      className="bg-white rounded-lg p-4 border border-gray-100"
      style={styles.shadowContainer}
    >
      <View className="flex-row justify-between items-center">
        {/* Sol - Alış */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-black">{pickupLocation}</Text>
          <Text className="text-gray-600 text-sm">{pickupDate}, {pickupTime}</Text>
        </View>
        
        {/* Orta - Image/Icon */}
        <View className="flex-row items-center mx-4">
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
          <View className="flex-1 h-px bg-gray-300 mx-2" />
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
        </View>
        
        {/* Sağ - İade */}
        <View className="flex-1 items-end">
          <Text className="text-lg font-bold text-black">{dropoffLocation}</Text>
          <Text className="text-gray-600 text-sm">{dropoffDate}, {dropoffTime}</Text>
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
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});

export default ReservationCard;
