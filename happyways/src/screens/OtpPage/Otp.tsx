// src/screens/Otp/Otp.tsx
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import BackButtons from "../../../assets/BackButtons/backButtons.svg";
const Otp = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute();
  const { email } = route.params as { email: string };

  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleOtp = async () => {
    const otpCode = otp.join("");

    if (!otpCode) {
      Alert.alert("Uyarı", "Lütfen kodu girin.");
      return;
    }

    if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      Alert.alert("Uyarı", "Kod 4 haneli sayılardan oluşmalıdır.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Kod doğrulandı!");
        navigation.navigate("ResetPasswordPage", { email });
      } else {
        Alert.alert("Hata", data.message || "Kod doğrulanamadı.");
      }
    } catch (err) {
      console.error("OTP doğrulama hatası:", err);
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    }
  };

  const resendOtp = async () => {
    try {
      await fetch("http://10.0.2.2:3000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      Alert.alert("Gönderildi", "Kod tekrar gönderildi.");
    } catch {
      Alert.alert("Hata", "Kod yeniden gönderilemedi.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center"
      >
<BackButtons onPress={() => navigation.goBack()} />
        <Text className="text-center text-2xl font-bold mb-3">Doğrulama</Text>
        <Text className="text-center text-gray-600 text-sm mb-1">
          Email'inize bir kod gönderdik
        </Text>
        <Text className="text-center text-orange-500 font-semibold mb-6">
          {email}
        </Text>

        
        <View className="flex-row justify-between mb-4 px-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              className="w-12 h-12 border border-gray-300 rounded-xl text-center text-lg"
            />
          ))}
        </View>

        <TouchableOpacity onPress={resendOtp} className="mb-6">
          <Text className="text-center text-sm text-gray-600">
            Kodu almadınız mı?{' '}
            <Text className="text-orange-500 font-semibold">Tekrar Gönder</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOtp}
          className="bg-orange-500 py-3 rounded-xl shadow-md mx-10"
        >
          <Text className="text-white font-semibold text-center text-base">
            Devam Et
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Otp;
