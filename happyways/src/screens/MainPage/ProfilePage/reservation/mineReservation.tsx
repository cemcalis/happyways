import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../../../types";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useTheme } from "../../../../../contexts/ThemeContext";
import Icon from "../../../../../Components/Icons/Icons";

type ReservationPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReservationPage">;
};

type Reservation = {
  id: number;
  car_id: number;
  model: string;
  year: string | number;
  image: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;   // "YYYY-MM-DD" veya "DD.MM.YYYY"
  dropoff_date: string;
  pickup_time: string;   // "HH:mm"
  dropoff_time: string;
  total_price: string;   // "4000" veya "₺4.000,00"
  status: string;
  duration: string;
  status_info: { status: string; message: string; color: string; icon: string };
};

type CategorizedReservations = {
  active: Reservation[];
  upcoming: Reservation[];
  completed: Reservation[];
  cancelled: Reservation[];
};

type ReservationStats = {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  user_info: { name: string; email: string; total_reservations: number };
};

const MENU_WIDTH = 200;

// Filtre/Sıralama tipleri
type DateFilter = "all" | "upcoming" | "past";
type SortBy = "new" | "old" | "priceHigh" | "priceLow";
type Filters = { date: DateFilter; pickup?: string | null; dropoff?: string | null };

const ReservationListPage = ({ navigation }: ReservationPageProp) => {
  const { t } = useTranslation("reservation");
  const { t: tCommon } = useTranslation("common");
  const { isDark } = useTheme();
  const { token } = useAuth();

  const tabItems = [
    { icon: <Icon name="home" size={20} />, label: tCommon("home"), route: "HomePage" },
    { icon: <Icon name="car" size={20} />, label: tCommon("cars"), route: "AllCarsPage" },
    { icon: <Icon name="search" size={20} />, label: t("reservation"), route: "ReservationPage" },
    { icon: <Icon name="campaign" size={20} />, label: tCommon("campaigns"), route: "CampaignPage" },
    { icon: <Icon name="user" size={20} />, label: tCommon("myAccount"), route: "ProfilePage" },
  ];

  const [categorizedReservations, setCategorizedReservations] = useState<CategorizedReservations>({
    active: [],
    upcoming: [],
    completed: [],
    cancelled: [],
  });
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Popover görünürlüğü ve seçim state'leri
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("new");
  const [filters, setFilters] = useState<Filters>({ date: "all", pickup: null, dropoff: null });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    if (!token) {
      Alert.alert("Hata", "Oturum süreniz dolmuş, lütfen tekrar giriş yapın");
      navigation.navigate("LoginPage");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://10.0.2.2:3000/api/reservation", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setCategorizedReservations(data.reservations);
        setStats(data.stats);
      } else {
        Alert.alert("Hata", data.message || "Rezervasyonlar alınamadı");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Hata", "Rezervasyonlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // --- Yardımcılar ---
  const parseDateOnly = (str: string): number => {
    if (!str) return Number.NaN;

    // YYYY-MM-DD veya YYYY/MM/DD
    const iso = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
    const dmy = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/; // DD.MM.YYYY

    let y = 0, m = 0, d = 0;

    if (iso.test(str)) {
      const [, yy, mm, dd] = str.match(iso)!;
      y = Number(yy);
      m = Number(mm) - 1;
      d = Number(dd);
    } else if (dmy.test(str)) {
      const [, dd, mm, yy] = str.match(dmy)!;
      y = Number(yy);
      m = Number(mm) - 1;
      d = Number(dd);
    } else {
      const t = new Date(str).getTime();
      return t;
    }

    // Zaman dilimi sapmalarını önlemek için yerel tarih (saat 00:00)
    return new Date(y, m, d).getTime();
  };

  const priceNumber = (v: string) => {
    const cleaned = String(v).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
    // örn: "₺4.000,00" -> 4000
  };

  // Tüm kayıtları tek listede topla
  const allReservations = useMemo(
    () => [
      ...categorizedReservations.active,
      ...categorizedReservations.upcoming,
      ...categorizedReservations.completed,
      ...categorizedReservations.cancelled,
    ],
    [categorizedReservations]
  );

  // Filtre seçenekleri (dinamik)
  const pickupOptions = useMemo(() => {
    const s = new Set<string>();
    allReservations.forEach((r) => r.pickup_location && s.add(r.pickup_location));
    return Array.from(s);
  }, [allReservations]);

  const dropoffOptions = useMemo(() => {
    const s = new Set<string>();
    allReservations.forEach((r) => r.dropoff_location && s.add(r.dropoff_location));
    return Array.from(s);
  }, [allReservations]);

  // Görünen veri: filtre + sıralama
  const visibleData = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    let arr = allReservations.filter((r) => {
      const t = parseDateOnly(r.pickup_date);

      // Tarih filtresi
      if (filters.date === "upcoming" && !Number.isNaN(t) && t < startOfToday) return false;
      if (filters.date === "past" && !Number.isNaN(t) && t >= startOfToday) return false;

      // Lokasyon filtreleri
      if (filters.pickup && r.pickup_location !== filters.pickup) return false;
      if (filters.dropoff && r.dropoff_location !== filters.dropoff) return false;

      return true;
    });

    // Sıralama
    const cmpDateNew = (a: Reservation, b: Reservation) =>
      (parseDateOnly(b.pickup_date) || 0) - (parseDateOnly(a.pickup_date) || 0);
    const cmpDateOld = (a: Reservation, b: Reservation) =>
      (parseDateOnly(a.pickup_date) || 0) - (parseDateOnly(b.pickup_date) || 0);
    const cmpPriceHigh = (a: Reservation, b: Reservation) => priceNumber(b.total_price) - priceNumber(a.total_price);
    const cmpPriceLow = (a: Reservation, b: Reservation) => priceNumber(a.total_price) - priceNumber(b.total_price);

    const map: Record<SortBy, (a: Reservation, b: Reservation) => number> = {
      new: cmpDateNew,
      old: cmpDateOld,
      priceHigh: cmpPriceHigh,
      priceLow: cmpPriceLow,
    };

    // filter() yeni dizi döndürüyor; sort() ile güvenle mutate edebiliriz
    return arr.sort(map[sortBy]);
  }, [allReservations, filters, sortBy]);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const d = new Date(`${dateStr}T${timeStr}`);
      const dayPart = d.toLocaleDateString("tr-TR", { weekday: "short", day: "2-digit", month: "short" });
      return `${dayPart}, ${timeStr}`;
    } catch {
      return `${dateStr}, ${timeStr}`;
    }
  };

  // ✅ EKLENDİ: karta tıklayınca özet sayfasına git
  const onPressReservation = (item: Reservation) => {
    navigation.navigate("ReservationSummaryPage", {
      reservationId: item.id,
      fallback: {
        id: item.id,
        car_id: item.car_id,
        model: item.model,
        year: item.year,
        image: item.image,
        pickup_location: item.pickup_location,
        dropoff_location: item.dropoff_location,
        pickup_date: item.pickup_date,
        dropoff_date: item.dropoff_date,
        pickup_time: item.pickup_time,
        dropoff_time: item.dropoff_time,
        total_price: item.total_price,
        status: item.status,
        duration: item.duration,
        status_info: item.status_info,
      },
    });
  };

  const renderRow = ({ item }: { item: Reservation }) => (
    <TouchableOpacity
      onPress={() => onPressReservation(item)}
      className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-lg mx-4 mt-2`}
      style={{ elevation: 0 }}
      activeOpacity={0.8}
    >
      <View className="px-3 py-4">
        <View className="flex-row items-center">
          {/* Sol (Kalkış) */}
          <View className="w-28">
            <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-black"}`} numberOfLines={1}>
              {item.pickup_location}
            </Text>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs mt-1`}>
              {formatDateTime(item.pickup_date, item.pickup_time)}
            </Text>
          </View>

          {/* Orta (çizgi) */}
          <View className="flex-1 mx-3 flex-row items-center justify-center">
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F7992B" }} />
            <View
              style={{
                flex: 1,
                height: 1,
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: isDark ? "#555" : "#DADADA",
                marginHorizontal: 6,
              }}
            />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F7992B" }} />
          </View>

          {/* Sağ (Varış) */}
          <View className="w-28 items-end">
            <Text className={`text-base font-semibold ${isDark ? "text-white" : "text-black"}`} numberOfLines={1}>
              {item.dropoff_location}
            </Text>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs mt-1`} numberOfLines={1}>
              {formatDateTime(item.dropoff_date, item.dropoff_time)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <View className={`flex-row justify-between items-center px-4 py-4 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="leftarrow" size={20} />
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>{t("reservations")}</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Küçük Filtre (sol) & Sıralama (sağ) */}
      <View className="flex-row items-center justify-between px-4 pt-3">
        <TouchableOpacity className="flex-row items-center" onPress={() => setFilterVisible(true)}>
          <Icon name="filter" size={14} />
          <Text className={`ml-2 text-xs ${isDark ? "text-white" : "text-black"}`}>{t("filter")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortVisible(true)}>
          <Icon name="sort" size={16} />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066cc" />
          <Text className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2`}>{t("loadingReservations")}</Text>
        </View>
      ) : (
        <FlatList
          data={visibleData}
          renderItem={renderRow}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 6 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>{t("noReservationsInCategory")}</Text>
            </View>
          }
        />
      )}

      {/* ---- SIRALAMA POPOVER (sağ üst, küçük) ---- */}
      <Modal visible={sortVisible} transparent animationType="fade" onRequestClose={() => setSortVisible(false)}>
        <TouchableOpacity activeOpacity={1} className="flex-1" onPress={() => setSortVisible(false)}>
          <View className="flex-1">
            <View style={{ position: "absolute", top: 68, right: 16, width: MENU_WIDTH }}>
              <View className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl`} style={{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}>
                {[
                  { key: "new", label: "Güncel Rezervasyonlar" },
                  { key: "old", label: "Eski Rezervasyonlar" },
                  { key: "priceHigh", label: "Fiyat Yüksek" },
                  { key: "priceLow", label: "Fiyat Düşük" },
                ].map((opt, i, arr) => (
                  <TouchableOpacity
                    key={opt.key}
                    className={`py-3 px-3 ${i < arr.length - 1 ? (isDark ? "border-b border-gray-700" : "border-b border-gray-200") : ""}`}
                    onPress={() => {
                      setSortBy(opt.key as SortBy);
                      setSortVisible(false);
                    }}
                  >
                    <Text className={`${isDark ? "text-white" : "text-black"} text-xs text-center`}>
                      {sortBy === opt.key ? "• " : ""}{opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ---- FİLTRE POPOVER (sol üst, küçük) ---- */}
      <Modal visible={filterVisible} transparent animationType="fade" onRequestClose={() => setFilterVisible(false)}>
        <TouchableOpacity activeOpacity={1} className="flex-1" onPress={() => setFilterVisible(false)}>
          <View className="flex-1">
            <View style={{ position: "absolute", top: 68, left: 12, width: MENU_WIDTH }}>
              <View className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl`} style={{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}>
                {/* Tarih */}
                <View className={`px-3 py-2 ${isDark ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                  <Text className={`${isDark ? "text-white" : "text-black"} text-xs font-semibold mb-2`}>Tarih</Text>
                  {[
                    { key: "all", label: "Tümü" },
                    { key: "upcoming", label: "Bugün ve sonrası" },
                    { key: "past", label: "Bugün öncesi" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      className="py-1"
                      onPress={() => {
                        setFilters((f) => ({ ...f, date: opt.key as DateFilter }));
                        setFilterVisible(false);
                      }}
                    >
                      <Text className={`${isDark ? "text-gray-200" : "text-gray-800"} text-xs`}>
                        {filters.date === opt.key ? "• " : ""}{opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Kalkış */}
                <View className={`px-3 py-2 ${isDark ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                  <Text className={`${isDark ? "text-white" : "text-black"} text-xs font-semibold mb-2`}>Kalkış</Text>
                  <TouchableOpacity
                    className="py-1"
                    onPress={() => {
                      setFilters((f) => ({ ...f, pickup: null }));
                      setFilterVisible(false);
                    }}
                  >
                    <Text className={`${isDark ? "text-gray-200" : "text-gray-800"} text-xs`}>
                      {filters.pickup == null ? "• " : ""}Hepsi
                    </Text>
                  </TouchableOpacity>
                  {pickupOptions.map((p) => (
                    <TouchableOpacity
                      key={p}
                      className="py-1"
                      onPress={() => {
                        setFilters((f) => ({ ...f, pickup: p }));
                        setFilterVisible(false);
                      }}
                    >
                      <Text className={`${isDark ? "text-gray-200" : "text-gray-800"} text-xs`}>
                        {filters.pickup === p ? "• " : ""}{p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Varış */}
                <View className="px-3 py-2">
                  <Text className={`${isDark ? "text-white" : "text-black"} text-xs font-semibold mb-2`}>Varış</Text>
                  <TouchableOpacity
                    className="py-1"
                    onPress={() => {
                      setFilters((f) => ({ ...f, dropoff: null }));
                      setFilterVisible(false);
                    }}
                  >
                    <Text className={`${isDark ? "text-gray-200" : "text-gray-800"} text-xs`}>
                      {filters.dropoff == null ? "• " : ""}Hepsi
                    </Text>
                  </TouchableOpacity>
                  {dropoffOptions.map((d) => (
                    <TouchableOpacity
                      key={d}
                      className="py-1"
                      onPress={() => {
                        setFilters((f) => ({ ...f, dropoff: d }));
                        setFilterVisible(false);
                      }}
                    >
                      <Text className={`${isDark ? "text-gray-200" : "text-gray-800"} text-xs`}>
                        {filters.dropoff === d ? "• " : ""}{d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Alt satır */}
                <View className={`flex-row justify-between px-3 py-2 ${isDark ? "border-t border-gray-700" : "border-t border-gray-200"}`}>
                  <TouchableOpacity onPress={() => setFilters({ date: "all", pickup: null, dropoff: null })}>
                    <Text className="text-xs text-red-500 font-semibold">Temizle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFilterVisible(false)}>
                    <Text className="text-xs font-semibold">{t("cancel") || "Kapat"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alt sekme çubuğu */}
      <View className={`flex-row ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t py-2`}>
        {tabItems.map(({ icon, label, route }, i) => {
          const highlight = route === "ProfilePage";
          return (
            <TouchableOpacity key={i} className="flex-1 items-center" onPress={() => navigation.navigate(route as any)}>
              <View className="mb-1">{icon}</View>
              <Text className={`text-xs ${highlight ? "text-orange-500" : isDark ? "text-gray-300" : "text-black"}`}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ReservationListPage;
