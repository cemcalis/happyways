import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../../../../types";

interface CampaignActionsProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "CampaignDetailPage">;
  campaignId: number;
}

const CampaignActions: React.FC<CampaignActionsProps> = ({ navigation, campaignId }) => {
  const { t } = useTranslation('campaign');
  
  const handleJoinCampaign = () => {
    Alert.alert(
      t('joinCampaignTitle'),
      t('joinCampaignMessage'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        {
          text: t('continue'),
         onPress: () => navigation.navigate("AllCarsPage", { source: "CampaignDetailPage" })
        }
      ]
    );
  };

 

  return (
    <View className="px-4 pb-6">
    
      <TouchableOpacity 
        className="bg-orange-500 rounded-xl py-4 active:opacity-80 mb-4"
        onPress={handleJoinCampaign}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-white text-center font-bold text-lg">
          {t('joinCampaignButton')}
        </Text>
      </TouchableOpacity>

     
     
  
    </View>
  );
};

export default CampaignActions;