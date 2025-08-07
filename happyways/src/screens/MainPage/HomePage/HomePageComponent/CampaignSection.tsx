import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";

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

type CampaignSectionProps = {
  campaigns: Campaign[];
  searchText: string;
  navigation: NativeStackNavigationProp<RootStackParamList, "HomePage">;
};

const CampaignSection = ({ campaigns, searchText, navigation }: CampaignSectionProps) => {
  const renderCampaignItem = ({ item }: { item: Campaign }) => (
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
  );

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black">
          {searchText ? `Kampanyalar: "${searchText}" (${campaigns.length} sonuç)` : "Kampanyalar"}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CampaignPage")}>
          <Text className="text-sm text-gray-500">Tümünü Göster</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCampaignItem}
        className="mb-6"
        ListEmptyComponent={() => 
          searchText && campaigns.length === 0 ? (
            <View className="w-72 items-center justify-center py-8">
              <Text className="text-gray-500 text-center">
                "{searchText}" için kampanya bulunamadı
              </Text>
            </View>
          ) : null
        }
      />
    </>
  );
};

export default CampaignSection;
