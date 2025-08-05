import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import CheckBox from 'react-native-check-box';

interface PaymentFormProps {
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
}

const PaymentForm: React.FC<PaymentFormProps> = ({ carInfo, userEmail, onSuccess }) => {
  const [name, setName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [secure, setSecure] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [smsChecked, setSmsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
   
      const data = await res.json();
      Alert.alert(data.message || (data.success ? "Ödemeniz Başarılı" : "İşlem başarısız"), "", [
        { text: "TAMAM", onPress: data.success ? onSuccess : undefined }
      ]);
    } catch (err) {
      Alert.alert("Sunucuya ulaşılamıyor.", "Lütfen daha sonra tekrar deneyiniz.", [{ text: "TAMAM" }]);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Kredi Kartı Bilgileri</Text>
      <TextInput placeholder="Ad Soyad" value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 8, padding: 8 }} />
      <TextInput placeholder="Kart No" value={cardNo} onChangeText={setCardNo} style={{ borderWidth: 1, marginBottom: 8, padding: 8 }} keyboardType="numeric" />
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TextInput placeholder="Ay" value={expiryMonth} onChangeText={setExpiryMonth} style={{ borderWidth: 1, flex: 1, marginRight: 4, padding: 8 }} keyboardType="numeric" />
        <TextInput placeholder="Yıl" value={expiryYear} onChangeText={setExpiryYear} style={{ borderWidth: 1, flex: 1, marginLeft: 4, padding: 8 }} keyboardType="numeric" />
        <TextInput placeholder="CVV" value={cvv} onChangeText={setCvv} style={{ borderWidth: 1, flex: 1, marginLeft: 4, padding: 8 }} keyboardType="numeric" />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <CheckBox
          isChecked={secure}
          onClick={() => setSecure(!secure)}
          checkBoxColor="orange"
        />
        <Text style={{ marginLeft: 8 }}>3D Secure ile ödemek istiyorum</Text>
      </View>
  
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>İletişim Tercihiniz</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <CheckBox
          isChecked={emailChecked}
          onClick={() => setEmailChecked(!emailChecked)}
          checkBoxColor="orange"
        />
        <Text style={{ marginLeft: 8 }}>E-Posta</Text>
        <CheckBox
          isChecked={smsChecked}
          onClick={() => setSmsChecked(!smsChecked)}
          checkBoxColor="orange"
          style={{ marginLeft: 16 }}
        />
        <Text style={{ marginLeft: 8 }}>SMS</Text>
      </View>
      <TouchableOpacity onPress={handlePayment} style={{ backgroundColor: "orange", padding: 12, borderRadius: 8, alignItems: "center" }} disabled={loading}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Öde</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentForm;
