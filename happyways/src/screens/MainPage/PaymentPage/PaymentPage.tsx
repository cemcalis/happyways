import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types';
import TabBar from '../../../../Components/TabBar/TapBar';
import { useTheme } from '../../../../contexts/ThemeContext';
import { PaymentHeader, ReservationSummary, CreditCardForm } from "./PaymentPageComponent";

type PaymentPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PaymentPage">
}

const PaymentPage = ({ navigation }: PaymentPageProp) => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentPage">>();
  const { 
    carId, 
    carModel, 
    carPrice, 
    pickupDate, 
    dropDate, 
    pickupTime, 
    dropTime, 
    pickup, 
    drop, 
    source,
    extraDriver,
    extraDriverPrice,
    insurance,
    insurancePrice,
    totalPrice,
    totalDays,
    basePrice
  } = route.params;
  
  const [carInfo, setCarInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // Ödeme başarı fonksiyonu
  const handlePaymentSuccess = () => {
    const reservationDetails = `
🚗 REZERVASYON BİLGİLERİ

� Müşteri Bilgileri:
• Email: ${userEmail}

�📋 Araç Bilgileri:
• Model: ${carModel}
• Günlük Fiyat: ${carPrice} ₺

📍 Lokasyon Bilgileri:
• Alış Yeri: ${pickup}
• İade Yeri: ${drop}

📅 Tarih ve Saat Bilgileri:
• Alış Tarihi: ${pickupDate}
• İade Tarihi: ${dropDate}
• Alış Saati: ${pickupTime}
• İade Saati: ${dropTime}

🔧 Ek Hizmetler:
• Ek Sürücü: ${extraDriver ? 'Evet' : 'Hayır'}${extraDriver ? ` (+${extraDriverPrice} ₺)` : ''}
• Sigorta: ${insurance ? 'Evet' : 'Hayır'}${insurance ? ` (+${insurancePrice} ₺)` : ''}

💰 Fiyat Detayları:
• Araç Kirası: ${carPrice} ₺
• Ek Sürücü: ${extraDriver ? extraDriverPrice : '0'} ₺
• Sigorta: ${insurance ? insurancePrice : '0'} ₺
• Toplam Tutar: ${totalPrice} ₺

✅ Ödeme başarıyla tamamlandı!
    `;

    Alert.alert(
      "Rezervasyon Tamamlandı! 🎉",
      reservationDetails,
      [
        {
          text: "Tamam",
          onPress: () => navigation.navigate("HomePage")
        }
      ]
    );
  };

 
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
            discountCode: null, 
            insuranceOptions: [] 
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
            ...data.pricing 
          });
        } else {
       
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
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
        <PaymentHeader onBack={() => navigation.goBack()} />
      
        <TabBar navigation={navigation} activeRoute="HomePage" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
      <PaymentHeader onBack={() => navigation.goBack()} />
      <ScrollView>
        <ReservationSummary 
          carInfo={{
            model: carModel || '',
            pickup: pickup || '',
            dropoff: drop || '',
            pickupDate: pickupDate || '',
            dropoffDate: dropDate || '',
            pickupTime: pickupTime,
            dropoffTime: dropTime,
            price: basePrice || carInfo.price,
            kdv: Math.round((basePrice || carInfo.price) * 0.18),
            total: totalPrice || carInfo.total,
            totalDays: totalDays ? parseInt(totalDays) : undefined
          }} 
          extraDriver={extraDriver}
          extraDriverPrice={extraDriverPrice}
          insurance={insurance}
          insurancePrice={insurancePrice}
          totalPrice={totalPrice}
        />
        <CreditCardForm carInfo={carInfo} userEmail={userEmail} onSuccess={handlePaymentSuccess} />
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
}

export default PaymentPage;