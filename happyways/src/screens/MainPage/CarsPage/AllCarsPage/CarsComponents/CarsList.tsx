import React from "react";
import { FlatList, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../types";
import { useTheme } from "../../../../../../contexts/ThemeContext";
import CarCard from "./CarCard";

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

const CarsList = ({ filteredCars, isGrid, navigation, searchParams, source, user_email }: CarsListProps) => {
  const { isDark } = useTheme();
  
  const renderItem = ({ item }: { item: Car }) => (
    <CarCard
      car={item}
      isGrid={isGrid}
      navigation={navigation}
      searchParams={searchParams}
      source={source}
      user_email={user_email}
    />
  );

  return (
    <FlatList
      data={filteredCars}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={isGrid ? 2 : 1}
      key={isGrid ? 'grid' : 'list'} 
      contentContainerStyle={{ 
        paddingHorizontal: 16, 
        paddingTop: 24, 
        backgroundColor: isDark ? '#111827' : '#F9FAFB' 
      }}
      columnWrapperStyle={isGrid ? { justifyContent: 'space-between' } : undefined}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CarsList;