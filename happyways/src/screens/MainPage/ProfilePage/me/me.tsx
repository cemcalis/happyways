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
import TabBar from "../../../../../Components/TabBar/TapBar";
import { useAuth } from "../../../../../contexts/AuthContext";
import { ENV } from "../../../../../utils/env";
import BackButton from "../../../../../Components/BackButton/BackButton";

type MeProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MePage">;
};

const MePage = ({ navigation }: MeProp) => {
  const { isDark } = useTheme();
  const { t } = useTranslation(["profile", "common", "home"]);
   const { token, getUserFromToken } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");


  const userId = getUserFromToken()?.id;
  const API_URL = `${ENV.API_BASE_URL}/api/main/profile/${userId}`



 
    const fetchProfile = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        }
        if (!token || !userId) return;
      } catch (error) {
        console.log("Profil bilgileri alınamadı:", error);
      }
    };
    useEffect(() => {
    fetchProfile();
  }, []);
 

  const handleSave = async () => {
     if (!firstName || !lastName || !email || !phone || !password) {
      return Alert.alert(t("profile:error"), t("profile:fillAllFields"));
    }

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      if (res.ok) {
        Alert.alert(t("common:success"), t("profile:profileUpdated"));
      } else {
        Alert.alert(t("profile:error"), t("profile:profileUpdateFailed"));
      }
    } catch (error) {
      Alert.alert(t("profile:error"), "Sunucuya bağlanılamadı.");
    }
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <View className="items-center mb-5">
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            className="w-20 h-20 rounded-full mb-2"
          />
          <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>
            {t("profile:personalInfo")}
          </Text>
        </View>

      <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:firstName')}</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder={t('profile:firstName')}
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
        />

        <Text className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-black'}`}>{t('profile:lastName')}</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder={t('profile:lastName')}
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
        />

        <Text className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-black"}`}>
          {t("profile:email")}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("profile:email")}
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          className={`border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm ${
            isDark ? "text-white" : "text-black"
          }`}
          keyboardType="email-address"
        />

        <Text className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-black"}`}>
          {t("profile:phone")}
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder={t("profile:phone")}
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          className={`border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm ${
            isDark ? "text-white" : "text-black"
          }`}
          keyboardType="phone-pad"
        />

        <Text className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-black"}`}>
          {t("profile:password")}
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("profile:password")}
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          secureTextEntry
          className={`border border-gray-300 rounded-md px-4 py-3 mb-5 text-sm ${
            isDark ? "text-white" : "text-black"
          }`}
        />

        <TouchableOpacity onPress={handleSave} className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">{t("profile:save")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        className={`flex-row ${
          isDark ? "bg-gray-900 border-t border-gray-700" : "bg-white border-t border-gray-200"
        } py-1`}
      >
       
            
      </View>
      <TabBar navigation={navigation} activeRoute="ProfilePage" />

    </View>
  );
};

export default MePage;
