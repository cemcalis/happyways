import BackButton from "../../../Components/BackButton/BackButton";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import ReusableTextInput from "../../../Components/ReusableTextInput/ReusableTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { FormValidator, CommonValidationRules, hasError, getError } from "../../../utils/formValidation";
import { apiRequest, handleApiError, showErrorAlert } from "../../../utils/errorHandling";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { useTranslation } from "react-i18next";

type RegisterPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "RegisterPage">;
};

const RegisterPage = ({ navigation }: RegisterPageProp) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('auth');
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validator = new FormValidator({
    email: CommonValidationRules.email,
    phoneNumber: CommonValidationRules.phone,
    password: CommonValidationRules.password,
    confirmPassword: CommonValidationRules.confirmPassword(password)
  });

  const handleRegister = async () => {
    const formData = { email, phoneNumber, password, confirmPassword };
    const validationErrors = validator.validate(formData);
    
    if (!agree) {
      validationErrors.agree = t('mustAcceptTerms');
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      Alert.alert(t('error'), firstError || t('validationError'));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await apiRequest("http://10.0.2.2:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password, phone: phoneNumber })
      });
      Alert.alert(t('registerSuccess'), t('registerSuccessMessage'), [
        {
          text: t('loginButton'),
          onPress: () => navigation.navigate("LoginPage")
        }
      ]);
    } catch (error: any) {
      const apiError = handleApiError(error);
      showErrorAlert(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('creatingAccount')} />;
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        <Text className={`text-center text-2xl font-bold mt-6 mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {t('registerWithEmail')}
        </Text>
        <Text className={`text-center mb-6 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('registerDescription')}
        </Text>

        
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-l-xl border border-orange-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            onPress={() => navigation.navigate("LoginPage" as never)}
          >
            <Text className="text-orange-500 text-center font-bold">{t('loginButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          className="flex-1 py-3 rounded-r-xl bg-orange-500"
          disabled={true}
          >
            <Text className="text-white text-center font-bold">{t('registerButton')}</Text>
          </TouchableOpacity>
        </View>

        
        <ReusableTextInput
          label={t('email')}
          placeholder={t('enterEmail')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ReusableTextInput
          label={t('phoneNumber')}
          placeholder={t('phoneNumberPlaceholder')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <ReusableTextInput
          label={t('password')}
          placeholder={t('enterPassword')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ReusableTextInput
          label={t('repeatPasswordLabel')}
          placeholder={t('repeatPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

       
        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          className="flex-row items-start mt-2 mb-4"
        >
          <View
            className={`w-5 h-5 mt-1 mr-2 rounded border ${
              agree ? "bg-orange-500 border-orange-500" : `${isDark ? 'border-gray-500' : 'border-gray-400'}`
            }`}
          />
          <Text className={`text-xs flex-1 leading-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('acceptTermsText')}{" "}
            <Text className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{t('termsAndConditions')}</Text> {t('conditions')}{" "}
            <Text className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}></Text> {t('acceptTermsEnd')}
          </Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-orange-500 py-4 rounded-xl shadow-md active:bg-orange-600"
        >
          <Text className="text-white font-bold text-center text-lg">{t('registerButton')}</Text>
        </TouchableOpacity>

        
        <Text className={`text-center mt-6 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('alreadyMember')}{" "}
          <Text
            className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}
            onPress={() => navigation.navigate("LoginPage" as never)}
          >
            {t('loginButton')}
          </Text>
        </Text>

        <Text className={`text-center text-xs mt-6 leading-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {t('termsFooterText')}{" "}
          <Text className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{t('termsAndConditions')}</Text> ve{" "}
          <Text className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{t('privacyPolicy')}</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterPage;
