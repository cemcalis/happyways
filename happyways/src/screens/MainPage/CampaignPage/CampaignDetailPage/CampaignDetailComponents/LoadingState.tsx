import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../types";

interface LoadingStateProps {
  loading: boolean;
  error?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, "CampaignDetailPage">;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, error, navigation }) => {
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-600 mt-4 text-lg">Kampanya yükleniyor...</Text>
        <Text className="text-gray-400 mt-2 text-sm">Lütfen bekleyiniz</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <View className="items-center">
          <Text className="text-6xl mb-4">😕</Text>
          <Text className="text-gray-800 text-xl font-semibold mb-2">Kampanya bulunamadı</Text>
          <Text className="text-gray-500 text-center mb-6 leading-6">
            Aradığınız kampanya mevcut değil veya kaldırılmış olabilir.
          </Text>
          
          <View className="space-y-3 w-full">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="bg-orange-500 px-8 py-4 rounded-xl w-full"
            >
              <Text className="text-white font-semibold text-center text-lg">Geri Dön</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate("CampaignPage")}
              className="bg-gray-100 px-8 py-4 rounded-xl w-full"
            >
              <Text className="text-gray-700 font-semibold text-center text-lg">Tüm Kampanyalar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

export default LoadingState;