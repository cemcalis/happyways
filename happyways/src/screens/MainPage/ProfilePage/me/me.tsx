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
import Icon from "../../../../../Components/Icons/Icons";

type MeProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MePage">;
};

const tabItems = [
  { icon: <Icon name="home" size={20} />, label: "Anasayfa", route: "HomePage" },
  { icon: <Icon name="car" size={20} />, label: "Araçlar", route: "AllCarsPage" },
  { icon: <Icon name="search" size={20} />, label: "Rezervasyon", route: "ReservationPage" },
  { icon: <Icon name="campaign" size={20} />, label: "Kampanyalar", route: "CampaignPage" },
  { icon: <Icon name="user" size={20} />, label: "Hesabım", route: "ProfilePage" },
];

const MePage = ({ navigation }: MeProp) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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
      return Alert.alert("Hata", "Tüm alanları doldurun.");
    }

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (res.ok) {
        Alert.alert("Başarılı", "Profil güncellendi.");
      } else {
        Alert.alert("Hata", "Profil güncellenemedi.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
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
          <Text className="text-lg font-semibold">Üyelik Bilgilerim</Text>
        </View>

        <Text className="text-sm text-black mb-1">İsim Soyisim</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
        />

        <Text className="text-sm text-black mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
          keyboardType="email-address"
        />

        <Text className="text-sm text-black mb-1">Telefon Numarası</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+90 5xx xxx xx xx"
          className="border border-gray-300 rounded-md px-4 py-3 mb-3 text-sm text-black"
          keyboardType="phone-pad"
        />

        <Text className="text-sm text-black mb-1">Şifre</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 mb-5 text-sm text-black"
        />

        <TouchableOpacity onPress={handleSave} className="bg-[#F37E08] py-3 rounded-md mb-8">
          <Text className="text-white text-center text-base font-semibold">Kaydet</Text>
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
