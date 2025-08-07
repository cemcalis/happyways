import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types';
import TabBar from '../../../../Components/TabBar/TapBar';
import { PaymentHeader, ReservationSummary, CreditCardForm } from "./PaymentPageComponent";

type PaymentPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PaymentPage">
}

const PaymentPage = ({ navigation }: PaymentPageProp) => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentPage">>();
  const { carId, carModel, carPrice, pickupDate, dropDate, pickupTime, dropTime, pickup, drop } = route.params;
  
  const [carInfo, setCarInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Backend'den fiyat hesaplaması al
  useEffect(() => {
    const calculatePrice = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://10.0.2.2:3000/api/payment/calculate-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            carPrice,
            pickupDate,
            dropDate,
            discountCode: null, // İleride kullanıcıdan alınabilir
            insuranceOptions: [] // İleride kullanıcıdan alınabilir
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setCarInfo({
            model: carModel || "",
            pickup: pickup || "",
            dropoff: drop || "",
            pickupDate: pickupDate || "",
            dropoffDate: dropDate || "",
            ...data.pricing // Backend'den gelen hesaplanmış fiyatlar
          });
        } else {
          // Fallback: eski hesaplama mantığı
          const price = Number(carPrice?.replace(/[^0-9]/g, "")) || 0;
          const kdv = Math.round(price * 0.075);
          const total = price + kdv;
          
          setCarInfo({
            model: carModel || "",
            pickup: pickup || "",
            dropoff: drop || "",
            pickupDate: pickupDate || "",
            dropoffDate: dropDate || "",
            price,
            kdv,
            total,
          });
        }
      } catch (error) {
        console.error("Fiyat hesaplama hatası:", error);
        // Fallback: eski hesaplama mantığı
        const price = Number(carPrice?.replace(/[^0-9]/g, "")) || 0;
        const kdv = Math.round(price * 0.075);
        const total = price + kdv;
        
        setCarInfo({
          model: carModel || "",
          pickup: pickup || "",
          dropoff: drop || "",
          pickupDate: pickupDate || "",
          dropoffDate: dropDate || "",
          price,
          kdv,
          total,
        });
      } finally {
        setLoading(false);
      }
    };

    calculatePrice();
  }, [carPrice, pickupDate, dropDate, carModel, pickup, drop]);

  const userEmail = "kullanici@eposta.com";

  if (loading || !carInfo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <PaymentHeader onBack={() => navigation.goBack()} />
        {/* Loading state component eklenebilir */}
        <TabBar navigation={navigation} activeRoute="HomePage" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <PaymentHeader onBack={() => navigation.goBack()} />
      <ScrollView>
        <ReservationSummary carInfo={carInfo} />
        <CreditCardForm carInfo={carInfo} userEmail={userEmail} onSuccess={() => navigation.navigate("HomePage")} />
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
}

export default PaymentPage;