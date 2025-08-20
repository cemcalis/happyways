import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ReservationSummary from "./PaymentPageComponent/ReservationSummary";
import CreditCardForm from "./PaymentPageComponent/CreditCardForm";
import { RootStackParamList } from "../../../../types"; // veya ../../../../utils/types

type PaymentNav = NativeStackNavigationProp<RootStackParamList, "PaymentPage">;
type PaymentRoute = RouteProp<RootStackParamList, "PaymentPage">;

export type CarInfo = {
  model: string;
  dailyPrice: number;
  basePrice: number;
  subtotal: number;
  kdv: number;
  total: number;
  /** Bileşenlerin beklediği alan (toplam tutarı yansıtır) */
  price: number;
  dayDifference: number;
  discountAmount: number;
  discountCode: string | null;
   pickup_location: string;
  dropoff_location: string;
  pickup_date: string;   // "DD.MM.YYYY"
  dropoff_date: string;  // "DD.MM.YYYY"
  insuranceAmount?: number;
  insuranceOptions?: string[];
  breakdown?: Record<string, any>;
};

const toTR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const parseDate = (val?: string): Date | null => {
  if (!val) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  const m = val.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) {
    const dd = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10) - 1;
    const yy = parseInt(m[3], 10);
    const d = new Date(yy, mm, dd);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const diffDaysClamp1 = (start?: string, end?: string) => {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return 1;
  const ms = e.getTime() - s.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
};

const PaymentPage = () => {
  const route = useRoute<PaymentRoute>();
  const { isDark } = useTheme();

 const {
    car_id,
    car_model,
    car_price,        // günlük fiyat (string olabilir)
    pickup_date,
    dropoff_date,
    pickup_time,
    dropoff_time,
    pickup_location,
    dropoff_location,
    user_email,
    extra_driver,
    extra_driver_price,
    insurance,
    insurance_price,
    base_price: basePriceParam,
    total_days: totalDaysParam,
  } = route.params || {};

  // gün sayısı
  const days = useMemo(() => {
    if (typeof totalDaysParam === "number") return Math.max(1, totalDaysParam);
    return diffDaysClamp1(pickup_date, dropoff_date);
  }, [pickup_date, dropoff_date, totalDaysParam]);

  // hesaplanmış carInfo
  const computed = useMemo<CarInfo>(() => {
    const dailyPrice = Number(car_price) || 0;
    const basePrice = basePriceParam ? Number(basePriceParam) : dailyPrice * days;

    const extra =
      (extra_driver ? Number(extra_driver_price || 0) : 0) +
      (insurance ? Number(insurance_price || 0) : 0);

    const subtotal = basePrice + extra;
    const kdv = Math.round(subtotal * 0.075);
    const total = subtotal + kdv;

    const pickD = parseDate(pickup_date);
    const dropD = parseDate(dropoff_date);

    return {
      model: car_model || "",
      dailyPrice,
      basePrice,
      subtotal,
      kdv,
      total,
      price: total, // <- BİLEŞENLERİN BEKLEDİĞİ ALAN
      dayDifference: days,
      discountAmount: 0,
      discountCode: null,
      pickup_location: pickup_location || "",
      dropoff_location: dropoff_location || "",
      pickup_date: pickD ? toTR(pickD) : (pickup_date || ""),
      dropoff_date: dropD ? toTR(dropD) : (dropoff_date || ""),
      insuranceAmount: insurance ? Number(insurance_price || 0) : 0,
      insuranceOptions: insurance ? ["full"] : [],
      breakdown: {
        dailyCalculation: `${dailyPrice} x ${days} gün = ${basePrice}`,
        originalPrice: basePrice,
        insurance: insurance ? Number(insurance_price || 0) : 0,
        discount: 0,
        kdv: `%7.5 KDV = ${kdv}`,
        finalTotal: total,
      },
    };
  }, [
    car_model,
    car_price,
    basePriceParam,
    days,
    extra_driver,
    extra_driver_price,
    insurance,
    insurance_price,
    pickup_location,
    dropoff_location,
    pickup_date,
    dropoff_date,
  ]);

  useEffect(() => {
    // debug
    console.log("PaymentPage dailyPrice:", computed.dailyPrice);
    console.log("PaymentPage days:", days);
    console.log("PaymentPage basePrice:", computed.basePrice);
    console.log("PaymentPage total:", computed.total);
  }, [computed, days]);

  const email = user_email || ""; // AuthContext'ten user alma ihtiyacı yok (tip hatasını kaldırır)

  return (
    <ScrollView className={`${isDark ? "bg-gray-900" : "bg-gray-50"} flex-1`} contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-4 pt-4">
        <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>Ödeme</Text>
      </View>

      {/* Özet */}
      <ReservationSummary carInfo={computed} />

      {/* Kart Formu */}
      <CreditCardForm
        carInfo={computed}
        user_email={email}
        car_id={car_id}
        pickup_date={pickup_date}
        dropoff_date={dropoff_date}
        pickup_time={pickup_time}
        dropoff_time={dropoff_time}
      />
    </ScrollView>
  );
};

export default PaymentPage;
