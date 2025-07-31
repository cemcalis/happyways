import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NativeWindTest() {
  return (
    <View className="flex-1 bg-gradient-to-b from-blue-500 to-purple-600 justify-center items-center p-8">
      <Text className="text-white text-3xl font-bold mb-8 text-center">
         NativeWind Çalışıyor! 
      </Text>
      
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Tailwind CSS ile styled:
        </Text>
        <Text className="text-gray-600">
          • Flexbox: flex-1, justify-center, items-center
        </Text>
        <Text className="text-gray-600">
          • Colors: bg-blue-500, text-white
        </Text>
        <Text className="text-gray-600">
          • Typography: text-3xl, font-bold
        </Text>
        <Text className="text-gray-600">
          • Spacing: p-8, mb-6
        </Text>
        <Text className="text-gray-600">
          • Border: rounded-2xl
        </Text>
      </View>

      <TouchableOpacity className="bg-green-500 px-8 py-4 rounded-full shadow-lg active:bg-green-600">
        <Text className="text-white font-bold text-lg">
          Test Button
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-red-500 px-8 py-4 rounded-full shadow-lg mt-4 active:bg-red-600">
        <Text className="text-white font-bold text-lg">
          Another Button
        </Text>
      </TouchableOpacity>
    </View>
  );
}
