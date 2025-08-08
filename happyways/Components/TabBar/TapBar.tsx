import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from "../Icons/Icons";
import { useTheme } from "../../contexts/ThemeContext";


type TabBarProps = {
navigation: any;
  activeRoute: string;
};
export default function TabBar({ navigation, activeRoute }: TabBarProps) {
  const { isDark } = useTheme();

  
  return (
    <View className={`flex-row ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-1`}>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("HomePage")}
      >
        <Icon name="home" size={22} fill={activeRoute === "HomePage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "HomePage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Anasayfa
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("AllCarsPage")}
      >
        <Icon name="car" size={22} fill={activeRoute === "AllCarsPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "AllCarsPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Araçlar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("ReservationPage")}
      >
        <Icon name="search" size={22} fill={activeRoute === "ReservationPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "ReservationPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Rezervasyon
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("CampaignPage")}
      >
        <Icon name="campaign" size={22} fill={activeRoute === "CampaignPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "CampaignPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Kampanyalar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("ProfilePage")}
      >
        <Icon name="user" size={22} fill={activeRoute === "ProfilePage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "ProfilePage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Hesabım
        </Text>
      </TouchableOpacity>
    </View>
  );
}
