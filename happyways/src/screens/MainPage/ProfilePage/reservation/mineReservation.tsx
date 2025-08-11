import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../../../types";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useTheme } from "../../../../../contexts/ThemeContext";
import Icon from "../../../../../Components/Icons/Icons";
import ReservationCard from "../../../../../Components/ReservationCard/ReservationCard";

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

const ReservationListPage = ({ navigation }: ReservationPageProp) => {
  const { t } = useTranslation('reservation');
  const { t: tCommon } = useTranslation('common');
  const { isDark } = useTheme();
  
  const tabItems = [
    { icon: <Icon name="home" size={20} />, label: tCommon('home'), route: "HomePage" },
    { icon: <Icon name="car" size={20} />, label: tCommon('cars'), route: "AllCarsPage" },
    { icon: <Icon name="search" size={20} />, label: t('reservation'), route: "ReservationPage" },
    { icon: <Icon name="campaign" size={20} />, label: tCommon('campaigns'), route: "CampaignPage" },
    { icon: <Icon name="user" size={20} />, label: tCommon('myAccount'), route: "ProfilePage" },
  ];
  
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
    <View 
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg mx-4 my-2`}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
      }}
    >
     
      <View className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.model} ({item.year})</Text>
          <View className={`px-3 py-1 rounded-full`} style={{backgroundColor: item.status_info.color}}>
            <Text className="text-white text-xs font-semibold">{item.status_info.status}</Text>
          </View>
        </View>
        <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2`}>{item.status_info.message}</Text>
        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Süre: {item.duration}</Text>
      </View>
      
      {/* Reservation Details using ReservationCard */}
      <View className="p-2">
        <ReservationCard
          pickupLocation={item.pickup_location}
          dropoffLocation={item.dropoff_location}
          pickupDate={item.pickup_date}
          dropoffDate={item.dropoff_date}
          pickupTime={item.pickup_time}
          dropoffTime={item.dropoff_time}
        />
      </View>
      
      {/* Price */}
      <View className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <Text className="text-lg font-bold text-green-600 text-center">₺{item.total_price}</Text>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`flex-row justify-between items-center px-4 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="leftarrow" size={20} />
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('reservations')}</Text>
        <View className="w-5" /> 
      </View>

      {/* User Stats */}
      {stats && (
        <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} mx-4 mt-4 p-4 rounded-lg shadow-sm`}>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>{stats.user_info.name}</Text>
          <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{t('totalReservationsText', { count: stats.total })}</Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-green-600">{t('active')}: {stats.active}</Text>
            <Text className="text-sm text-blue-600">{t('upcoming')}: {stats.upcoming}</Text>
            <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('completed')}: {stats.completed}</Text>
            <Text className="text-sm text-red-600">İptal: {stats.cancelled}</Text>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View className={`flex-row ${isDark ? 'bg-gray-800' : 'bg-white'} mx-4 mt-4 rounded-lg shadow-sm`}>
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
                activeTab === tab ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {labels[tab]} ({getTabCount(tab)})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter and Sort */}
      <View className={`flex-row justify-between items-center px-4 py-3 ${isDark ? 'bg-gray-800' : 'bg-white'} mx-4 mt-2 rounded-lg shadow-sm`}>
        <TouchableOpacity className="flex-row items-center">
          <Icon name="filter" size={18} />
          <Text className={`ml-2 text-sm ${isDark ? 'text-white' : 'text-black'}`}>{t('filter')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="sort" size={20} />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066cc" />
          <Text className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loadingReservations')}</Text>
        </View>
      ) : (
        /* Reservations List */
        <FlatList
          data={getTabData()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          nestedScrollEnabled={false}
          scrollEnabled={true}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>{t('noReservationsInCategory')}</Text>
            </View>
          }
        />
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg mx-8 p-6 w-72`}>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'} mb-4 text-center`}>{t('sortBy')}</Text>
            
            <TouchableOpacity
              className={`py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              onPress={() => handleSort("new")}
            >
              <Text className={`text-base ${isDark ? 'text-white' : 'text-black'} text-center`}>{t('newest')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              onPress={() => handleSort("old")}
            >
              <Text className={`text-base ${isDark ? 'text-white' : 'text-black'} text-center`}>{t('oldest')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              onPress={() => handleSort("price")}
            >
              <Text className={`text-base ${isDark ? 'text-white' : 'text-black'} text-center`}>{t('byPrice')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="py-3 mt-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base text-red-500 text-center font-semibold">{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className={`flex-row ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border-t py-2`}>
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center"
            onPress={() => navigation.navigate(route as any)}
          >
            <View className="mb-1">{icon}</View>
            <Text className={`text-xs ${isDark ? 'text-white' : 'text-black'}`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ReservationListPage;
