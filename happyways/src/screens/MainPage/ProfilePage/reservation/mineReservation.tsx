import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import { useAuth } from "../../../../../context/AuthContext";

import HomeSvg from "../../../../../assets/HomePage/home.svg";
import CarSvg from "../../../../../assets/HomePage/car.svg";
import CampaignSvg from "../../../../../assets/HomePage/campaign.svg";
import ReservationSvg from "../../../../../assets/HomePage/search.svg";
import UserSvg from "../../../../../assets/HomePage/user.svg";
import FilterSvg from "../../../../../assets/HomePage/filter.svg";
import SortSvg from "../../../../../assets/HomePage/sort.svg";
import LeftArrowSvg from "../../../../../assets/HomePage/leftarrow.svg";

type ReservationPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReservationPage">;
};

type Reservation = {
  id: number;
  car_id: number;
  model: string;
  year: number;
  image: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;
  total_price: string;
  status: string;
  duration: string;
  status_info: {
    status: string;
    message: string;
    color: string;
    icon: string;
  };
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
  user_info: {
    name: string;
    email: string;
    total_reservations: number;
  };
};

const tabItems = [
  { icon: <HomeSvg width={20} height={20} />, label: "Anasayfa", route: "HomePage" },
  { icon: <CarSvg width={20} height={20} />, label: "Araçlar", route: "AllCarsPage" },
  { icon: <ReservationSvg width={20} height={20} />, label: "Rezervasyon", route: "ReservationPage" },
  { icon: <CampaignSvg width={20} height={20} />, label: "Kampanyalar", route: "CampaignPage" },
  { icon: <UserSvg width={20} height={20} />, label: "Hesabım", route: "ProfilePage" },
];

const ReservationListPage = ({ navigation }: ReservationPageProp) => {
  const [categorizedReservations, setCategorizedReservations] = useState<CategorizedReservations>({
    active: [],
    upcoming: [],
    completed: [],
    cancelled: []
  });
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('active');
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useAuth();

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
      const response = await fetch("http://10.0.2.2:3000/api/reservation", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCategorizedReservations(data.reservations);
        setStats(data.stats);
      } else {
        Alert.alert("Hata", data.message || "Rezervasyonlar alınamadı");
      }
    } catch (error) {
      console.error("Rezervasyon fetch hatası:", error);
      Alert.alert("Hata", "Rezervasyonlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  

  const handleSort = (type: string) => {
    sortReservations(type);
  };

  const sortReservations = (sortBy: string) => {
    const currentData = getTabData();
    let sorted = [...currentData];
    
    if (sortBy === "new") {
      sorted.sort((a, b) => new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime());
    } else if (sortBy === "old") {
      sorted.sort((a, b) => new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime());
    } else if (sortBy === "price") {
      sorted.sort((a, b) => parseFloat(a.total_price) - parseFloat(b.total_price));
    }
    
    setCategorizedReservations(prev => ({
      ...prev,
      [activeTab]: sorted
    }));
    setModalVisible(false);
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'active': return categorizedReservations.active;
      case 'upcoming': return categorizedReservations.upcoming;
      case 'completed': return categorizedReservations.completed;
      case 'cancelled': return categorizedReservations.cancelled;
      default: return [];
    }
  };

  const getTabCount = (tab: 'active' | 'upcoming' | 'completed' | 'cancelled') => {
    return categorizedReservations[tab].length;
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View className="bg-white rounded-lg mx-4 my-2 shadow-md">
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-black">{item.model} ({item.year})</Text>
          <View className={`px-3 py-1 rounded-full`} style={{backgroundColor: item.status_info.color}}>
            <Text className="text-white text-xs font-semibold">{item.status_info.status}</Text>
          </View>
        </View>
        <Text className="text-gray-600 text-sm mb-2">{item.status_info.message}</Text>
        <Text className="text-gray-500 text-xs">Süre: {item.duration}</Text>
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between mb-3">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700">Alış Yeri</Text>
            <Text className="text-base font-semibold text-black">{item.pickup_location}</Text>
            <Text className="text-xs text-gray-500 mt-1">{item.pickup_date} {item.pickup_time}</Text>
          </View>
          <View className="w-px bg-gray-200 mx-4" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700">Dönüş Yeri</Text>
            <Text className="text-base font-semibold text-black">{item.dropoff_location}</Text>
            <Text className="text-xs text-gray-500 mt-1">{item.dropoff_date} {item.dropoff_time}</Text>
          </View>
        </View>
        
        <View className="border-t border-gray-100 pt-3">
          <Text className="text-lg font-bold text-green-600 text-center">₺{item.total_price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowSvg width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Rezervasyonlar</Text>
        <View className="w-5" /> 
      </View>

      {/* User Stats */}
      {stats && (
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-bold text-black mb-2">{stats.user_info.name}</Text>
          <Text className="text-gray-600 mb-3">Toplam {stats.total} rezervasyon</Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-green-600">Aktif: {stats.active}</Text>
            <Text className="text-sm text-blue-600">Yaklaşan: {stats.upcoming}</Text>
            <Text className="text-sm text-gray-600">Tamamlanan: {stats.completed}</Text>
            <Text className="text-sm text-red-600">İptal: {stats.cancelled}</Text>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View className="flex-row bg-white mx-4 mt-4 rounded-lg shadow-sm">
        {(['active', 'upcoming', 'completed', 'cancelled'] as const).map((tab, index) => {
          const labels = {
            active: 'Aktif',
            upcoming: 'Yaklaşan',
            completed: 'Tamamlanan',
            cancelled: 'İptal'
          };
          
          return (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 px-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text className={`text-center text-xs font-semibold ${
                activeTab === tab ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {labels[tab]} ({getTabCount(tab)})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter and Sort */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white mx-4 mt-2 rounded-lg shadow-sm">
        <TouchableOpacity className="flex-row items-center">
          <FilterSvg width={18} height={18} />
          <Text className="ml-2 text-sm text-black">Filtre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <SortSvg width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066cc" />
          <Text className="mt-2 text-gray-600">Rezervasyonlar yükleniyor...</Text>
        </View>
      ) : (
        /* Reservations List */
        <FlatList
          data={getTabData()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-center">Bu kategoride rezervasyon bulunmuyor</Text>
            </View>
          }
        />
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-lg mx-8 p-6 w-72">
            <Text className="text-lg font-semibold text-black mb-4 text-center">Sıralama</Text>
            
            <TouchableOpacity
              className="py-3 border-b border-gray-200"
              onPress={() => handleSort("new")}
            >
              <Text className="text-base text-black text-center">Yeni Tarihe Göre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="py-3 border-b border-gray-200"
              onPress={() => handleSort("old")}
            >
              <Text className="text-base text-black text-center">Eski Tarihe Göre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="py-3 border-b border-gray-200"
              onPress={() => handleSort("price")}
            >
              <Text className="text-base text-black text-center">Fiyata Göre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="py-3 mt-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base text-red-500 text-center font-semibold">İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="flex-row bg-white border-t border-gray-200 py-2">
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center"
            onPress={() => navigation.navigate(route as any)}
          >
            <View className="mb-1">{icon}</View>
            <Text className="text-xs text-black">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ReservationListPage;
