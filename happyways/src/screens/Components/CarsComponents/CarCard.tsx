import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";
import FuelSvg from "../../../../../../assets/HomePage/fuel.svg";
import GearSvg from "../../../../../../assets/HomePage/gear.svg";
import SnowSvg from "../../../../../../assets/HomePage/snow.svg";
import SeatSvg from "../../../../../../assets/HomePage/seat.svg";

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
    pickup: string;
    drop: string;
    pickupDate: string;
    dropDate: string;
    pickupTime: string;
    dropTime: string;
  };
};

const CarCard = ({ car, isGrid, navigation, searchParams }: CarCardProps) => {
  return (
    <View
      className={`bg-gray-100 rounded-xl ${
        isGrid ? "w-[48%]" : "w-full"
      } mb-4 shadow-sm`}
    >
      <Image
        source={{ uri: car.image }}
        className="w-full h-40 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-gray-900 font-semibold text-sm mb-1">
          {car.model} {car.year}
        </Text>
        <View className="flex-row items-center mb-2 flex-wrap">
          <FuelSvg width={14} height={14} className="mr-1" />
          <Text className="text-gray-500 text-xs mr-2">{car.fuel}</Text>
          <GearSvg width={14} height={14} className="mr-1" />
          <Text className="text-gray-500 text-xs mr-2">{car.gear}</Text>
          <SeatSvg width={14} height={14} className="mr-1" />
          <Text className="text-gray-500 text-xs mr-2">{car.seats}</Text>
          {car.ac && (
            <>
              <SnowSvg width={14} height={14} className="mr-1" />
              <Text className="text-gray-500 text-xs mr-2">AC</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", { 
            carId: car.id,
            pickupLocation: searchParams?.pickup,
            dropoffLocation: searchParams?.drop,
            pickupDate: searchParams?.pickupDate,
            dropoffDate: searchParams?.dropDate,
            pickupTime: searchParams?.pickupTime,
            dropoffTime: searchParams?.dropTime,
          })}
        >
          <Text className="text-white font-bold text-center text-sm">
            Hemen Kirala
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarCard;