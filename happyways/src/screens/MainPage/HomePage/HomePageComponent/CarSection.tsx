import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import Icon from "../../../../../Components/Icons/Icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../contexts/ThemeContext";

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
  const { t } = useTranslation('home');
  const { isDark } = useTheme();
  
  const renderCarItem = ({ item: car, index }: { item: Car; index: number }) => (
    <View
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl w-[48%] mb-4 shadow-sm border ${
        index % 2 === 0 ? "mr-[4%]" : ""
      }`}
    >
      <View className="p-3">
        <Image
          source={{ uri: car.image }}
          className="w-full h-24 rounded-lg mb-2"
          resizeMode="cover"
        />

        <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-sm mb-1`}>
          {car.model} {car.year}
        </Text>

        <View className="flex-row flex-wrap items-center mb-3 space-x-2">
          <View className="flex-row items-center space-x-1">
            <Icon name="fuel" size={14} />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{car.fuel}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Icon name="gear" size={14} />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{car.gear}</Text>
          </View>
          {car.ac && (
            <View className="flex-row items-center space-x-1">
              <Icon name="snow" size={14} />
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>AC</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", { 
            carId: car.id,
            source: "HomePage" 
          })}
        >
          <Text className="text-white font-bold text-center text-sm">
            {t('rentNow')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          {searchText ? t('carsWithSearch', { searchText, count: cars.length }) : t('cars')}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllCarsPage", { source: "HomePage" })}>
          <Text className="text-sm text-gray-500">{t('showAll')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal={false}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={cars.slice(0, 4)} // Homepage'de sadece 4 araba göster
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarItem}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
          paddingHorizontal: 0
        }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mb-6"
        scrollEnabled={false} // HomePage'de scroll kapalı
        ListEmptyComponent={() => 
          searchText && cars.length === 0 ? (
            <View className="w-full items-center justify-center py-8">
              <Text className="text-gray-500 text-center">
                "{searchText}" {t('noCarFound')}
              </Text>
            </View>
          ) : null
        }
      />
    </>
  );
};

export { CarSection };
export default CarSection;
