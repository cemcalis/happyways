// src/screens/MainPage/PaymentPage/PaymentPage.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ReservationSummary from "./PaymentPageComponent/ReservationSummary";
import CreditCardForm from "./PaymentPageComponent/CreditCardForm";
import { RootStackParamList } from "../../../../types";
import { useTranslation } from "react-i18next";
import { PaymentHeader } from "./PaymentPageComponent"; 
import TabBar from "../../../../Components/TabBar/TapBar";

type PaymentNav = NativeStackNavigationProp<RootStackParamList, "PaymentPage">;
type PaymentRoute = RouteProp<RootStackParamList, "PaymentPage">;

const VAT_RATE = 0.18; 

export type CarInfo = {
  model: string;
  dailyPrice: number;
  basePrice: number;
  subtotal: number;
  kdv: number;
  total: number;

  price: number;
  dayDifference: number;
  discountAmount: number;
  discountCode: string | null;
  pickup: string;
  dropoff: string;
  pickupDate: string;    
  dropoffDate: string;   
  pickupTime?: string;
  dropoffTime?: string;
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

const PaymentPage: React.FC = () => {
  const route = useRoute<PaymentRoute>();
  const navigation = useNavigation<PaymentNav>();
  const { isDark } = useTheme();
  const { t } = useTranslation("payment");

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
    userEmail,
    extraDriver,
    extraDriverPrice,
    insurance,
    insurancePrice,
    totalPrice,         
    totalDays,             
    basePrice,            
  } = route.params || {};

  const num = (v: any): number => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const cleaned = v.replace(/[^\d.,-]/g, "").replace(",", ".");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const days = useMemo(() => {
    if (typeof totalDays === "number") return Math.max(1, totalDays);
    if (typeof totalDays === "string") {
      const n = Number(totalDays);
      if (Number.isFinite(n) && n > 0) return Math.max(1, n);
    }
    return diffDaysClamp1(pickupDate, dropDate);
  }, [pickupDate, dropDate, totalDays]);

  const dailyPrice = useMemo(() => {
  
    const raw = num(carPrice);
    return raw > 0 ? raw : 0;
  }, [carPrice]);

  const computed = useMemo<CarInfo>(() => {
    
    const base = basePrice ? num(basePrice) : dailyPrice * days;

    const extra =
      (extraDriver ? num(extraDriverPrice) : 0) +
      (insurance ? num(insurancePrice) : 0);

    const subtotal = base + extra;
    const kdv = Math.round(subtotal * VAT_RATE);
    const total = subtotal + kdv;

    const pickD = parseDate(pickupDate);
    const dropD = parseDate(dropDate);

    return {
      model: carModel || "",
      dailyPrice,
      basePrice: base,
      subtotal,
      kdv,
      total,

      price: total,
      dayDifference: days,
      discountAmount: 0,
      discountCode: null,
      pickup: pickup || "",
      dropoff: drop || "",
      pickupTime: pickupTime || undefined,
      dropoffTime: dropTime || undefined,
      pickupDate: pickD ? toTR(pickD) : (pickupDate || ""),
      dropoffDate: dropD ? toTR(dropD) : (dropDate || ""),
      insuranceAmount: insurance ? num(insurancePrice) : 0,
      insuranceOptions: insurance ? ["full"] : [],
      breakdown: {
        dailyCalculation: `${dailyPrice} x ${days} gün = ${base}`,
        originalPrice: base,
        extras: extra,
        extraDriver: extraDriver ? num(extraDriverPrice) : 0,
        insurance: insurance ? num(insurancePrice) : 0,
        kdv: `${Math.round(VAT_RATE * 100)}% KDV = ${kdv}`,
        finalTotal: total,
        source,
      },
    };
  }, [
    carModel,
    dailyPrice,
    days,
    extraDriver,
    extraDriverPrice,
    insurance,
    insurancePrice,
    pickup,
    drop,
    pickupDate,
    dropDate,
    basePrice,
    source,
  ]);

  useEffect(() => {
    // Debug logları
    console.log("PaymentPage -> dailyPrice:", dailyPrice);
    console.log("PaymentPage -> days:", days);
    console.log("PaymentPage -> basePrice:", computed.basePrice);
    console.log("PaymentPage -> total:", computed.total);
  }, [computed, days, dailyPrice]);

  const email = userEmail || "";

  const summaryTotalString =
    typeof totalPrice === "string" && totalPrice.trim().length > 0
      ? totalPrice
      : String(computed.total);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#F9FAFB" }}>
      <PaymentHeader onBack={() => navigation.goBack()} />

      <ScrollView
        className={`${isDark ? "bg-gray-900" : "bg-gray-50"} flex-1`}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
            {t("payment")}
          </Text>
        </View>

 
        <ReservationSummary
          userEmail={email}
          carInfo={{
            model: computed.model,
            pickup: computed.pickup,
            dropoff: computed.dropoff,
            pickupDate: computed.pickupDate,
            dropoffDate: computed.dropoffDate,
            pickupTime: computed.pickupTime,
            dropoffTime: computed.dropoffTime,
            price: computed.basePrice + (computed.insuranceAmount || 0), 
            kdv: computed.kdv,
            total: computed.total,
            totalDays: days,
          }}
          extraDriver={!!extraDriver}
          extraDriverPrice={String(num(extraDriverPrice))}
          insurance={!!insurance}
          insurancePrice={String(num(insurancePrice))}
          totalPrice={summaryTotalString}
        />

        <CreditCardForm
          carInfo={computed}
          userEmail={email}
          reservation={{
            car_id: carId,
            pickup_location: pickup,
            dropoff_location: drop,
            pickup_date: pickupDate,
            dropoff_date: dropDate,
            pickup_time: pickupTime,
            dropoff_time: dropTime,
            total_price: Number(computed.total),
          }}
        />

       
        <View className="flex-1 justify-center px-4">
          <View
            className={`${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl p-4 shadow-sm border`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  {t("pickUp")}
                </Text>
                <Text className={`${isDark ? "text-white" : "text-black"} font-semibold text-lg`}>
                  {pickup || "Ercan"}
                </Text>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
                  {computed.pickupDate}, {computed.pickupTime || pickupTime || "--:--"}
                </Text>
              </View>
              <View className={`w-8 h-0.5 ${isDark ? "bg-gray-600" : "bg-gray-300"} mx-4`} />
              <View className="flex-1 items-end">
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  {t("dropOff")}
                </Text>
                <Text className={`${isDark ? "text-white" : "text-black"} font-semibold text-lg`}>
                  {drop || "Lefkoşa"}
                </Text>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
                  {computed.dropoffDate}, {computed.dropoffTime || dropTime || "--:--"}
                </Text>
              </View>
            </View>

            <View className={`mt-4 pt-4 border-t ${isDark ? "border-gray-600" : "border-gray-100"}`}>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                {days} {t("Days")}
              </Text>
              <Text className={`${isDark ? "text-white" : "text-black"} font-bold text-2xl`}>
                ₺ {computed.total.toFixed(2)}
              </Text>
              {extraDriver ? (
                <Text className="text-orange-500 text-sm mt-1">
                  {t("extraDriver")} (+₺ {num(extraDriverPrice).toFixed(2)})
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeRoute="HomePage" />
    </View>
  );
};

export default PaymentPage;
