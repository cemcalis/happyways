import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import { WebView } from "react-native-webview";

// SVG Iconlar
import HomeSvg from "../../../../../assets/HomePage/home.svg";
import CarSvg from "../../../../../assets/HomePage/car.svg";
import CampaignSvg from "../../../../../assets/HomePage/campaign.svg";
import ReservationSvg from "../../../../../assets/HomePage/search.svg";
import UserSvg from "../../../../../assets/HomePage/user.svg";

type ContactProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ContactPage">;
};

const tabItems = [
  { icon: <HomeSvg width={20} height={20} />, label: "Anasayfa", route: "HomePage" },
  { icon: <CarSvg width={20} height={20} />, label: "Araçlar", route: "AllCarsPage" },
  { icon: <ReservationSvg width={20} height={20} />, label: "Rezervasyon", route: "ReservationPage" },
  { icon: <CampaignSvg width={20} height={20} />, label: "Kampanyalar", route: "CampaignPage" },
  { icon: <UserSvg width={20} height={20} />, label: "Hesabım", route: "ProfilePage" },
];

const ContactPage = ({ navigation }: ContactProp) => {
  const latitude = 35.1856;
  const longitude = 33.3823;

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}">
        </iframe>
      </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* MAP */}
        <View className="w-full h-48 mb-5 rounded-lg overflow-hidden border border-gray-200">
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
          />
        </View>

        {/* GENEL MERKEZ BİLGİLERİ */}
        <Text className="text-lg font-semibold text-[#000000] mb-2">Genel Merkez</Text>
        <Text className="text-sm text-[#565656] mb-4">
          Adres: Lefkoşa, KKTC - Yakın Doğu Bulvarı No: 123
        </Text>

        <Text className="text-sm text-[#000000] font-semibold">Telefon:</Text>
        <Text className="text-sm text-[#565656]">+90 533 111 22 33</Text>
        <Text className="text-sm text-[#565656] mb-6">+90 533 444 55 66</Text>

        {/* FORM */}
        <Text className="text-sm font-semibold text-[#000000] mb-2">Bize Yazın</Text>
        <TextInput
          placeholder="Ad Soyad"
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-[#000000]"
          placeholderTextColor="#565656"
        />
        <TextInput
          placeholder="Telefon Numaranız"
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-[#000000]"
          placeholderTextColor="#565656"
        />
        <TextInput
          placeholder="Mesajınız"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-md px-4 py-3 mb-5 text-sm text-[#000000] h-28"
          placeholderTextColor="#565656"
        />

        {/* GÖNDER BUTONU */}
        <TouchableOpacity className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">Gönder</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ALT TAB BAR */}
      <View className="flex-row bg-white border-t border-gray-200 py-1">
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center py-2"
            onPress={() => navigation.navigate(route as any)}
          >
            <View>{icon}</View>
            <Text className="text-xs text-[#000000]">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ContactPage;
  