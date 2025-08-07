import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import Icon from "../../../../../Components/Icons/Icons";

type Car = {
  id: number;
  model: string;
  year: number;
  price: string;
  image: string;
  gear: string;
  fuel: string;
  seats: number;
  baggage: number;
  ac: boolean;
};

type CarSectionProps = {
  cars: Car[];
  searchText: string;
  navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">;
};

const CarSection = ({ cars, searchText, navigation }: CarSectionProps) => {
  const renderCarItem = ({ item: car, index }: { item: Car; index: number }) => (
    <View
      className={`bg-white rounded-xl w-[48%] mb-4 shadow-sm border border-gray-200 ${
        index % 2 === 0 ? "mr-[4%]" : ""
      }`}
    >
      <View className="p-3">
        <Image
          source={{ uri: car.image }}
          className="w-full h-24 rounded-lg mb-2"
          resizeMode="cover"
        />

        <Text className="text-gray-900 font-semibold text-sm mb-1">
          {car.model} {car.year}
        </Text>

        <View className="flex-row flex-wrap items-center mb-3 space-x-2">
          <View className="flex-row items-center space-x-1">
            <Icon name="fuel" size={14} />
            <Text className="text-gray-500 text-xs">{car.fuel}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Icon name="gear" size={14} />
            <Text className="text-gray-500 text-xs">{car.gear}</Text>
          </View>
          {car.ac && (
            <View className="flex-row items-center space-x-1">
              <Icon name="snow" size={14} />
              <Text className="text-gray-500 text-xs">AC</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", { carId: car.id })}
        >
          <Text className="text-white font-bold text-center text-sm">
            Hemen Kirala
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black">
          {searchText ? `Araçlar: "${searchText}" (${cars.length} sonuç)` : "Araçlar"}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllCarsPage", {})}>
          <Text className="text-sm text-gray-500">Tümünü Göster</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export { CarSection };
export default CarSection;
