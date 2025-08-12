import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Alert, View, Text, ActivityIndicator } from 'react-native';
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
  

  const calculateDaysDirectly = () => {
    if (!pickupDate || !dropDate) return 1;
 
    const convertDate = (dateStr: string) => {
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };
    
    const pickup = new Date(convertDate(pickupDate));
    const dropoff = new Date(convertDate(dropDate));
    
    console.log('PaymentPage pickup:', pickup);
    console.log('PaymentPage dropoff:', dropoff);
    
    const timeDiff = dropoff.getTime() - pickup.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    console.log('PaymentPage calculated days:', daysDiff);
    
    return daysDiff > 0 ? daysDiff : 1;
  };
  
  const actualTotalDays = calculateDaysDirectly();
  
 
  const dailyPrice = parseFloat((carPrice || '').replace(/[^0-9.]/g, '')) || 200;
  const calculatedBasePrice = dailyPrice * actualTotalDays;
  
 
  const extraDriverDailyPrice = 99; 
  const extraDriverTotalPrice = extraDriver ? (extraDriverDailyPrice * actualTotalDays) : 0;

  const depositPrice = carModel?.includes('BMW') ? 1800 : 2000;
  

  const finalTotalPrice = calculatedBasePrice + extraDriverTotalPrice + depositPrice;
  
  console.log('Daily price:', dailyPrice);
  console.log('Days:', actualTotalDays);
  console.log('Base price:', calculatedBasePrice);
  console.log('ExtraDriver param:', extraDriver);
  console.log('Extra driver total:', extraDriverTotalPrice);
  console.log('Deposit:', depositPrice);
  console.log('Final total:', finalTotalPrice);
  
  // Debug: totalDays parametresini kontrol et
  console.log('PaymentPage totalDays received:', totalDays, 'type:', typeof totalDays);
  console.log('PaymentPage calculated totalDays:', actualTotalDays);
  if (totalDays) {
    console.log('PaymentPage parseInt result:', parseInt(totalDays));
  }
  
  const [carInfo, setCarInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();


  const handlePaymentSuccess = () => {
    const reservationDetails = `
 REZERVASYON BİLGİLERİ

� Müşteri Bilgileri:
• Email: ${userEmail}

� Araç Bilgileri:
• Model: ${carModel}
• Günlük Fiyat: ${carPrice} ₺

 Lokasyon Bilgileri:
• Alış Yeri: ${pickup}
• İade Yeri: ${drop}

 Tarih ve Saat Bilgileri:
• Alış Tarihi: ${pickupDate}
• İade Tarihi: ${dropDate}
• Alış Saati: ${pickupTime}
• İade Saati: ${dropTime}

 Ek Hizmetler:
• Ek Sürücü: ${extraDriver ? 'Evet' : 'Hayır'}${extraDriver ? ` (+${extraDriverPrice} ₺)` : ''}
• Sigorta: ${insurance ? 'Evet' : 'Hayır'}${insurance ? ` (+${insurancePrice} ₺)` : ''}

 Fiyat Detayları:
• Araç Kirası: ${carPrice} ₺
• Ek Sürücü: ${extraDriver ? extraDriverPrice : '0'} ₺
• Sigorta: ${insurance ? insurancePrice : '0'} ₺
• Toplam Tutar: ${totalPrice} ₺

 Ödeme başarıyla tamamlandı!
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

 

  function convertToIso(dateStr: string): string {
    const parts = dateStr.split(".");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  useEffect(() => {
    const calculatePrice = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://10.0.2.2:3000/api/payment/calculate-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            carPrice,
            pickupDate: convertToIso(pickupDate ?? ""),
            dropDate: convertToIso(dropDate ?? ""),
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
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <PaymentHeader onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="orange" />
          <Text style={{ marginTop: 16, color: isDark ? '#fff' : '#333', fontSize: 16 }}>Ödeme sayfası yükleniyor...</Text>
        </View>
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
            price: calculatedBasePrice,
            kdv: Math.round(finalTotalPrice * 0.18),
            total: finalTotalPrice + Math.round(finalTotalPrice * 0.18),
            totalDays: actualTotalDays
          }} 
          extraDriver={extraDriver}
          extraDriverPrice={extraDriverTotalPrice.toString()}
          insurance={insurance}
          insurancePrice={insurancePrice}
          totalPrice={(finalTotalPrice + Math.round(finalTotalPrice * 0.18)).toString()}
        />
        <CreditCardForm 
          carInfo={carInfo} 
          userEmail={userEmail} 
          onSuccess={handlePaymentSuccess}
          
          carId={carId}
          carModel={carModel}
          carPrice={carPrice}
          pickupDate={pickupDate}
          dropDate={dropDate}
          pickupTime={pickupTime}
          dropTime={dropTime}
          pickup={pickup}
          drop={drop}
          extraDriver={extraDriver || false}
          extraDriverPrice={extraDriverTotalPrice.toString()}
          insurance={insurance || false}
          insurancePrice={insurancePrice || "0"}
          totalPrice={(finalTotalPrice + Math.round(finalTotalPrice * 0.18)).toString()}
        />
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
}

export default PaymentPage;