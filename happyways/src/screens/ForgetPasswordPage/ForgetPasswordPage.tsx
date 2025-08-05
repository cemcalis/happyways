import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import ReusableTextInput from "../../../Components/ReusableTextInput/ReusableTextInput";
import BackButton from "../../../Components/BackButton/BackButton";

type ForgetPasswordPageProp = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ForgetPasswordPage"
  >;
};

const ForgetPasswordPage = ({ navigation }: ForgetPasswordPageProp) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Hata", "E-posta adresi boş olamaz.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("API yanıtı:", data);

      if (response.ok) {
        Alert.alert("Başarılı", data.message || "Kod gönderildi.");
        navigation.navigate("OtpPage", { email });
      } else {
        Alert.alert("Hata", data.message || "İşlem başarısız.");
      }
    } catch (error) {
      console.error("Kodu gönderme hatası:", error);
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <BackButton onPress={() => navigation.goBack()} />

  
        <View className="px-6">
          <Text className="text-gray-900 text-2xl font-bold mb-8">
            Şifremi Unuttum!
          </Text>

          
         <ReusableTextInput
  label="Email"
  placeholder="ayse.zorlu@neareacttechnology.com"
  placeholderTextColor="#9CA3AF"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

          <TouchableOpacity 
            className="bg-orange-500 py-4 rounded-xl shadow-lg active:bg-orange-600 mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold text-center text-lg">
              Gönder
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPasswordPage;
