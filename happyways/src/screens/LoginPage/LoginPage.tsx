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
type LoginPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LoginPage">;
};

const LoginPage = ({ navigation }: LoginPageProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Hata", data.message || "Giriş başarısız.");
        return;
      }

      await login (data.token);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Alert.alert("Başarılı", "Giriş yapıldı.");
      navigation.navigate("HomePage");
    } catch (error) {
      Alert.alert("Hata", "Sunucuya ulaşılamadı.");
    }
  };

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
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
  />

  <ReusableTextInput
    label="Şifreniz"
    placeholder="••••••••"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
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
            <Text className="text-gray-600 text-base">
              Üyeliğiniz yok mu?{" "}
              <Text
                className="text-orange-500 font-bold"
                onPress={() => navigation.navigate("RegisterPage" as never)}
              >
                Şimdi Kaydolun
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;
