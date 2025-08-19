import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";
import TabBar from "../../../../../Components/TabBar/TapBar";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../../Components/BackButton/BackButton";
import { ENV } from "../../../../../utils/env";
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
  const { carId, pickupLocation, dropoffLocation, pickupDate, pickupTime, dropoffDate, dropoffTime, source, userEmail } = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation('cars');

  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await fetch(`${ENV.API_BASE_URL}/api/cars/carsdetail/${carId}`);
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
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('carDetailsLoading')}
        </Text>
      </View>
    );
  }

  if (!car) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('carNotFound')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className={`flex-row items-center justify-between px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <BackButton onPress={() => navigation.goBack()} />
          <Text className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{t('carDetails')}</Text>
      </View>
      <ScrollView>

        <Image
          source={{ uri: car.image }}
          className="w-full h-60 rounded-b-2xl"
          resizeMode="cover"
        />

        <View className="px-5 py-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{car.model}</Text>
          <Text className="text-gray-500 text-base mb-4">{car.year}</Text>

          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{t('termsAndConditions')}</Text>
          <Text className="text-gray-600 mb-6 leading-5">{car.kosullar}</Text>

          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{t('pickupLocation')} - {t('returnLocation')}</Text>
          <Text className="text-gray-600">Ercan - Lefkoşa</Text>
          <Text className="text-gray-600 mb-6">{t('totalPrice', { price: car.price })}</Text>

          <TouchableOpacity 
            className="bg-orange-500 py-4 rounded-lg mt-3 active:opacity-80"
            style={styles.shadowButton}
            onPress={() => {
            
           if (source === "ReservationPage") {
                navigation.navigate("AdditionalRequests", {
                  carId: car.id,
                  carModel: car.model,
                  carPrice: car.price,
                  pickupDate: pickupDate || "",
                  dropDate: dropoffDate || "",
                  pickupTime: pickupTime || "",
                  dropTime: dropoffTime || "",
                  pickup: pickupLocation || "",
                  drop: dropoffLocation || "",
                  source: source || "ReservationPage",
                  userEmail
                });
              } else {
                  navigation.navigate("ReservationPage", {
               
                  carId: car.id,
                  carModel: car.model,
                  carPrice: car.price,
                  pickupDate: pickupDate || "",
                  dropDate: dropoffDate || "",
                  pickupTime: pickupTime || "",
                  dropTime: dropoffTime || "",
                  pickup: pickupLocation || "",
                  drop: dropoffLocation || "",
                  source: source || "CarsDetailPage",
                  userEmail
                });
              }
            }}
          >
            <Text className="text-white text-center font-bold text-lg">{t('rentThisCar')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="AllCarsPage"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CarsDetailPage;




