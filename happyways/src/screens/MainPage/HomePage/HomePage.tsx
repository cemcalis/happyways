import LocationSelect from "../../../../Components/LocationSelect/LocationSelect";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";
import TabBar from "../../../../Components/TabBar/TapBar";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTheme } from "../../../../contexts/ThemeContext";
import { apiRequest, handleApiError, showErrorAlert } from "../../../../utils/errorHandling";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";
import NotificationsSvg from "../../../../assets/HomePage/notification.svg";
import { useTranslation } from "react-i18next";

import { SearchFilter, FilterModal, CampaignSection, CarSection } from "./HomePageComponent";

type HomePageProps={
navigation: NativeStackNavigationProp <RootStackParamList, "HomePage">;}
; 

type Campaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  transaction_date: string;
  rent_date: string;
  subtitle1: string;
  subtitle2: string;
};

type Car = {
  id: number;
  model: string;
  year: number;
  price: string;
  image: string;
  gear: string;
  fuel: string;
  seats: number;
  baggage: number;
  ac: boolean;
};

const HomePage = ({navigation} : HomePageProps) => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation('home');
  const { t: tAuth } = useTranslation('auth');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [currentSearchText, setCurrentSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    fuelTypes: [] as string[],
    gearTypes: [] as string[]
  });

  const handleFilteredDataChange = useCallback((
    newFilteredCars: Car[], 
    newFilteredCampaigns: Campaign[], 
    searchText: string
  ) => {
    
    let finalCars = newFilteredCars;
    
    if (activeFilters.fuelTypes.length > 0) {
      finalCars = finalCars.filter(car => 
        activeFilters.fuelTypes.includes(car.fuel)
      );
    }
    
    if (activeFilters.gearTypes.length > 0) {
      finalCars = finalCars.filter(car => 
        activeFilters.gearTypes.includes(car.gear)
      );
    }
    
    setFilteredCars(finalCars);
    setFilteredCampaigns(newFilteredCampaigns);
    setCurrentSearchText(searchText);
  }, [activeFilters]);

  const handleApplyFilters = useCallback((fuelTypes: string[], gearTypes: string[]) => {
    setActiveFilters({ fuelTypes, gearTypes });
    
    let filtered = cars;
    
    if (currentSearchText.trim() !== "") {
      filtered = cars.filter((car) => 
        car.model.toLowerCase().includes(currentSearchText.toLowerCase()) ||
        car.year.toString().includes(currentSearchText) ||
        car.fuel.toLowerCase().includes(currentSearchText.toLowerCase()) ||
        car.gear.toLowerCase().includes(currentSearchText.toLowerCase())
      );
    }
    
    if (fuelTypes.length > 0) {
      filtered = filtered.filter(car => fuelTypes.includes(car.fuel));
    }
    
    if (gearTypes.length > 0) {
      filtered = filtered.filter(car => gearTypes.includes(car.gear));
    }
    
    setFilteredCars(filtered);
  }, [cars, currentSearchText]);

  const handleFilterPress = useCallback(() => {
    setShowFilter(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setShowFilter(false);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!token) {
        Alert.alert(tAuth('error'), t('sessionExpired'));
        return;
      }

      try {
        const data = await apiRequest("http://10.0.2.2:3000/api/home", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setCampaigns(data.campaigns || []);
        setCars(data.cars || []);
        setFilteredCars(data.cars || []);
        setFilteredCampaigns(data.campaigns || []);
      } catch (error: any) {
        console.error("Home data fetch error:", error);
        const apiError = handleApiError(error);
        showErrorAlert(apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [token]);

  if (loading) {
    return <LoadingSpinner text={t('loadingHomePage')} />;
  }

  const renderHeader = () => (
    <View className="px-4">
   
      <View className="flex-row justify-between items-center pt-4 pb-2">
        <LocationSelect />
        <View className="flex-row items-center bg-orange-500 rounded-full px-4 py-2">
          <TouchableOpacity 
            className="mr-3"
            onPress={() => navigation.navigate("NotificationPage")}
          >
            <NotificationsSvg width={20} height={20} fill="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("MePage")}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=4" }}
              className="w-7 h-7 rounded-full border-2 border-white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text className={`${isDark ? 'text-white' : 'text-black'} text-[22px] font-extrabold mb-4 leading-7`}>
        {t('find Suitable Car')}
      </Text>

      <SearchFilter
        campaigns={campaigns}
        cars={cars}
        onFilteredDataChange={handleFilteredDataChange}
        onFilterPress={handleFilterPress}
      />

      <CampaignSection
        campaigns={filteredCampaigns}
        searchText={currentSearchText}
        navigation={navigation}
      />

      <CarSection
        cars={filteredCars}
        searchText={currentSearchText}
        navigation={navigation}
      />
    </View>
  );

  const renderCarItem = ({ item: car, index }: { item: Car; index: number }) => (
    <View
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl w-[48%] mb-4 shadow-sm border ${
        index % 2 === 0 ? "mr-[4%]" : ""
      }`}
    >
      <View className="p-3">
        <Image
          source={{ uri: car.image }}
          className="w-full h-24 rounded-lg mb-2"
          resizeMode="cover"
        />

        <Text className={`${isDark ? 'text-white' : 'text-gray-900'} f,ont-semibold text-sm mb-1`}>
          {car.model} {car.year}
        </Text>

        <View className="flex-row flex-wrap items-center mb-3 space-x-2">
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 bg-gray-400 rounded-full" />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{car.fuel}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 bg-gray-400 rounded-full" />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{car.gear}</Text>
          </View>
          {car.ac && (
            <View className="flex-row items-center space-x-1">
              <View className="w-3 h-3 bg-blue-400 rounded-full" />
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>AC</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", { carId: car.id })}
        >
          <Text className="text-white font-bold text-center text-sm">
            {t('rent Now')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarItem}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => 
          currentSearchText && filteredCars.length === 0 ? (
            <View className="px-4 py-8 items-center">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                "{currentSearchText}" {t('no Car Found')}
              </Text>
            </View>
          ) : null
        }
      />

      <FilterModal
        showFilter={showFilter}
        onClose={handleFilterClose}
        navigation={navigation}
        filteredCarsCount={filteredCars.length}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />

      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
};

export default HomePage;
