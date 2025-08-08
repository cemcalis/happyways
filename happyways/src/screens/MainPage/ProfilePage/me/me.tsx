import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";
import { useTheme } from "../../../../../contexts/ThemeContext";
import Icon from "../../../../../Components/Icons/Icons";
import { useTranslation } from "react-i18next";

type MeProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MePage">;
};

const MePage = ({ navigation }: MeProp) => {
  const { isDark } = useTheme();
  const { t } = useTranslation(['profile', 'common', 'home']);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const tabItems = [
    { icon: <Icon name="home" size={20} />, label: t('home:home'), route: "HomePage" },
    { icon: <Icon name="car" size={20} />, label: t('home:cars'), route: "AllCarsPage" },
    { icon: <Icon name="search" size={20} />, label: t('home:reservation'), route: "ReservationPage" },
    { icon: <Icon name="campaign" size={20} />, label: t('home:campaigns'), route: "CampaignPage" },
    { icon: <Icon name="user" size={20} />, label: t('profile:myAccount'), route: "ProfilePage" },
  ];

  const API_URL = "http://192.168.1.10:3000/api/main/profile/1"; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.log("Profil bilgileri alınamadı:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!name || !email || !phone || !password) {
      return Alert.alert(t('profile:error'), t('profile:fillAllFields'));
    }

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (res.ok) {
        Alert.alert(t('common:success'), t('profile:profileUpdated'));
      } else {
        Alert.alert(t('profile:error'), t('profile:profileUpdateFailed'));
      }
    } catch (error) {
      Alert.alert(t('profile:error'), "Sunucuya bağlanılamadı.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
     
        <View className="items-center mb-5">
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            className="w-20 h-20 rounded-full mb-2"
          />
          <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('profile:personalInfo')}</Text>
        </View>

        <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('profile:name')}
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
        />

        <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:email')}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t('profile:email')}
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
          keyboardType="email-address"
        />

        <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:phone')}</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder={t('profile:phone')}
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
          keyboardType="phone-pad"
        />

        <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:password')}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('profile:password')}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 mb-5 text-sm text-black"
        />

        <TouchableOpacity onPress={handleSave} className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">{t('profile:save')}</Text>
        </TouchableOpacity>
      </ScrollView>
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

export default MePage;
