import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types';
import TabBar from '../../../../Components/TabBar/TapBar';
import PaymentHeader from './PaymentPageComponent/PaymentHeader';
import ReservationSummary from './PaymentPageComponent/ReservationSummary';
import CreditCardForm from './PaymentPageComponent/CreditCardForm';

type PaymentPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PaymentPage">
}

const PaymentPage = ({ navigation }: PaymentPageProp) => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentPage">>();
  const { carId, carModel, carPrice, pickupDate, dropDate, pickupTime, dropTime, pickup, drop } = route.params;

  const price = Number(carPrice?.replace(/[^0-9]/g, "")) || 0;
  const kdv = Math.round(price * 0.075);
  const total = price + kdv;

  const carInfo = {
    model: carModel || "",
    pickup: pickup || "",
    dropoff: drop || "",
    pickupDate: pickupDate || "",
    dropoffDate: dropDate || "",
    price,
    kdv,
    total,
  };

  const userEmail = "kullanici@eposta.com";

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