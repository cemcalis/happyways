import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../types";

interface CampaignActionsProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "CampaignDetailPage">;
  campaignId: number;
}

const CampaignActions: React.FC<CampaignActionsProps> = ({ navigation, campaignId }) => {
  
  const handleJoinCampaign = () => {
    Alert.alert(
      "Kampanyaya Katıl",
      "Bu kampanyaya katılmak için araç kiralama sayfasına yönlendirileceksiniz.",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Devam Et",
          onPress: () => navigation.navigate("AllCarsPage", {})
        }
      ]
    );
  };

  const handleShareCampaign = () => {
    Alert.alert("Paylaş", "Kampanya paylaşma özelliği yakında eklenecek!");
  };

  const handleFavoriteCampaign = () => {
    Alert.alert("Favoriler", "Favorilere ekleme özelliği yakında eklenecek!");
  };

  return (
    <View className="px-4 pb-6">
      {/* Main Action Button */}
      <TouchableOpacity 
        className="bg-orange-500 rounded-xl py-4 shadow-md active:opacity-80 mb-4"
        onPress={handleJoinCampaign}
      >
        <Text className="text-white text-center font-bold text-lg">
          KAMPANYAYA KATIL
        </Text>
      </TouchableOpacity>

      {/* Secondary Actions */}
      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity 
          className="flex-1 bg-gray-100 rounded-xl py-3 mr-2 active:opacity-80"
          onPress={handleFavoriteCampaign}
        >
          <Text className="text-gray-700 text-center font-semibold">
            ❤️ Favorilere Ekle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 bg-gray-100 rounded-xl py-3 ml-2 active:opacity-80"
          onPress={handleShareCampaign}
        >
          <Text className="text-gray-700 text-center font-semibold">
            📤 Paylaş
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CampaignActions;