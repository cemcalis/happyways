import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "../../../../../../Components/Icons/Icons";
import { useTheme } from "../../../../../../contexts/ThemeContext";

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
  const { isDark } = useTheme();
  
  return (
    <View className={`px-4 pt-6 pb-4 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className={`flex-row items-center ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-xl px-4 py-3 shadow-sm`}
          onPress={handleFilterPress}
        >
          <Icon name="filter" size={18} />
          <Text className={`${isDark ? 'text-gray-200' : 'text-gray-800'} ml-2`}>Filtre</Text>
        </TouchableOpacity>
        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{filteredCarsCount} Sonuç</Text>
      </View>
      
      <View className="flex-row items-center justify-between mb-3">
        <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
          {searchInfo ? "Müsait Araçlar" : "Alış ve Bırakış yeri"}
        </Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-2" onPress={() => setIsGrid(true)}>
            <Icon name="grid" size={22} fill={isGrid ? "#f97316" : "#9ca3af"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsGrid(false)}>
            <Icon name="list" size={22} fill={!isGrid ? "#f97316" : "#9ca3af"} />
          </TouchableOpacity>
        </View>
      </View>
      <View className={`flex-row items-center ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-xl px-4 py-3 shadow-sm`}>
        <TextInput
          className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
          placeholder="Araç model veya yıl ara..."
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
  );
};

export default CarsFilter;
