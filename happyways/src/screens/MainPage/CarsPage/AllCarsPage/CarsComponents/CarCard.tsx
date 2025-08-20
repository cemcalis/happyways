+17
-17

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../types";
import { useTheme } from "../../../../../../contexts/ThemeContext";
import Icon from "../../../../../../Components/Icons/Icons";
import { useTranslation } from "react-i18next";

type Car = {
  id: number;
  model: string;
  year: number;
  price: string;
  image: string;
  gear: string;
  fuel: string;
  seats: number;
  ac: boolean;
};

type CarCardProps = {
  car: Car;
  isGrid: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, "AllCarsPage">;
  searchParams?: {
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    dropoff_date: string;
    pickup_time: string;
    dropoff_time: string;
  };
  source?: string;
  user_email?: string;
};

const CarCard = ({ car, isGrid, navigation, searchParams, source, user_email }: CarCardProps) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('cars');
  
  return (
    <View
      className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl ${
        isGrid ? "w-[48%]" : "w-full"
      } mb-4 shadow-sm`}
    >
      <Image
        source={{ uri: car.image }}
        className="w-full h-40 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-sm mb-1`}>
          {car.model} {car.year}
        </Text>
        <View className="flex-row items-center mb-2 flex-wrap">
          <Icon name="fuel" size={14} className="mr-1" />
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mr-2`}>{car.fuel}</Text>
          <Icon name="gear" size={14} className="mr-1" />
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mr-2`}>{car.gear}</Text>
          <Icon name="seat" size={14} className="mr-1" />
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mr-2`}>{car.seats}</Text>
          {car.ac && (
            <>
              <Icon name="snow" size={14} className="mr-1" />
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mr-2`}>AC</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", {
            car_id: car.id,
            pickup_location: searchParams?.pickup_location,
            dropoff_location: searchParams?.dropoff_location,
            pickup_date: searchParams?.pickup_date,
            dropoff_date: searchParams?.dropoff_date,
            pickup_time: searchParams?.pickup_time,
            dropoff_time: searchParams?.dropoff_time,
            source,
            user_email
          })}
        >
          <Text className="text-white font-bold text-center text-sm">
            {t('bookNow')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarCard;