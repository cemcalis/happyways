import React from "react";
import { ScrollView, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";
import CarCard from "../../MainPage/CarsPage/AllCarsPage/CarsComponents/CarCard";

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

type CarsListProps = {
  filteredCars: Car[];
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

const CarsList = ({ filteredCars, isGrid, navigation, searchParams }: CarsListProps) => {
  return (
    <ScrollView className="px-4 pt-6 bg-gray-50">
      <View
        className={`flex-row flex-wrap ${
          isGrid ? "justify-between" : "flex-col"
        }`}
      >
        {filteredCars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            isGrid={isGrid}
            navigation={navigation}
            searchParams={searchParams}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default CarsList;