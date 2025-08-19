import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";
import { useTheme } from "../../../../../contexts/ThemeContext";
import TabBar from "../../../../../Components/TabBar/TapBar";
import BackButton from "../../../../../Components/BackButton/BackButton";
import { useTranslation } from "react-i18next";
import { ENV } from "../../../../../utils/env";


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
  const { isDark } = useTheme();
  const { t } = useTranslation('campaign');

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const response = await fetch(`${ENV.API_BASE_URL}/api/campaign`);
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

  if (loading || !campaign) {
    return <LoadingState loading={loading} error={!campaign && !loading} navigation={navigation} />;
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
    
        <View className={`flex-row items-center justify-between px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('campaignDetails')}</Text>
          <View className="w-8" />
        </View>

        <CampaignHeader campaign={campaign} />

     
        <CampaignContent campaign={campaign} />

        <CampaignActions navigation={navigation} campaignId={campaignId} />
      </ScrollView>

      <TabBar navigation={navigation} activeRoute="CampaignPage" />
    </SafeAreaView>
  );
};

export default CampaignDetailPage;
