import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";


import HomeSvg from "../../../../assets/HomePage/home.svg";
import CarSvg from "../../../../assets/HomePage/car.svg";
import CampaignSvg from "../../../../assets/HomePage/campaign.svg";
import ReservationSvg from "../../../../assets/HomePage/search.svg";
import UserSvg from "../../../../assets/HomePage/user.svg";
import LocationSvg from "../../../../assets/HomePage/location.svg";
import SearchSvg from "../../../../assets/HomePage/search.svg";
import FilterSvg from "../../../../assets/HomePage/filter.svg";
import FuelSvg from "../../../../assets/HomePage/fuel.svg";
import GearSvg from "../../../../assets/HomePage/gear.svg";
import SnowSvg from "../../../../assets/HomePage/snow.svg";

type HomePageProps={
navigation: NativeStackNavigationProp <RootStackParamList, "HomePage">;}
; 

type Campaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  discount: number;
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

  useEffect(() => {
    fetch("http://10.0.2.2:3000/api/home")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns);
        setCars(data.cars);
      })
      .catch((err) => console.error("Veri alınamadı:", err));
  }, []);
  const tabItems = [
    { icon: <HomeSvg width={20} height={20} />, label: "Anasayfa", route: "HomePage" },
    { icon: <CarSvg width={20} height={20} />, label: "Araçlar", route: "AllCarsPage" },
    { icon: <ReservationSvg width={20} height={20} />, label: "Rezervasyon", route: "ReservationPage" },
    { icon: <CampaignSvg width={20} height={20} />, label: "Kampanyalar", route: "CampaignPage" },
    { icon: <UserSvg width={20} height={20} />, label: "Hesabım", route: "ProfilePage" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
     
        <View className="flex-row justify-between items-center pt-4 pb-2">
          <View className="flex-row items-center">
            <LocationSvg width={16} height={16} />
            <Text className="text-black text-sm ml-1">Ercan Havaalanı, KKTC</Text>
            <TouchableOpacity className="ml-1">
              <Text className="text-gray-600 text-xs">⌄</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <View className="bg-orange-500 rounded-full w-8 h-8 items-center justify-center mr-2">
              <Text className="text-white font-bold text-xs">0</Text>
            </View>
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
          <TouchableOpacity>
            <Text className="text-sm text-gray-500">Tümünü Göster</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {campaigns.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl mr-4 w-72 shadow-sm border border-gray-200"
            >
              <View className="relative">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-40 rounded-t-xl"
                  resizeMode="cover"
                />
                <View className="absolute top-2 left-2 bg-orange-500 rounded-md px-2 py-1">
                  <Text className="text-white text-[11px] font-bold">
                    %{item.discount} İndirim
                  </Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="text-black font-semibold text-base mb-1">
                  {item.title}
                </Text>
                <Text className="text-[13px] text-gray-600">
                  Günlük{" "}
                  <Text className="text-orange-500 font-semibold">{item.price}</Text>{" "}
                  ₺’den başlayan fiyatlarla
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-black">Araçlar</Text>
          <TouchableOpacity>
            <Text className="text-sm text-gray-500">Tümünü Göster</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {cars.map((car, index) => (
            <View
              key={car.id}
              className={`bg-white rounded-xl w-[48%] mb-4 shadow-sm border border-gray-200 ${
                index % 2 === 0 ? "mr-[4%]" : ""
              }`}
            >
              <View className="p-3">
<Image
  source={{ uri: `http://10.0.2.2:3000/assets/cars/${car.image}` }}
  style={{ width: 100, height: 100 }}
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

                <TouchableOpacity className="bg-orange-500 py-2 rounded-lg">
                  <Text className="text-white font-bold text-center text-sm">
                    Hemen Kirala
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

     <View className="flex-row bg-white border-t border-gray-200 py-1">
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center py-2"
           
            onPress={() => navigation.navigate(route as any)}
          >
            <View>{icon}</View>
            <Text className="text-xs">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
    </SafeAreaView>
  );
};

export default HomePage;
