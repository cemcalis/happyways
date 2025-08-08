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
    pickup: string;
    drop: string;
    pickupDate: string;
    dropDate: string;
    pickupTime: string;
    dropTime: string;
  };
};

const CarsList = ({ filteredCars, isGrid, navigation, searchParams }: CarsListProps) => {
  const { isDark } = useTheme();
  
  const renderItem = ({ item }: { item: Car }) => (
    <CarCard
      car={item}
      isGrid={isGrid}
      navigation={navigation}
      searchParams={searchParams}
    />
  );

  return (
    <FlatList
      data={filteredCars}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={isGrid ? 2 : 1}
      key={isGrid ? 'grid' : 'list'} // Force re-render when layout changes
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