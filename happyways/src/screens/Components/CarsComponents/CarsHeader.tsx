import React from "react";
import { View, Text } from "react-native";
import BackButton from "../../../../Components/BackButton/BackButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";

type CarsHeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AllCarsPage">;
  searchInfo: any;
};

const CarsHeader = ({ navigation, searchInfo }: CarsHeaderProps) => {
  return (
    <View className="px-4 pt-4 pb-4 bg-white">
      <View className="flex-row items-center justify-between mb-8">
        <View className="items-center">
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <Text className="text-xl font-semibold text-center flex-1">
          {searchInfo ? "Müsait Araçlar" : "Tüm Araçlar"}
        </Text>
        <View className="w-8" />
      </View>
      
      {searchInfo && (
        <View className="bg-orange-50 rounded-xl p-3 mb-6 border border-orange-200">
          <Text className="text-sm font-semibold text-gray-800 mb-1">
            {searchInfo.pickup} - {searchInfo.drop}
          </Text>
          <Text className="text-xs text-gray-600">
            {searchInfo.pickupDate} {searchInfo.pickupTime} - {searchInfo.dropDate} {searchInfo.dropTime}
          </Text>
          <Text className="text-xs text-orange-600 font-semibold mt-1">
            {searchInfo.availableCarsCount} araç müsait
          </Text>
        </View>
      )}
    </View>
  );
};

export default CarsHeader;
