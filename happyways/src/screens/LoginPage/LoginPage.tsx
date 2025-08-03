import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import  ReusableTextInput  from "../../../Components/ReusableTextInput/ReusableTextInput";
import { useAuth } from "../../../context/AuthContext";
import { FormValidator, CommonValidationRules, hasError, getError } from "../../../utils/formValidation";
import { apiRequest, handleApiError, showErrorAlert } from "../../../utils/errorHandling";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
type LoginPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LoginPage">;
};

const LoginPage = ({ navigation }: LoginPageProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const {login} = useAuth();

  // Form validation rules
  const validator = new FormValidator({
    email: CommonValidationRules.email,
    password: [
      { required: true, message: 'Şifre gerekli' },
      { minLength: 6, message: 'Şifre en az 6 karakter olmalı' }
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
      const data = await apiRequest("http://10.0.2.2:3000/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (data.accessToken && data.refreshToken) {
        // Yeni token sistemi ile login
        await login(data.accessToken, data.refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        
        Alert.alert("Başarılı", "Giriş yapıldı.", [
          { text: "Tamam", onPress: () => navigation.navigate("HomePage") }
        ]);
      } else {
        Alert.alert("Hata", "Giriş bilgileri alınamadı");
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      showErrorAlert(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Giriş yapılıyor..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <ScrollView className="flex-1 px-6">
        
        <View className="items-center mt-12 mb-8">
          <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-white text-3xl font-bold">HW</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Hoş Geldiniz</Text>
          <Text className="text-gray-500 text-center text-base">
            HappyWays hesabınıza giriş yapın
          </Text>
        </View>

        
        <View className="flex-row bg-gray-100 rounded-xl p-1 mb-8 mx-4">
          <TouchableOpacity className="flex-1 bg-orange-500 py-3 rounded-lg shadow-sm">
            <Text className="text-white font-bold text-center text-base">Giriş</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-lg"
            onPress={() => navigation.navigate("RegisterPage" as never)}
          >
            <Text className="text-orange-500 font-bold text-center text-base">Üye Ol</Text>
          </TouchableOpacity>
        </View>

        
        <View className="space-y-6">
        
          <View>
            <ReusableTextInput
              label="Email Adresiniz"
              placeholder="ornek@email.com"
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
              label="Şifreniz"
              placeholder="••••••••"
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
            <Text className="text-orange-500 font-semibold text-base">
              Şifrenizi mi unuttunuz?
            </Text>
          </TouchableOpacity>

      
          <TouchableOpacity 
            className="bg-orange-500 py-4 rounded-xl shadow-lg active:bg-orange-600 mt-6"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-center text-lg">
              Giriş Yap
            </Text>
          </TouchableOpacity>

        
          <View className="items-center mt-8 mb-6">
            <View className="flex-row">
              <Text className="text-gray-600 text-base">
                Üyeliğiniz yok mu?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterPage" as never)}>
                <Text className="text-orange-500 font-bold text-base">
                  Şimdi Kaydolun
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;
