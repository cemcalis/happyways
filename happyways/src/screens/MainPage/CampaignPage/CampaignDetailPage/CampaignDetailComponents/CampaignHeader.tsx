import React from "react";
import { View, Text, Image } from "react-native";

interface CampaignHeaderProps {
  campaign: {
    id: number;
    title: string;
    description: string;
    image: string;
    transaction_date: string;
    rent_date: string;
    subtitle1: string;
    subtitle2: string;
  };
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
  return (
    <View className="relative">
      {campaign.image && campaign.image.includes('.svg') ? (
        <View className="w-full h-64 bg-orange-500 items-center justify-center">
          <View className="bg-white rounded-full p-6 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
           
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
      
      <View className="absolute top-4 right-4 bg-red-500 rounded-full px-4 py-2">
        <Text className="text-white text-sm font-bold">%20 İndirim</Text>
      </View>
    </View>
  );
};

export default CampaignHeader;