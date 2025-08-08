import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface SearchHistoryItem {
  pickup: string;
  drop: string;
  date: string;
}

interface SearchHistoryProps {
  lastSearches: SearchHistoryItem[];
  onClearHistory: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  lastSearches,
  onClearHistory,
}) => {
  const { isDark } = useTheme();

  if (lastSearches.length === 0) {
    return null;
  }

  return (
    <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-4 mb-4`}>
      <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
        Son Aramalar
      </Text>
      
      <FlatList
        data={lastSearches}
        keyExtractor={(_, index) => index.toString()}
        nestedScrollEnabled={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className={`flex-row justify-between items-center p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl mb-3 shadow-sm`}>
            <View className="flex-1">
              <Text className={`${isDark ? 'text-white' : 'text-black'} font-semibold text-sm mb-1`}>
                {item.pickup} → {item.drop}
              </Text>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                {item.date}
              </Text>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity onPress={onClearHistory} className="mt-2">
        <Text className="text-red-500 text-sm text-center font-semibold">
          Geçmişi Temizle
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchHistory;
