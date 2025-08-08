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

 

  return (
    <View className="px-4 pb-6">
    
      <TouchableOpacity 
        className="bg-orange-500 rounded-xl py-4 shadow-md active:opacity-80 mb-4"
        onPress={handleJoinCampaign}
      >
        <Text className="text-white text-center font-bold text-lg">
          KAMPANYAYA KATIL
        </Text>
      </TouchableOpacity>

     
     
  
    </View>
  );
};

export default CampaignActions;