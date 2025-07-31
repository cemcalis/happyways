import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import HomeSvg from "../../assets/HomePage/home.svg";
import CarSvg from "../../assets/HomePage/car.svg";
import ReservationSvg from "../../assets/HomePage/search.svg";
import CampaignSvg from "../../assets/HomePage/campaign.svg";
import UserSvg from "../../assets/HomePage/user.svg";


type TabBarProps = {
navigation: any;
  activeRoute: string;
};
export default function TabBar({ navigation, activeRoute }: TabBarProps) {
  

  
  return (
    <View className="flex-row bg-white border-t border-gray-200 py-1">
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("HomePage")}
      >
        <HomeSvg width={22} height={22} fill={activeRoute === "HomePage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "HomePage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Anasayfa
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("AllCarsPage")}
      >
        <CarSvg width={22} height={22} fill={activeRoute === "AllCarsPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "AllCarsPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Araçlar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("ReservationPage")}
      >
        <ReservationSvg width={22} height={22} fill={activeRoute === "ReservationPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "ReservationPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Rezervasyon
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("CampaignPage")}
      >
        <CampaignSvg width={22} height={22} fill={activeRoute === "CampaignPage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "CampaignPage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Kampanyalar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center py-2"
        onPress={() => navigation.navigate("ProfilePage")}
      >
        <UserSvg width={22} height={22} fill={activeRoute === "ProfilePage" ? "#f97316" : "#9ca3af"} />
        <Text className={activeRoute === "ProfilePage" ? "text-orange-500 font-semibold text-xs" : "text-gray-400 text-xs"}>
          Hesabım
        </Text>
      </TouchableOpacity>
    </View>
  );
}
