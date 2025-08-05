import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import TabBar from "../../../../../Components/TabBar/TapBar";

type Campaign = {
  id: number;
  title: string;
  description: string;
  transaction_date: string;
  rent_date: string;
  image: string;
  subtitle1: string;
  subtitle2: string;
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
        setCampaigns(data.campaigns);
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

      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-black">Kampanyalar</Text>
      </View>


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
            onPress={() => navigation.navigate("CampaignDetailPage", { campaignId: item.id })}
          >
  
            <Image
              source={{ uri: item.image }}
              className="w-full h-28 rounded-t-lg"
              resizeMode="cover"
            />
   
            <View className="p-2">
              <Text className="text-black text-[13px] font-bold mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-gray-500 text-[11px]" numberOfLines={2}>
                {item.description}
              </Text>

              <Text className="text-gray-600 text-[11px] mt-1"> {item.transaction_date}</Text>
              <Text className="text-gray-600 text-[11px]"> {item.rent_date}</Text>

              <View className="mt-1">
                <Text className="text-orange-500 text-[11px] font-semibold">{item.subtitle1}</Text>
                <Text className="text-blue-500 text-[11px] font-semibold">{item.subtitle2}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TabBar navigation={navigation} activeRoute="CampaignPage" />
    </View>
  );
};

export default CampaignPage;
