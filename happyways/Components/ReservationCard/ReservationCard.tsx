import React from 'react';
import { View, Text} from 'react-native';
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
      className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm shadow-black"
    >
      <View className="flex-row justify-between items-center">
    
        <View className="flex-1">
          <Text className="text-lg font-bold text-black">{pickupLocation}</Text>
          <Text className="text-gray-600 text-sm">{pickupDate}, {pickupTime}</Text>
        </View>
        
       
        <View className="flex-row items-center mx-4">
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
          <View className="flex-1 h-px bg-gray-300 mx-2" />
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
        </View>
        

        <View className="flex-1 items-end">
          <Text className="text-lg font-bold text-black">{dropoffLocation}</Text>
          <Text className="text-gray-600 text-sm">{dropoffDate}, {dropoffTime}</Text>
        </View>
      </View>
    </View>
  );
};
export default ReservationCard;
