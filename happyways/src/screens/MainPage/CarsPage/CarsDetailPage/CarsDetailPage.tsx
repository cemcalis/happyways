import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";

type CarsDetailPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CarsDetailPage">;
};

type CarDetail = {
  id: number;
  model: string;
  year: number;
  price: string;
  image: string;
  kosullar: string;
};

const CarsDetailPage = ({ navigation }: CarsDetailPageProp) => {
  const route = useRoute<RouteProp<RootStackParamList, "CarsDetailPage">>();
  const { carId } = route.params;

  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:3000/api/cars/carsdetail/${carId}`);
        const data = await response.json();
        setCar(data.car);
      } catch (error) {
        console.error("Araç detayı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [carId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!car) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Araç bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Araç Fotoğrafı */}
        <Image
          source={{ uri: car.image }}
          className="w-full h-60 rounded-b-2xl"
          resizeMode="cover"
        />

        {/* Araç Bilgileri */}
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold text-gray-900">{car.model}</Text>
          <Text className="text-gray-500 text-base mb-4">{car.year}</Text>

          {/* Kullanım Koşulları */}
          <Text className="text-lg font-semibold mb-2 text-gray-800">Kiralama Koşulları</Text>
          <Text className="text-gray-600 mb-6 leading-5">{car.kosullar}</Text>

          {/* Alış - Bırakış Bilgileri */}
          <Text className="text-lg font-semibold mb-2 text-gray-800">Alış ve Bırakış Yeri</Text>
          <Text className="text-gray-600">Ercan ➝ Lefkoşa</Text>
          <Text className="text-gray-600 mb-6">4 Gün İçin Toplam {car.price}</Text>

          {/* Hemen Kirala Butonu */}
          <TouchableOpacity className="bg-orange-500 py-4 rounded-lg mt-3 shadow-md active:opacity-80">
            <Text className="text-white text-center font-bold text-lg">🚗 Hemen Kirala</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CarsDetailPage;
