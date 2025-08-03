import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";
import TabBar from "../../../../../Components/TabBar/TapBar";
import BackButton from "../../../../../Components/BackButton/BackButton";
import SortSvg from "../../../../../assets/HomePage/sort.svg"; // Geçici check mark olarak kullanıyoruz

type CampaignDetailPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CampaignDetailPage">;
};

type CampaignDetail = {
  id: number;
  title: string;
  description: string;
  image: string;
  transaction_date: string;
  rent_date: string;
  subtitle1: string;
  subtitle2: string;
};

const CampaignDetailPage = ({ navigation }: CampaignDetailPageProps) => {
  const route = useRoute<RouteProp<RootStackParamList, "CampaignDetailPage">>();
  const { campaignId } = route.params;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        // Tek kampanya için API endpoint'i olmadiği için campaigns'den filtreleyelim
        const response = await fetch(`http://10.0.2.2:3000/api/campaign`);
        const data = await response.json();
        const foundCampaign = data.campaigns.find((c: any) => c.id === campaignId);
        setCampaign(foundCampaign || null);
      } catch (error) {
        console.error("Kampanya detayı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [campaignId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Kampanya bulunamadı</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-4 bg-orange-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <BackButton onPress={() => navigation.goBack()} />
          <Text className="text-lg font-semibold text-black">Kampanya Detayı</Text>
          <View className="w-8" />
        </View>

        {/* Kampanya Görseli */}
        <View className="relative">
          {campaign.image && campaign.image.includes('.svg') ? (
            <View className="w-full h-64 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 items-center justify-center">
              <View className="bg-white/20 rounded-full p-6 mb-4">
                <Text className="text-white text-4xl">🚗</Text>
              </View>
              <Text className="text-white text-xl font-bold mb-2">{campaign.title}</Text>
              <View className="bg-red-500 rounded-full px-4 py-2">
                <Text className="text-white text-sm font-bold">%20 İndirim</Text>
              </View>
            </View>
          ) : (
            <Image
              source={{ uri: campaign.image }}
              className="w-full h-64"
              resizeMode="cover"
            />
          )}
          
          {/* İndirim Badge */}
          <View className="absolute top-4 right-4 bg-red-500 rounded-full px-4 py-2">
            <Text className="text-white text-sm font-bold">%20 İndirim</Text>
          </View>
        </View>

        {/* Kampanya Bilgileri */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-black mb-2">
            {campaign.title}
          </Text>
          
          <Text className="text-gray-600 text-base mb-6 leading-6">
            {campaign.description}
          </Text>

          {/* Fiyat Bilgisi */}
          <View className="bg-orange-50 rounded-xl p-4 mb-6">
            <Text className="text-orange-600 text-lg font-bold mb-1">
              {campaign.subtitle1}
            </Text>
            <Text className="text-gray-700 text-sm">
              {campaign.subtitle2}
            </Text>
          </View>

          {/* Tarih Bilgileri */}
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-orange-500 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-sm text-gray-500">İşlem Tarihi</Text>
                <Text className="text-black font-semibold">{campaign.transaction_date}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Kiralama Tarihi</Text>
                <Text className="text-black font-semibold">{campaign.rent_date}</Text>
              </View>
            </View>
          </View>

          {/* Kampanyanın Avantajları */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-black mb-3">
              Kampanya Avantajları
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
                <Text className="text-gray-700">Lorem ipsum dolor sit amet</Text>
              </View>
              <View className="flex-row items-center">
                <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
                <Text className="text-gray-700">Consectetur adipiscing elit</Text>
              </View>
              <View className="flex-row items-center">
                <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
                <Text className="text-gray-700">Sed do eiusmod tempor incididunt</Text>
              </View>
              <View className="flex-row items-center">
                <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
                <Text className="text-gray-700">Ut labore et dolore magna aliqua</Text>
              </View>
            </View>
          </View>

          {/* Katıl Butonu */}
          <TouchableOpacity 
            className="bg-orange-500 rounded-xl py-4 shadow-md active:opacity-80"
            onPress={() => navigation.navigate("AllCarsPage", {})}
          >
            <Text className="text-white text-center font-bold text-lg">
              KATIL
            </Text>
          </TouchableOpacity>

          {/* Not */}
          <Text className="text-gray-500 text-xs text-center mt-4 px-4">
            Kampanya koşulları ve detayları için müşteri hizmetleriyle iletişime geçebilirsiniz.
          </Text>
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeRoute="CampaignPage" />
    </SafeAreaView>
  );
};

export default CampaignDetailPage;
