import React from 'react';
import { View, Text} from 'react-native';
import Icon from '../Icons/Icons';

interface ReservationCardProps {
 pickup_location?: string;
  dropoff_location?: string;
  pickup_date?: string;
  dropoff_date?: string;
  pickup_time?: string;
  dropoff_time?: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
 pickup_location = "Alış Lokasyonu",
  dropoff_location = "Teslim Lokasyonu",
  pickup_date = "01.12.2024",
  dropoff_date = "03.12.2024",
  pickup_time = "14:00",
  dropoff_time = "14:00"
}) => {
  return (
     <View
      className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm shadow-black"
    >
      <View className="flex-row justify-between items-center">
    
        <View className="flex-1">
          <Text className="text-lg font-bold text-black">{pickup_location}</Text>
          <Text className="text-gray-600 text-sm">{pickup_date}, {pickup_time}</Text>
        </View>
        
       
        <View className="flex-row items-center mx-4">
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
          <View className="flex-1 h-px bg-gray-300 mx-2" />
          <View className="w-2 h-2 bg-orange-500 rounded-full" />
        </View>
        

        <View className="flex-1 items-end">
                    <Text className="text-lg font-bold text-black">{dropoff_location}</Text>
                    <Text className="text-gray-600 text-sm">{dropoff_date}, {dropoff_time}</Text>
        </View>
      </View>
    </View>
  );
};
export default ReservationCard;
