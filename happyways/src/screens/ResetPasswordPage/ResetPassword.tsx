import BackButton from "../../../Components/BackButton/BackButton";
import { StyleSheet, Text, View, Alert, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import ReusableTextInput from "../../../Components/ReusableTextInput/ReusableTextInput";
import BackButtons from "../../../assets/BackButtons/backButtons.svg";
import { useTheme } from "../../../contexts/ThemeContext";
type ResetPasswordPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ResetPasswordPage">;
};

const ResetPassword = ({ navigation }: ResetPasswordPageProp) => {
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isDark } = useTheme();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Uyarı", "Lütfen tüm alanları doldurun");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Uyarı", "Şifreler uyuşmuyor");
    }
    if (newPassword.length < 6) {
      return Alert.alert("Uyarı", "Şifre en az 6 karakter olmalı");
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi");
        navigation.navigate("LoginPage" as never);
      } else {
        Alert.alert("Hata", data.message || "Şifre güncellenemedi");
      }
    } catch (error) {
      console.error("reset error", error);
      Alert.alert("Sunucu hatası", "İstek gönderilemedi");
    }
  };

  return (
    <SafeAreaView className={`flex-1 p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text className={`text-xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Yeni Şifre Belirle</Text>
      <ReusableTextInput
        label="Yeni Şifre"
        placeholder="Yeni şifrenizi girin"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <ReusableTextInput
        label="Şifreyi Onayla"
        placeholder="Şifreyi tekrar girin"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        className="bg-orange-500 py-3 rounded-lg items-center"
        onPress={handleResetPassword}
      >
        <Text className="text-white font-bold">Şifreyi Güncelle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResetPassword;
