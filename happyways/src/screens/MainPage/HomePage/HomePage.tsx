import LocationSelect from "../../../../Components/LocationSelect/LocationSelect";
import BackButton from "../../../../Components/BackButton/BackButton";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";
import TabBar from "../../../../Components/TabBar/TapBar";
import { useAuth } from "../../../../context/AuthContext";
import { apiRequest, handleApiError, showErrorAlert } from "../../../../utils/errorHandling";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";

import LocationSvg from "../../../../assets/HomePage/location.svg";
import SearchSvg from "../../../../assets/HomePage/search.svg";
import FilterSvg from "../../../../assets/HomePage/filter.svg";
import FuelSvg from "../../../../assets/HomePage/fuel.svg";
import GearSvg from "../../../../assets/HomePage/gear.svg";
import SnowSvg from "../../../../assets/HomePage/snow.svg";
import LeftArrowSvg from "../../../../assets/HomePage/leftarrow.svg";
import NotificationSvg from "../../../../assets/HomePage/notification.svg";

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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!token) {
        Alert.alert("Hata", "Oturum süreniz dolmuş, lütfen tekrar giriş yapın");
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
    return <LoadingSpinner text="Ana sayfa yükleniyo" />;
  }

  const renderHeader = () => (
    <View className="px-4">

      <View className="flex-row justify-between items-center pt-4 pb-2">
      <LocationSelect />
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-2">
            <NotificationSvg width={24} height={24} fill="#f97316" />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=4" }}
            className="w-9 h-9 rounded-full"
          />
        </View>
      </View>

      <Text className="text-black text-[22px] font-extrabold mb-4 leading-7">
        İhtiyacınıza Uygun Aracı{"\n"}Hızlıca Bulun!
      </Text>

      <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 mb-6 shadow-sm">
        <SearchSvg width={18} height={18} />
        <TextInput
          className="flex-1 text-gray-800 ml-3"
          placeholder="Hangi aracı istiyorsunuz?"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity className="ml-3 bg-orange-500 rounded-lg p-2">
          <FilterSvg width={16} height={16} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black">Kampanyalar</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CampaignPage")}>
          <Text className="text-sm text-gray-500">Tümünü Göster</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-xl mr-4 w-72 shadow-sm border border-gray-200"
            onPress={() => navigation.navigate("CampaignDetailPage", { campaignId: item.id })}
          >
            <View className="relative">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-t-xl"
                resizeMode="cover"
              />
              <View className="absolute top-2 left-2 bg-orange-500 rounded-md px-2 py-1">
                <Text className="text-white text-[11px] font-bold">
                  KAMPANYA
                </Text>
              </View>
            </View>
            <View className="p-4">
              <Text className="text-black font-semibold text-base mb-1">
                {item.title}
              </Text>
              <Text className="text-[13px] text-gray-600 mb-2">
                {item.description}
              </Text>
              <Text className="text-[12px] text-orange-600 font-semibold">
                {item.subtitle1}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        className="mb-6"
      />

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black">Araçlar</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllCarsPage", {})}>
          <Text className="text-sm text-gray-500">Tümünü Göster</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCarItem = ({ item: car, index }: { item: Car; index: number }) => (
    <View
      className={`bg-white rounded-xl w-[48%] mb-4 shadow-sm border border-gray-200 ${
        index % 2 === 0 ? "mr-[4%]" : ""
      }`}
    >
      <View className="p-3">
        <Image
          source={{ uri: car.image }}
          className="w-full h-24 rounded-lg mb-2"
          resizeMode="cover"
        />

        <Text className="text-gray-900 font-semibold text-sm mb-1">
          {car.model} {car.year}
        </Text>

        <View className="flex-row flex-wrap items-center mb-3 space-x-2">
          <View className="flex-row items-center space-x-1">
            <FuelSvg width={14} height={14} />
            <Text className="text-gray-500 text-xs">{car.fuel}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <GearSvg width={14} height={14} />
            <Text className="text-gray-500 text-xs">{car.gear}</Text>
          </View>
          {car.ac && (
            <View className="flex-row items-center space-x-1">
              <SnowSvg width={14} height={14} />
              <Text className="text-gray-500 text-xs">AC</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          className="bg-orange-500 py-2 rounded-lg"
          onPress={() => navigation.navigate("CarsDetailPage", { carId: car.id })}
        >
          <Text className="text-white font-bold text-center text-sm">
            Hemen Kirala
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarItem}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
};

export default HomePage;
