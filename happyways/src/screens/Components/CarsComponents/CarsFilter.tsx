import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import FilterSvg from "../../../../../../../assets/HomePage/filter.svg";
import GridSvg from "../../../../../../../assets/HomePage/grid.svg";
import ListSvg from "../../../../../../../assets/HomePage/list.svg";

type CarsFilterProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  filteredCarsCount: number;
  handleFilterPress: () => void;
  isGrid: boolean;
  setIsGrid: (grid: boolean) => void;
  searchInfo: any;
};

const CarsFilter = ({ 
  searchText, 
  setSearchText, 
  filteredCarsCount, 
  handleFilterPress, 
  isGrid, 
  setIsGrid, 
  searchInfo 
}: CarsFilterProps) => {
  return (
    <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
          onPress={handleFilterPress}
        >
          <FilterSvg width={18} height={18} />
          <Text className="text-gray-800 ml-2">Filtre</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">{filteredCarsCount} Sonuç</Text>
      </View>
      
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base text-black">
          {searchInfo ? "Müsait Araçlar" : "Alış ve Bırakış yeri"}
        </Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-2" onPress={() => setIsGrid(true)}>
            <GridSvg width={22} height={22} fill={isGrid ? "#f97316" : "#9ca3af"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsGrid(false)}>
            <ListSvg width={22} height={22} fill={!isGrid ? "#f97316" : "#9ca3af"} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm">
        <TextInput
          className="flex-1 text-gray-800"
          placeholder="Araç model veya yıl ara..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
  );
};

export default CarsFilter;
