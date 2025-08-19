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
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import BackButtons from "../../../assets/BackButtons/backButtons.svg";
import BackButton from "../../../Components/BackButton/BackButton";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { ENV } from "../../../utils/env";
const Otp = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
  const route = useRoute();
  const { email } = route.params as { email: string };
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { isDark } = useTheme();
  const { t } = useTranslation('auth');  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleOtp = async () => {
    const otpCode = otp.join("");

    if (!otpCode) {
      Alert.alert(t('warning'), t('pleaseEnterCode'));
      return;
    }

    if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      Alert.alert(t('warning'), t('codeFormatError'));
      return;
    }

    try {
      const response = await fetch(`${ENV.API_BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t('loginSuccess'), t('codeVerified'));
        navigation.navigate("ResetPasswordPage", { email });
      } else {
        Alert.alert(t('error'), data.message || t('codeVerificationFailed'));
      }
    } catch (err) {
      console.error("OTP doğrulama hatası:", err);
      Alert.alert(t('error'), t('connectionError'));
    }
  };

  const resendOtp = async () => {
    try {
      await fetch(`${ENV.API_BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      Alert.alert(t('resendSuccess'), t('codeSentAgain'));
    } catch {
      Alert.alert(t('error'), t('codeResendFailed'));
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} px-6`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center"
      >
<BackButtons onPress={() => navigation.goBack()} />
        <Text className={`text-center text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>{t('otpTitle')}</Text>
        <Text className={`text-center text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('otpDescription')}
        </Text>
        <Text className="text-center text-orange-500 font-semibold mb-6">
        <BackButton onPress={() => navigation.goBack()} />
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
              className={`w-12 h-12 border rounded-xl text-center text-lg ${
                isDark 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-black'
              }`}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            />
          ))}
        </View>

        <TouchableOpacity onPress={resendOtp} className="mb-6">
          <Text className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('didntReceiveCode')}{' '}
            <Text className="text-orange-500 font-semibold">{t('resendCodeText')}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOtp}
          className="bg-orange-500 py-3 rounded-xl mx-10"
          style={styles.shadowButton}
        >
          <Text className="text-white font-semibold text-center text-base">
            {t('continue')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Otp;
