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

type RegisterPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "RegisterPage">;
};

const RegisterPage = ({ navigation }: RegisterPageProp) => {
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !phoneNumber) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phone: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Kayıt başarılı");
        navigation.navigate("LoginPage");
      } else {
        Alert.alert("Hata", data.message || "Kayıt başarısız");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucu hatası");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        <Text className="text-center text-2xl font-bold mt-6 mb-1 text-gray-800">
          Email ile kaydolun
        </Text>
        <Text className="text-center text-gray-500 mb-6 text-base">
          Girdiğiniz bilgilerin doğruluğundan emin olun.
        </Text>

        
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className="flex-1 py-3 rounded-l-xl bg-white border border-orange-500"
            onPress={() => navigation.navigate("LoginPage" as never)}
          >
            <Text className="text-orange-500 text-center font-bold">Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 py-3 rounded-r-xl bg-orange-500">
            <Text className="text-white text-center font-bold">Üye OL</Text>
          </TouchableOpacity>
        </View>

        
        <ReusableTextInput
          label="Email"
          placeholder="Emailinizi yazın"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ReusableTextInput
          label="Telefon Numarası"
          placeholder="+90 548 321 12 12"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <ReusableTextInput
          label="Şifre"
          placeholder="Şifrenizi yazın"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ReusableTextInput
          label="Şifreyi Tekrarla"
          placeholder="Şifrenizi tekrar yazınız"
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
              agree ? "bg-orange-500 border-orange-500" : "border-gray-400"
            }`}
          />
          <Text className="text-xs text-gray-500 flex-1 leading-5">
            Hesabınızı oluşturarak{" "}
            <Text className="text-orange-500 font-semibold">Şartlar</Text> ve{" "}
            <Text className="text-orange-500 font-semibold">Koşulları</Text> kabul etmiş olursunuz.
          </Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-orange-500 py-4 rounded-xl shadow-md active:bg-orange-600"
        >
          <Text className="text-white font-bold text-center text-lg">Üye OL</Text>
        </TouchableOpacity>

        
        <Text className="text-center mt-6 text-sm text-gray-600">
          Üyeliğiniz var mı?{" "}
          <Text
            className="text-orange-500 font-semibold"
            onPress={() => navigation.navigate("LoginPage" as never)}
          >
            Giriş Yap
          </Text>
        </Text>

        <Text className="text-center text-xs text-gray-400 mt-6 leading-4">
          Hizmetlerimizi kullanarak şunları kabul etmiş olursunuz:{" "}
          <Text className="text-orange-500 font-semibold">Şartlar</Text> ve{" "}
          <Text className="text-orange-500 font-semibold">Gizlilik Politikası</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterPage;
