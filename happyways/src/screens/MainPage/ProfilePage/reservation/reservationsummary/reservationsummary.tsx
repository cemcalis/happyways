import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../../../../types";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { useTheme } from "../../../../../../contexts/ThemeContext";
import Icon from "../../../../../../Components/Icons/Icons";

type ReservationSummaryRouteProp = RouteProp<RootStackParamList, "ReservationSummaryPage">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ReservationSummaryPage">;

type Props = { navigation: NavigationProp };

type ReservationDetail = {
  id: number;
  reservation_code?: string;
  car_id: number;
  model?: string;
  year?: number | string;
  image?: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;
  total_price: string;
  currency?: string;
  status: string;
  duration?: string;
  status_info?: { status: string; message: string; color: string; icon: string };

  user_full_name?: string;
  user_email?: string;
  user_phone?: string;
  car_model?: string;
  car_year?: number | string;
  car_image?: string;
  payment_id?: string;
  created_at?: string;
  updated_at?: string;
};

const ReservationSummaryPage = ({ navigation }: Props) => {
  const route = useRoute<ReservationSummaryRouteProp>();
  const { reservationId, fallback } = route.params;
  const { t } = useTranslation("reservation");
  const { isDark } = useTheme();
  const { token } = useAuth();

  const [detail, setDetail] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = timeStr ? new Date(`${dateStr}T${timeStr}`) : new Date(dateStr);
      const dayPart = d.toLocaleDateString("tr-TR", { weekday: "short", day: "2-digit", month: "short" });
      return timeStr ? `${dayPart}, ${timeStr}` : dayPart;
    } catch {
      return timeStr ? `${dateStr}, ${timeStr}` : dateStr;
    }
  };

  useEffect(() => {
    const run = async () => {
 
      try {
        const res = await fetch(`http://10.0.2.2:3000/api/reservation/${reservationId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();

          const d: ReservationDetail = {
            id: data?.reservation?.id ?? fallback?.id!,
            reservation_code: data?.reservation?.reservation_code ?? `RSV-${reservationId}`,
            car_id: data?.reservation?.car_id ?? fallback?.car_id!,
            model: data?.reservation?.model ?? data?.reservation?.car_model ?? fallback?.model,
            year: data?.reservation?.year ?? data?.reservation?.car_year ?? fallback?.year,
            image: data?.reservation?.image ?? data?.reservation?.car_image ?? fallback?.image,
            pickup_location: data?.reservation?.pickup_location ?? fallback?.pickup_location!,
            dropoff_location: data?.reservation?.dropoff_location ?? fallback?.dropoff_location!,
            pickup_date: data?.reservation?.pickup_date ?? fallback?.pickup_date!,
            dropoff_date: data?.reservation?.dropoff_date ?? fallback?.dropoff_date!,
            pickup_time: data?.reservation?.pickup_time ?? fallback?.pickup_time!,
            dropoff_time: data?.reservation?.dropoff_time ?? fallback?.dropoff_time!,
            total_price: String(data?.reservation?.total_price ?? fallback?.total_price ?? ""),
            currency: data?.reservation?.currency ?? "₺",
            status: data?.reservation?.status ?? fallback?.status ?? "",
            duration: data?.reservation?.duration ?? fallback?.duration,
            status_info: data?.reservation?.status_info ?? fallback?.status_info,
            user_full_name: data?.reservation?.user_full_name ?? data?.user?.full_name,
            user_email: data?.reservation?.user_email ?? data?.user?.email,
            user_phone: data?.reservation?.user_phone ?? data?.user?.phone,
            car_model: data?.reservation?.car_model ?? data?.car?.model,
            car_year: data?.reservation?.car_year ?? data?.car?.year,
            car_image: data?.reservation?.car_image ?? data?.car?.image,
            payment_id: data?.reservation?.payment_id,
            created_at: data?.reservation?.created_at,
            updated_at: data?.reservation?.updated_at,
          };
          setDetail(d);
        } else {
     
          if (fallback) {
            setDetail({
              ...fallback,
              reservation_code: `RSV-${reservationId}`,
              currency: "₺",
            } as ReservationDetail);
          } else {
            throw new Error("Detay bulunamadı");
          }
        }
      } catch (e) {
        console.error("Reservation detail error:", e);
        if (fallback) {
          setDetail({
            ...fallback,
            reservation_code: `RSV-${reservationId}`,
            currency: "₺",
          } as ReservationDetail);
        } else {
          Alert.alert("Hata", "Rezervasyon detayları alınamadı");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [reservationId, token]);

  const carTitle = useMemo(() => {
    const m = detail?.model ?? detail?.car_model;
    const y = detail?.year ?? detail?.car_year;
    if (!m && !y) return "";
    return `${m ?? ""}${m && y ? " " : ""}${y ?? ""}`;
  }, [detail]);

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <View className={`flex-row justify-between items-center px-4 py-4 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="leftarrow" size={20} />
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>Rezervasyon Özeti</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading || !detail ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066cc" />
          <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2`}>Yükleniyor…</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        
          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-4 p-4 rounded-lg`}>
            <View className="flex-row items-center justify-between">
              <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-black"}`}>
                {detail.reservation_code}
              </Text>
              {detail.status_info?.status ? (
                <View style={{ backgroundColor: detail.status_info.color ?? "#4B5563" }} className="px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">{detail.status_info.status}</Text>
                </View>
              ) : null}
            </View>
            {detail.status_info?.message ? (
              <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2 text-xs`}>
                {detail.status_info.message}
              </Text>
            ) : null}
          </View>

          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-3 p-4 rounded-lg`}>
            <View className="flex-row items-center">
      
              <View className="w-28">
                <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-black"}`} numberOfLines={1}>
                  {detail.pickup_location}
                </Text>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs mt-1`}>
                  {formatDateTime(detail.pickup_date, detail.pickup_time)}
                </Text>
              </View>

              <View className="flex-1 mx-3 flex-row items-center justify-center">
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F7992B" }} />
                <View style={{ flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: isDark ? "#555" : "#DADADA", marginHorizontal: 6 }} />
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F7992B" }} />
              </View>

              <View className="w-28 items-end">
                <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-black"}`} numberOfLines={1}>
                  {detail.dropoff_location}
                </Text>
                <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs mt-1`} numberOfLines={1}>
                  {formatDateTime(detail.dropoff_date, detail.dropoff_time)}
                </Text>
              </View>
            </View>
          </View>
          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-3 p-4 rounded-lg`}>
            <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"} mb-2`}>Araç</Text>
            <View className="flex-row items-center">
              {detail.car_image || detail.image ? (
                <Image
                  source={{ uri: detail.car_image || detail.image }}
                  style={{ width: 72, height: 48, borderRadius: 8, marginRight: 12 }}
                  resizeMode="cover"
                />
              ) : null}
              <View className="flex-1">
                <Text className={`text-base ${isDark ? "text-white" : "text-black"}`}>{carTitle}</Text>
                {detail.duration ? (
                  <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} text-xs mt-1`}>Süre: {detail.duration}</Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-3 p-4 rounded-lg`}>
            <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"} mb-2`}>Kullanıcı</Text>
            <Text className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>{detail.user_full_name ?? "-"}</Text>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs mt-1`}>{detail.user_email ?? "-"}</Text>
            {detail.user_phone ? (
              <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs mt-1`}>{detail.user_phone}</Text>
            ) : null}
          </View>
          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-3 p-4 rounded-lg`}>
            <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"} mb-2`}>Ödeme</Text>
            <Text className="text-base font-semibold" style={{ color: "#00A35A" }}>
              {(detail.currency ?? "₺")}{detail.total_price}
            </Text>
            {detail.payment_id ? (
              <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs mt-1`}>Ödeme No: {detail.payment_id}</Text>
            ) : null}
          </View>

          <View className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-3 p-4 rounded-lg`}>
            <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"} mb-2`}>Detaylar</Text>
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} text-xs`}>Rezervasyon ID: {detail.id}</Text>
            {detail.created_at ? (
              <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} text-xs mt-1`}>Oluşturulma: {formatDateTime(detail.created_at)}</Text>
            ) : null}
            {detail.updated_at ? (
              <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} text-xs mt-1`}>Güncelleme: {formatDateTime(detail.updated_at)}</Text>
            ) : null}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default ReservationSummaryPage;
