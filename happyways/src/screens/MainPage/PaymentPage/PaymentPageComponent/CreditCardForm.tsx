import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  carInfo: any | null;
  user_email?: string;
  car_id?: number;
  pickup_date?: string;
  dropoff_date?: string;
  pickup_time?: string;
  dropoff_time?: string;
  car_model?: string;
};

const CreditCardForm: React.FC<Props> = ({
  carInfo,
  user_email,
  car_id,
  pickup_date,
  dropoff_date,
  pickup_time,
  dropoff_time,
  car_model,
}) => {
  const { isDark } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<Nav>();

  const [name, setName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);


  const [resultModal, setResultModal] = useState<{
    visible: boolean;
    ok: boolean; 
    message: string;
  }>({ visible: false, ok: false, message: "" });

  const goHome = () => {
    setResultModal((s) => ({ ...s, visible: false }));

    navigation.reset({ index: 0, routes: [{ name: "HomePage" }] });
  };

  const showSuccess = (msg: string) =>
    setResultModal({ visible: true, ok: true, message: msg });

  const showError = (msg: string) =>
    setResultModal({ visible: true, ok: false, message: msg });

  const onPay = async () => {
    try {
      if (!carInfo) {
        Alert.alert("Bekleyin", "Fiyat bilgileri hazırlanıyor. Lütfen tekrar deneyin.");
        return;
      }
      if (!token) {
        Alert.alert("Giriş gerekli", "Ödeme için lütfen giriş yapın.");
        return;
      }
      if (!name || name.trim().length < 2) {
        Alert.alert("Uyarı", "Kart üzerindeki Ad Soyad bilgisini girin.");
        return;
      }

      setLoading(true);

 
      const validateRes = await fetch("http://10.0.2.2:3000/api/payment/validate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cardNo,
          expiryMonth,
          expiryYear,
          cvv,
          userEmail: user_email,
          carInfo,
        }),
      });
      const validateJson = await validateRes.json();
      if (!validateRes.ok || !validateJson?.success) {
        const errs =
          validateJson?.validation?.errors?.join("\n") ??
          validateJson?.message ??
          "Form validasyonu başarısız";
        setLoading(false);
        showError(errs);
        return;
      }

   
      const payRes = await fetch("http://10.0.2.2:3000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          cardNo,
          expiryMonth,
          expiryYear,
          cvv,
          userEmail: user_email,
          carInfo,
          car_id,
          pickup_date,
          dropoff_date,
          pickup_time,
          dropoff_time,
        }),
      });

      const payJson = await payRes.json();
      setLoading(false);

   
      if (payRes.ok && payJson?.success && payJson?.reservation?.id) {
        showSuccess("Rezervasyon başarıyla oluşturulmuştur.");
      } else {
        const msg =
          payJson?.message ||
          "İşleminizi şu anda gerçekleştiremiyoruz. Lütfen daha sonra tekrar deneyiniz.";
        showError(msg);
      }
    } catch (e: any) {
      setLoading(false);
      showError(
        e?.message ||
          "İşleminizi şu anda gerçekleştiremiyoruz. Lütfen daha sonra tekrar deneyiniz."
      );
    }
  };

  return (
    <View
      className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-4 p-4 rounded-xl`}
    >
      <Text
        className={`text-base font-semibold ${
          isDark ? "text-white" : "text-black"
        } mb-3`}
      >
        Kart Bilgileri
      </Text>

      <TextInput
        placeholder="Ad Soyad"
        placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        className={`${isDark ? "text-white" : "text-black"} border ${
          isDark ? "border-gray-700" : "border-gray-300"
        } rounded-lg px-3 py-2 mb-3`}
      />

      <TextInput
        placeholder="Kart Numarası"
        keyboardType="number-pad"
        placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
        value={cardNo}
        onChangeText={setCardNo}
        maxLength={19}
        className={`${isDark ? "text-white" : "text-black"} border ${
          isDark ? "border-gray-700" : "border-gray-300"
        } rounded-lg px-3 py-2 mb-3`}
      />

      <View className="flex-row">
        <TextInput
          placeholder="AA"
          keyboardType="number-pad"
          maxLength={2}
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={expiryMonth}
          onChangeText={setExpiryMonth}
          className={`flex-1 ${isDark ? "text-white" : "text-black"} border ${
            isDark ? "border-gray-700" : "border-gray-300"
          } rounded-lg px-3 py-2 mb-3 mr-2`}
        />
        <TextInput
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={expiryYear}
          onChangeText={setExpiryYear}
          className={`flex-1 ${isDark ? "text-white" : "text-black"} border ${
            isDark ? "border-gray-700" : "border-gray-300"
          } rounded-lg px-3 py-2 mb-3`}
        />
      </View>

      <TextInput
        placeholder="CVV"
        keyboardType="number-pad"
        maxLength={4}
        placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
        value={cvv}
        onChangeText={setCvv}
        className={`${isDark ? "text-white" : "text-black"} border ${
          isDark ? "border-gray-700" : "border-gray-300"
        } rounded-lg px-3 py-2 mb-4`}
      />

      <TouchableOpacity
        onPress={onPay}
        disabled={loading}
        className={`rounded-lg py-3 items-center ${
          loading ? "bg-blue-400" : "bg-blue-600"
        }`}
      >
        {loading ? <ActivityIndicator /> : <Text className="text-white font-semibold">Öde</Text>}
      </TouchableOpacity>

      
      <Modal transparent visible={resultModal.visible} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className={`${isDark ? "bg-white" : "bg-white"} w-full rounded-2xl p-5`}>
            <View className="items-center mb-3">
              {/* Daire + icon */}
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: resultModal.ok ? "#22c55e" : "#ef4444", 
                }}
              >
                <Text
                  style={{
                    fontSize: 34,
                    lineHeight: 34,
                    color: resultModal.ok ? "#22c55e" : "#ef4444",
                  }}
                >
                  {resultModal.ok ? "✓" : "✕"}
                </Text>
              </View>
            </View>

            <Text className="text-center text-sm font-semibold mb-2">
              {resultModal.ok ? "Ödemeniz Başarı ile Alındı" : "İşlem başarısız"}
            </Text>
            <Text className="text-center text-xs mb-4">
              {resultModal.message}
            </Text>

            <TouchableOpacity
              onPress={goHome}
              className="mt-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: "#2563eb" }}
            >
              <Text className="text-white font-semibold uppercase">TAMAM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreditCardForm;
