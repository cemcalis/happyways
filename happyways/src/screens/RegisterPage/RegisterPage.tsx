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
import { FormValidator, CommonValidationRules, hasError, getError } from "../../../utils/formValidation";
import { apiRequest, handleApiError, showErrorAlert } from "../../../utils/errorHandling";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

type RegisterPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "RegisterPage">;
};

const RegisterPage = ({ navigation }: RegisterPageProp) => {
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
      validationErrors.agree = 'Kullanım koşullarını kabul etmelisiniz';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      Alert.alert('Hata', firstError || 'Eksik veya hatalı bilgi girdiniz.');
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await apiRequest("http://10.0.2.2:3000/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password, phone: phoneNumber })
      });
      Alert.alert("Kayıt Başarılı! ", "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.", [
        {
          text: "Giriş Yap",
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
    return <LoadingSpinner text="Hesap oluşturuluyor..." />;
  }

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

          <TouchableOpacity className="flex-1 py-3 rounded-r-xl bg-orange-500" onPress={handleRegister}>
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
