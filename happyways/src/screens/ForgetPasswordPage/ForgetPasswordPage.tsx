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
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

type ForgetPasswordPageProp = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ForgetPasswordPage"
  >;
};

const ForgetPasswordPage = ({ navigation }: ForgetPasswordPageProp) => {
  const [email, setEmail] = useState("");
  const { isDark } = useTheme();
  const { t } = useTranslation('auth');

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert(t('error'), t('emailCannotBeEmpty'));
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
        Alert.alert(t('loginSuccess'), data.message || t('codeSent'));
        navigation.navigate("OtpPage", { email });
      } else {
        Alert.alert(t('error'), data.message || t('operationFailed'));
      }
    } catch (error) {
      console.error("Kodu gönderme hatası:", error);
      Alert.alert(t('error'), t('connectionError'));
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1">
        <BackButton onPress={() => navigation.goBack()} />

  
        <View className="px-6">
          <Text className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('forgotPasswordTitle')}
          </Text>

          
         <ReusableTextInput
  label={t('email')}
  placeholder={t('emailPlaceholder')}
  placeholderTextColor="#9CA3AF"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

          <TouchableOpacity 
            className="bg-orange-500 py-4 rounded-xl active:bg-orange-600 mt-4"
            onPress={handleSubmit}
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Text className="text-white font-bold text-center text-lg">
              {t('send')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPasswordPage;
