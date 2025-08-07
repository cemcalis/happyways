import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";
import TabBar from "../../../../../Components/TabBar/TapBar";
import BackButton from "../../../../../Components/BackButton/BackButton";

// Import component'leri
import { 
  CampaignHeader, 
  CampaignContent, 
  CampaignActions, 
  LoadingState 
} from "./CampaignDetailComponents";

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

  // Loading ve Error state'leri
  if (loading || !campaign) {
    return <LoadingState loading={loading} error={!campaign && !loading} navigation={navigation} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <BackButton onPress={() => navigation.goBack()} />
          <Text className="text-lg font-semibold text-black">Kampanya Detayı</Text>
          <View className="w-8" />
        </View>

        {/* Campaign Header Component */}
        <CampaignHeader campaign={campaign} />

        {/* Campaign Content Component */}
        <CampaignContent campaign={campaign} />

        {/* Campaign Actions Component */}
        <CampaignActions navigation={navigation} campaignId={campaignId} />
      </ScrollView>

      {/* Tab Bar */}
      <TabBar navigation={navigation} activeRoute="CampaignPage" />
    </SafeAreaView>
  );
};

export default CampaignDetailPage;
