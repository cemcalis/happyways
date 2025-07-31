import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabBar from "../../../../../Components/TabBar/TapBar";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

const CampaignDetailPage = () => {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);

  // Kampanya verisini çek
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`http://10.0.2.2:3000/api/campaign/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error("Kampanya detayı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // Kampanyaya Katıl (JWT ile)
  const handleJoinCampaign = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Hata", "Lütfen giriş yapın.");
        navigation.navigate("LoginPage");
        return;
      }

      const response = await fetch("http://10.0.2.2:3000/api/campaign/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: id }),
      });

      if (response.ok) {
        setSuccessModal(true);
      } else {
        const result = await response.json();
        Alert.alert("Hata", result.message || "Kampanyaya katılırken hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Sunucu hatası.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-center text-red-500 mt-5">Kampanya bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Geri Butonu */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-3">
          <Text className="text-orange-500 text-lg">← Kampanyalar</Text>
        </TouchableOpacity>

        {/* Kampanya Görseli */}
        <Image
          source={{ uri: campaign.image }}
          className="w-full h-52 rounded-lg mb-4"
          resizeMode="cover"
        />

        {/* Kampanya Başlık */}
        <Text className="text-lg font-bold text-black mb-2">{campaign.title}</Text>

        {/* Katıl Butonu */}
        <TouchableOpacity
          onPress={handleJoinCampaign}
          className="bg-orange-500 rounded-lg py-3 mt-2"
        >
          <Text className="text-center text-white font-semibold">KATIL</Text>
        </TouchableOpacity>

        {/* Alt Bilgiler */}
        <Text className="text-lg font-bold text-black mt-5">{campaign.title}</Text>

        <Text className="text-sm text-black mt-3">
          <Text className="font-semibold">İşlem Tarihi :</Text> {campaign.start_date} - {campaign.end_date}
        </Text>
        <Text className="text-sm text-black mt-1 mb-3">
          <Text className="font-semibold">Kiralama Tarihi :</Text> {campaign.rent_start} - {campaign.rent_end}
        </Text>

        <Text className="text-base font-semibold text-black mb-2">Kampanyadan Nasıl Yararlanabilirsiniz?</Text>
        {campaign.details && campaign.details.length > 0 ? (
          campaign.details.map((item: string, index: number) => (
            <View key={index} className="flex-row items-start mb-1">
              <Text className="text-orange-500 mr-2">•</Text>
              <Text className="text-black text-sm">{item}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 text-sm">Detay bilgisi bulunamadı.</Text>
        )}
      </ScrollView>

      {/* ✅ Başarı Modalı */}
      <Modal transparent visible={successModal} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            exiting={ZoomOut}
            className="w-full max-w-sm bg-white rounded-2xl p-6 items-center shadow-xl"
          >
            <CheckCircleIcon size={64} color="#22c55e" />
            <Text className="text-lg font-semibold text-black mt-3 text-center">
              HappWays İndirim Fırsatı!
            </Text>
            <Text className="text-sm text-gray-500 mt-2 mb-5 text-center">
              Kampanya başarıyla aktifleşti.
            </Text>
            <TouchableOpacity
              className="w-full bg-orange-500 rounded-xl py-3"
              activeOpacity={0.8}
              onPress={() => setSuccessModal(false)}
            >
              <Text className="text-center text-white font-semibold text-base">
                TAMAM
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Alt Menü */}
      <TabBar navigation={navigation} activeRoute="CampaignPage" />
    </View>
  );
};

export default CampaignDetailPage;
