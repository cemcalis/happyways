import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import { WebView } from "react-native-webview";
import { useTheme } from "../../../../../contexts/ThemeContext";
import Icon from "../../../../../Components/Icons/Icons";

type ContactProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ContactPage">;
};

const tabItems = [
  { icon: <Icon name="home" size={20} />, label: "Anasayfa", route: "HomePage" },
  { icon: <Icon name="car" size={20} />, label: "Araçlar", route: "AllCarsPage" },
  { icon: <Icon name="search" size={20} />, label: "Rezervasyon", route: "ReservationPage" },
  { icon: <Icon name="campaign" size={20} />, label: "Kampanyalar", route: "CampaignPage" },
  { icon: <Icon name="user" size={20} />, label: "Hesabım", route: "ProfilePage" },
];

const ContactPage = ({ navigation }: ContactProp) => {
  const { isDark } = useTheme();
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
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
 
        <View className={`w-full h-48 mb-5 rounded-lg overflow-hidden border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
          />
        </View>

        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#000000]'} mb-2`}>Genel Merkez</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'} mb-4`}>
          Adres: Lefkoşa, KKTC - Yakın Doğu Bulvarı No: 123
        </Text>

        <Text className={`text-sm ${isDark ? 'text-white' : 'text-[#000000]'} font-semibold`}>Telefon:</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'}`}>+90 533 111 22 33</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'} mb-6`}>+90 533 444 55 66</Text>

        <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#000000]'} mb-2`}>Bize Yazın</Text>
        <TextInput
          placeholder="Ad Soyad"
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-3 text-sm`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />
        <TextInput
          placeholder="Telefon Numaranız"
          keyboardType="phone-pad"
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-3 text-sm`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />
        <TextInput
          placeholder="Mesajınız"
          multiline
          numberOfLines={4}
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-5 text-sm h-28`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />

        <TouchableOpacity className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">Gönder</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className={`flex-row ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border-t py-1`}>
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center py-2"
            onPress={() => navigation.navigate(route as any)}
          >
            <View>{icon}</View>
            <Text className={`text-xs ${isDark ? 'text-white' : 'text-[#000000]'}`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ContactPage;
  