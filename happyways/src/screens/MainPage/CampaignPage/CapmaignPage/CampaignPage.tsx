import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";

type Campaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  price?: string;
};

const CampaignPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/api/campaign");
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Kampanyalar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Üst Bar */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-black">Kampanyalar</Text>
      </View>

      {/* Grid Liste */}
      <FlatList
        data={campaigns}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md mb-4 w-[48%] border border-gray-100"
            onPress={() => navigation.navigate("CampaignPage", { id: item.id })}
          >
            {/* Fotoğraf */}
            <Image
              source={{ uri: item.image }}
              className="w-full h-28 rounded-t-lg"
              resizeMode="cover"
            />
            {/* İçerik */}
            <View className="p-2">
              <Text className="text-black text-[13px] font-bold" numberOfLines={2}>
                {item.title}
              </Text>
              {item.price && (
                <Text className="text-orange-500 text-[12px] font-semibold mt-1">
                  Günlük {item.price}
                </Text>
              )}
              <Text className="text-gray-500 text-[11px]" numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CampaignPage;
