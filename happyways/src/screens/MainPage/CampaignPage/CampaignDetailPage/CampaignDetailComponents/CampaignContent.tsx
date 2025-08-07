import React from "react";
import { View, Text } from "react-native";
import SortSvg from "../../../../../../assets/HomePage/sort.svg";

interface CampaignContentProps {
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

const CampaignContent: React.FC<CampaignContentProps> = ({ campaign }) => {
  return (
    <View className="px-4 py-6">
      {/* Campaign Title and Description */}
      <Text className="text-2xl font-bold text-black mb-2">
        {campaign.title}
      </Text>
      
      <Text className="text-gray-600 text-base mb-6 leading-6">
        {campaign.description}
      </Text>

      {/* Campaign Highlight Box */}
      <View className="bg-orange-50 rounded-xl p-4 mb-6">
        <Text className="text-orange-600 text-lg font-bold mb-1">
          {campaign.subtitle1}
        </Text>
        <Text className="text-gray-700 text-sm">
          {campaign.subtitle2}
        </Text>
      </View>

      {/* Campaign Dates */}
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

      {/* Campaign Benefits */}
      <View className="bg-gray-50 rounded-xl p-4 mb-6">
        <Text className="text-lg font-semibold text-black mb-3">
          Kampanya Avantajları
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className="text-gray-700">Ücretsiz iptal hakkı</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className="text-gray-700">Ekstra sürücü ücretsiz</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className="text-gray-700">Sınırsız kilometre</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className="text-gray-700">Anında onay garantisi</Text>
          </View>
        </View>
      </View>

      {/* Campaign Terms */}
      <Text className="text-gray-500 text-xs text-center mt-4 px-4">
        Kampanya koşulları ve detayları için müşteri hizmetleriyle iletişime geçebilirsiniz.
      </Text>
    </View>
  );
};

export default CampaignContent;