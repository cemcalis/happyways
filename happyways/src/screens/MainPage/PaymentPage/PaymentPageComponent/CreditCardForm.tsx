import React, { useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import CheckBox from 'react-native-check-box';
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

interface CreditCardFormProps {
  carInfo: {
    model: string;
    pickup: string;
    dropoff: string;
    pickupDate: string;
    dropoffDate: string;
    price: number;
    kdv: number;
    total: number;
  };
  userEmail: string;
  onSuccess: () => void;
  // Rezervasyon bilgileri
  carId: number;
  carModel: string | undefined;
  carPrice: string | undefined;
  pickupDate: string | undefined;
  dropDate: string | undefined;
  pickupTime: string | undefined;
  dropTime: string | undefined;
  pickup: string | undefined;
  drop: string | undefined;
  extraDriver: boolean;
  extraDriverPrice: string;
  insurance: boolean;
  insurancePrice: string;
  totalPrice: string;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ 
  carInfo, 
  userEmail, 
  onSuccess,
  // Rezervasyon bilgileri
  carId,
  carModel,
  carPrice,
  pickupDate,
  dropDate,
  pickupTime,
  dropTime,
  pickup,
  drop,
  extraDriver,
  extraDriverPrice,
  insurance,
  insurancePrice,
  totalPrice
}) => {
  const [name, setName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [secure, setSecure] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [smsChecked, setSmsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const { t } = useTranslation('payment');

  const handlePayment = async () => {
    setLoading(true);
    try {
  const token = await SecureStore.getItemAsync('userToken');
      console.log('DEBUG carInfo gönderilen:', carInfo);
      const validationResponse = await fetch("http://10.0.2.2:3000/api/payment/validate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name,
          cardNo,
          expiryMonth,
          expiryYear,
          cvv,
          carInfo,
          userEmail,
          secure,
          emailChecked,
          smsChecked,
        }),
      });

      const validationData = await validationResponse.json();

      if (!validationData.success) {
        Alert.alert(
          "Form Hatası",
          validationData.validation.errors.join("\n"),
          [{ text: "TAMAM" }]
        );
        setLoading(false);
        return;
      }

      if (validationData.validation.warnings.length > 0) {
        Alert.alert(
          "Uyarı",
          validationData.validation.warnings.join("\n") + "\n\nDevam etmek istiyor musunuz?",
          [
            { text: "İptal", style: "cancel", onPress: () => setLoading(false) },
            { text: "Devam Et", onPress: () => processPayment(token ?? undefined) }
          ]
        );
        return;
      }

      await processPayment(token ?? undefined);

    } catch (err) {
      console.error("Validasyon hatası:", err);
      Alert.alert("Validasyon Hatası", "Form doğrulaması yapılamadı. Lütfen tekrar deneyiniz.", [{ text: "TAMAM" }]);
      setLoading(false);
    }
  };

  const processPayment = async (token?: string) => {
    try {
      const res = await fetch("http://10.0.2.2:3000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name,
          cardNo,
          expiryMonth,
          expiryYear,
          cvv,
          carInfo,
          userEmail,
          secure,
          emailChecked,
          smsChecked,
          // Rezervasyon bilgileri
          carId,
          carModel,
          carPrice,
          pickupDate,
          dropDate,
          pickupTime,
          dropTime,
          pickup,
          drop,
          extraDriver,
          extraDriverPrice,
          insurance,
          insurancePrice,
          totalPrice
        }),
      });

      const data = await res.json();
      Alert.alert(data.message || (data.success ? "Ödemeniz Başarılı" : "İşlem başarısız"), "", [
        { text: "TAMAM", onPress: data.success ? onSuccess : undefined }
      ]);
    } catch (err) {
      Alert.alert("Sunucuya ulaşılamıyor.", "Lütfen daha sonra tekrar deneyiniz.", [{ text: "TAMAM" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ 
        fontWeight: "bold", 
        fontSize: 16, 
        marginBottom: 8, 
        color: isDark ? "#FFFFFF" : "#000000" 
      }}>Kredi Kartı Bilgileri</Text>
      <TextInput 
        placeholder="Ad Soyad" 
        value={name} 
        onChangeText={setName} 
        style={{ 
          borderWidth: 1, 
          marginBottom: 8, 
          padding: 8,
          borderColor: isDark ? "#374151" : "#D1D5DB",
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          color: isDark ? "#FFFFFF" : "#000000"
        }}
        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
      />
      <TextInput 
        placeholder="Kart No" 
        value={cardNo} 
        onChangeText={setCardNo} 
        style={{ 
          borderWidth: 1, 
          marginBottom: 8, 
          padding: 8,
          borderColor: isDark ? "#374151" : "#D1D5DB",
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          color: isDark ? "#FFFFFF" : "#000000"
        }} 
        keyboardType="numeric"
        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
      />
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TextInput 
          placeholder="Ay" 
          value={expiryMonth} 
          onChangeText={setExpiryMonth} 
          style={{ 
            borderWidth: 1, 
            flex: 1, 
            marginRight: 4, 
            padding: 8,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000"
          }} 
          keyboardType="numeric"
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
        />
        <TextInput 
          placeholder="Yıl" 
          value={expiryYear} 
          onChangeText={setExpiryYear} 
          style={{ 
            borderWidth: 1, 
            flex: 1, 
            marginLeft: 4, 
            padding: 8,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000"
          }} 
          keyboardType="numeric"
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
        />
        <TextInput 
          placeholder="CVV" 
          value={cvv} 
          onChangeText={setCvv} 
          style={{ 
            borderWidth: 1, 
            flex: 1, 
            marginLeft: 4, 
            padding: 8,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000"
          }} 
          keyboardType="numeric"
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <CheckBox
          isChecked={secure}
          onClick={() => setSecure(!secure)}
          checkBoxColor="orange"
        />
        <Text style={{ 
          marginLeft: 8, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>3D Secure ile ödemek istiyorum</Text>
      </View>
  
      <Text style={{ 
        fontWeight: "bold", 
        fontSize: 16, 
        marginBottom: 8, 
        color: isDark ? "#FFFFFF" : "#000000" 
      }}>İletişim Tercihiniz</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <CheckBox
          isChecked={emailChecked}
          onClick={() => setEmailChecked(!emailChecked)}
          checkBoxColor="orange"
        />
        <Text style={{ 
          marginLeft: 8, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>E-Posta</Text>
        <CheckBox
          isChecked={smsChecked}
          onClick={() => setSmsChecked(!smsChecked)}
          checkBoxColor="orange"
          style={{ marginLeft: 16 }}
        />
        <Text style={{ 
          marginLeft: 8, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>SMS</Text>
      </View>
      <TouchableOpacity onPress={handlePayment} style={{ backgroundColor: "orange", padding: 12, borderRadius: 8, alignItems: "center" }} disabled={loading}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Öde</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreditCardForm;
