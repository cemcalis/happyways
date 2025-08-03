import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../../types'
import TabBar from '../../../../Components/TabBar/TapBar'
import BackButton from '../../../../Components/BackButton/BackButton'
import { useAuth } from '../../../../context/AuthContext'
import { apiRequest, handleApiError, showErrorAlert } from '../../../../utils/errorHandling'

type PaymentPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PaymentPage">
}

const PaymentPage = ({ navigation }: PaymentPageProp) => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentPage">>();
  const { carId, carModel, carPrice, pickupDate, dropDate, pickupTime, dropTime, pickup, drop } = route.params;
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!token) {
      Alert.alert("Hata", "Lütfen önce giriş yapın");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Önce rezervasyon oluştur
      const reservationData = {
        car_id: carId,
        pickup_location: pickup || "Ercan Havaalanı",
        dropoff_location: drop || "Lefkoşa", 
        pickup_date: pickupDate || "2024-04-04",
        dropoff_date: dropDate || "2024-04-07",
        pickup_time: pickupTime || "12:00",
        dropoff_time: dropTime || "12:00",
        total_price: carPrice?.replace(/[^0-9]/g, '') || "100"
      };

      const reservationResult = await apiRequest("http://10.0.2.2:3000/api/reservation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });

      if (reservationResult.reservation_id) {
        // 2. Rezervasyon başarılıysa ödeme işlemi
        const paymentData = {
          reservation_id: reservationResult.reservation_id,
          payment_method: "credit_card",
          amount: reservationData.total_price,
          card_number: "4111111111111111", // Geçici test kartı
          card_holder: "Test User",
          expiry_date: "12/25",
          cvv: "123"
        };

        const paymentResult = await apiRequest("http://10.0.2.2:3000/api/payment", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(paymentData)
        });

        if (paymentResult.success) {
          Alert.alert(
            "Ödeme Başarılı! 🎉",
            `${carModel} aracınız rezerve edildi.\nRezervasyon ID: ${reservationResult.reservation_id}`,
            [
              {
                text: "Tamam",
                onPress: () => navigation.navigate("HomePage")
              }
            ]
          );
        } else {
          Alert.alert("Ödeme Hatası", paymentResult.message || "Ödeme işlemi başarısız");
        }
      } else {
        Alert.alert("Rezervasyon Hatası", "Rezervasyon oluşturulamadı");
      }

    } catch (error: any) {
      const apiError = handleApiError(error);
      showErrorAlert(apiError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <BackButton onPress={() => navigation.goBack()} />
        <Text className="text-lg font-semibold text-black">Ödeme</Text>
        <View className="w-8" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 w-full max-w-sm">
          <Text className="text-2xl font-bold text-center text-black mb-2">
            💳 Ödeme Sayfası
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            {carModel} aracınız için ödeme işlemi
          </Text>
          <Text className="text-lg font-bold text-center text-orange-600 mb-6">
            Toplam: {carPrice}
          </Text>
          
          <TouchableOpacity 
            className={`py-4 rounded-xl mb-3 ${loading ? 'bg-gray-400' : 'bg-orange-500'}`}
            onPress={handlePayment}
            disabled={loading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? "İşlem Yapılıyor..." : "Ödemeyi Tamamla"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="border border-gray-300 py-3 rounded-xl"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text className="text-gray-700 text-center font-semibold">
              İptal Et
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  )
}

export default PaymentPage