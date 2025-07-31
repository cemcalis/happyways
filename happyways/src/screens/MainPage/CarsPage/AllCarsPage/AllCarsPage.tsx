import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";

import FilterSvg from "../../../../../assets/HomePage/filter.svg";
import GridSvg from "../../../../../assets/HomePage/grid.svg";
import ListSvg from "../../../../../assets/HomePage/list.svg";
import FuelSvg from "../../../../../assets/HomePage/fuel.svg";
import GearSvg from "../../../../../assets/HomePage/gear.svg";
import SnowSvg from "../../../../../assets/HomePage/snow.svg";
import SeatSvg from "../../../../../assets/HomePage/seat.svg";
import TabBar from "../../../../../Components/TabBar/TapBar";

type AllCarsPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CarsDetailPage">;
};

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

const AllCarsPage = ({ navigation }: AllCarsPageProp) => {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isGrid, setIsGrid] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/api/cars/allcars");
        const data = await response.json();
        setCars(data.cars);
      } catch (error) {
        console.error("Arabalar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let list = [...cars];
    if (searchText) {
      list = list.filter(
        (car) =>
          car.model.toLowerCase().includes(searchText.toLowerCase()) ||
          car.year.toString().includes(searchText)
      );
    }
    setFilteredCars(list);
  }, [cars, searchText]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="px-4 pt-2 pb-2">
            <Text className="text-xl font-semibold text-center mb-2">Araçlar</Text>
            <View className="flex-row items-center justify-between mb-2">
              <TouchableOpacity
                className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
                onPress={() => setShowFilter(!showFilter)}
              >
                <FilterSvg width={18} height={18} />
                <Text className="text-gray-800 ml-2">Filtre</Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-sm">{filteredCars.length} Sonuç</Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base text-black">Alış ve Bırakış yeri</Text>
              <View className="flex-row">
                <TouchableOpacity className="mr-2" onPress={() => setIsGrid(true)}>
                  <GridSvg width={22} height={22} fill={isGrid ? "#f97316" : "#9ca3af"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsGrid(false)}>
                  <ListSvg width={22} height={22} fill={!isGrid ? "#f97316" : "#9ca3af"} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 shadow-sm">
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Araç model veya yıl ara..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {/* Filtre Modal */}
          {showFilter && (
            <View className="absolute left-0 right-0 top-0 bottom-0 z-50 bg-black/50 justify-center items-center">
              <View className="bg-white rounded-xl p-6">
                <Text className="text-lg font-bold mb-3">Filtreleme Alanı</Text>
                <TouchableOpacity
                  className="mt-2 bg-orange-500 px-4 py-2 rounded"
                  onPress={() => setShowFilter(false)}
                >
                  <Text className="text-white">Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Araçlar Listesi */}
          <ScrollView className="px-4">
            <View
              className={`flex-row flex-wrap ${
                isGrid ? "justify-between" : "flex-col"
              }`}
            >
              {filteredCars.map((car) => (
                <View
                  key={car.id}
                  className={`bg-gray-100 rounded-xl ${
                    isGrid ? "w-[48%]" : "w-full"
                  } mb-4 shadow-sm`}
                >
                  <Image
                    source={{ uri: `http://10.0.2.2:3000/${car.image.replace(/\\/g, "/")}` }}
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
                      onPress={() => navigation.navigate("CarsDetailPage", { carId: car.id })}
                    >
                      <Text className="text-white font-bold text-center text-sm">
                        Hemen Kirala
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}
      <TabBar navigation={navigation} activeRoute="AllCarsPage" />
    </SafeAreaView>
  );
};

export default AllCarsPage;
