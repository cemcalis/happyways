import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../../../../contexts/ThemeContext";
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
  const { isDark } = useTheme();

  return (
    <View className="px-4 py-6">
  
      <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
        {campaign.title}
      </Text>
      
      <Text className={`text-base mb-6 leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {campaign.description}
      </Text>

   
      <View className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-gray-800' : 'bg-orange-50'}`}>
        <Text className={`text-lg font-bold mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
          {campaign.subtitle1}
        </Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {campaign.subtitle2}
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-orange-500 rounded-full mr-3" />
          <View className="flex-1">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>İşlem Tarihi</Text>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{campaign.transaction_date}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
          <View className="flex-1">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kiralama Tarihi</Text>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{campaign.rent_date}</Text>
          </View>
        </View>
      </View>

   
      <View className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
          Kampanya Avantajları
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Ücretsiz iptal hakkı</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Ekstra sürücü ücretsiz</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sınırsız kilometre</Text>
          </View>
          <View className="flex-row items-center">
            <SortSvg width={16} height={16} fill="#10b981" style={{marginRight: 8}} />
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Anında onay garantisi</Text>
          </View>
        </View>
      </View>

    
      <Text className={`text-xs text-center mt-4 px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Kampanya koşulları ve detayları için müşteri hizmetleriyle iletişime geçebilirsiniz.
      </Text>
    </View>
  );
};

export default CampaignContent;