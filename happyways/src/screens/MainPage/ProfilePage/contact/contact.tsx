import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import { WebView } from "react-native-webview";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import TabBar from "../../../../../Components/TabBar/TapBar";
import BackButton from "../../../../../Components/BackButton/BackButton";   

type ContactProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ContactPage">;
};

const ContactPage = ({ navigation }: ContactProp) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('contact');
  

  
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
        <BackButton onPress={() => navigation.goBack()} />
        <View className={`w-full h-48 mb-5 rounded-lg overflow-hidden border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
          />
        </View>

        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#000000]'} mb-2`}>{t('headquarters')}</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'} mb-4`}>
          {t('address')}
        </Text>

        <Text className={`text-sm ${isDark ? 'text-white' : 'text-[#000000]'} font-semibold`}>{t('phone')}:</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'}`}>+90 533 111 22 33</Text>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#565656]'} mb-6`}>+90 533 444 55 66</Text>

        <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#000000]'} mb-2`}>{t('writeToUs')}</Text>
        <TextInput
          placeholder={t('fullName')}
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-3 text-sm`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />
        <TextInput
          placeholder={t('phoneNumber')}
          keyboardType="phone-pad"
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-3 text-sm`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />
        <TextInput
          placeholder={t('message')}
          multiline
          numberOfLines={4}
          className={`border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-[#000000]'} rounded-md px-4 py-3 mb-5 text-sm h-28`}
          placeholderTextColor={isDark ? "#9CA3AF" : "#565656"}
        />

        <TouchableOpacity className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">{t('send')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <TabBar navigation={navigation} activeRoute="ContactPage" />
    </View>
  );
};

export default ContactPage;
  