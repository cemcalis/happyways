import BackButton from "../../../Components/BackButton/BackButton";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import  ReusableTextInput  from "../../../Components/ReusableTextInput/ReusableTextInput";
import { useAuth } from "../../../contexts/AuthContext";
import { FormValidator, CommonValidationRules, hasError, getError } from "../../../utils/formValidation";
import { apiRequest, handleApiError, showErrorAlert } from "../../../utils/errorHandling";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { ENV } from "../../../utils/env";
type LoginPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LoginPage">;
};

const LoginPage = ({ navigation }: LoginPageProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { login } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation('auth');
  
  const validator = new FormValidator({
    email: CommonValidationRules.email,
    password: [
      { required: true, message: t('passwordRequired') },
      { minLength: 6, message: t('passwordTooShort') }
    ]
  });

  const handleLogin = async () => {
    const formData = { email, password };
    const validationErrors = validator.validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await apiRequest(`${ENV.API_BASE_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      if (data.accessToken && data.refreshToken) {
        await login(data.accessToken, data.refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        Alert.alert(t('loginSuccess'), t('loginSuccessMessage'));
        navigation.navigate("HomePage");
      }
    } catch (error) {
      showErrorAlert(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('loggingIn')} />;
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      <ScrollView className="flex-1 px-6">
        
        <View className="items-center mt-12 mb-8">
          <View 
            className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mb-4"
            style={styles.shadowContainer}
          >
            <Text className="text-white text-3xl font-bold">HW</Text>
          </View>
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>{t('welcome')}</Text>
          <Text className={`text-center text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('loginDescription')}
          </Text>
        </View>

        
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity 
            className="flex-1 py-3 rounded-l-xl bg-orange-500"
            disabled={true}
          >
            <Text className="text-white text-center font-bold">{t('loginButton')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-r-xl border border-orange-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            onPress={() => navigation.navigate("RegisterPage" as never)}
          >
            <Text className="text-orange-500 text-center font-bold">{t('memberRegister')}</Text>
          </TouchableOpacity>
        </View>

        
        <View className="space-y-6">
        
          <View>
            <ReusableTextInput
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (hasError(errors, 'email')) {
                  const newErrors = {...errors};
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={hasError(errors, 'email')}
              errorMessage={getError(errors, 'email')}
            />

            <ReusableTextInput
              label={t('passwordLabel')}
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (hasError(errors, 'password')) {
                  const newErrors = {...errors};
                  delete newErrors.password;
                  setErrors(newErrors);
                }
              }}
              secureTextEntry
              error={hasError(errors, 'password')}
              errorMessage={getError(errors, 'password')}
            />
          </View>

   
          <TouchableOpacity
            className="self-end"
            onPress={() => navigation.navigate("ForgetPasswordPage", { email })}
          >
            <Text className={`font-semibold text-base ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
              {t('forgotPasswordText')}
            </Text>
          </TouchableOpacity>

      
          <TouchableOpacity 
            className="bg-orange-500 py-4 rounded-xl active:bg-orange-600 mt-6"
            onPress={handleLogin}
            style={styles.shadowButton}
          >
            <Text className="text-white font-bold text-center text-lg">
              {t('loginButton')}
            </Text>
          </TouchableOpacity>

        
          <View className="items-center mt-8 mb-6">
            <View className="flex-row">
              <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('noAccount')}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterPage" as never)}>
                <Text className={`font-bold text-base ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                  {t('registerNow')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default LoginPage;
