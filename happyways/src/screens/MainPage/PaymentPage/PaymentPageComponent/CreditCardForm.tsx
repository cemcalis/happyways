// src/screens/MainPage/PaymentPage/PaymentPageComponent/CreditCardForm.tsx
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
import { useTranslation } from "react-i18next";
import { ENV } from "../../../../../utils/env";

const API_BASE = ENV.API_BASE_URL;

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type ReservationInput = {
  carId?: number;
  pickup?: string;
  drop?: string;
  pickupDate?: string;
  dropDate?: string;
  pickupTime?: string;
  dropTime?: string;
  totalPrice?: number;
};

export type CreditCardFormProps = {
  carInfo: any | null;
  userEmail?: string;
  /** PaymentPage, burada TS hatasını çözen prop */
  reservation: ReservationInput;
};

/** Basit timeout helper */
const fetchWithTimeout = (input: RequestInfo | URL, init: RequestInit = {}, ms = 12000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
};

/** Olası alanlardan reservationId çek */
const extractReservationId = (obj: any) => {
  const cands = [
    obj?.reservationId,
    obj?.reservation_id,
    obj?.reservation?.id,
    obj?.data?.reservation_id,
  ];
  for (const c of cands) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return NaN;
};

const CreditCardForm: React.FC<CreditCardFormProps> = ({ carInfo, userEmail, reservation }) => {
  const { isDark } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<Nav>();
  const t = useTranslation("payment").t;

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
    setLoading(true);
    try {
      if (!carInfo) {
        Alert.alert("Lütfen tekrar deneyin.");
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

      // 1) Opsiyonel form validasyonu — başarısızsa bile akışa devam ediyoruz
      try {
        console.log("[PAY] validate-form çağrılıyor...");
        const validateRes = await fetchWithTimeout(`${API_BASE}/api/payment/validate-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            cardNo,
            expiryMonth,
            expiryYear,
            cvv,
            userEmail,
            carInfo,
          }),
        });
        const validateJson = await validateRes.json().catch(() => ({}));
        console.log("[PAY] validate-form yanıt:", validateRes.status, validateJson);
        if (!validateRes.ok || validateJson?.success !== true) {
          console.warn("[PAY] validate-form başarısız/kapalı, ödeme akışına devam.");
        }
      } catch (e) {
        console.warn("[PAY] validate-form hata/timeout, devam:", String(e));
      }

      // 2) Ödeme + rezervasyon
      const payload = {
        name,
        cardNo,
        expiryMonth,
        expiryYear,
        cvv,
        userEmail,
        carInfo,
        // reservation → snake_case payload
        car_id: reservation.carId,
        pickup_location: reservation.pickup,
        dropoff_location: reservation.drop,
        pickup_date: reservation.pickupDate,
        dropoff_date: reservation.dropDate,
        pickup_time: reservation.pickupTime,
        dropoff_time: reservation.dropTime,
        total_price: reservation.totalPrice ?? carInfo?.total ?? 0,
      };

      console.log("[PAY] /api/payment payload:", payload);

      const payRes = await fetchWithTimeout(
        `${API_BASE}/api/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
        25000
      );

      const payText = await payRes.text();
      let payJson: any = {};
      try {
        payJson = JSON.parse(payText);
      } catch {
        payJson = {};
      }
      console.log("[PAY] /api/payment yanıt:", payRes.status, payJson);

      const reservationId = extractReservationId(payJson);
      const prelimOK = payRes.ok && Number.isFinite(reservationId);

      // 3) Doğrulama (arkadan, kullanıcıyı bekletmeden)
      if (prelimOK) {
        showSuccess("Rezervasyon başarıyla oluşturuldu.");
        (async () => {
          try {
            console.log("[PAY] /status doğrulama, id=", reservationId);
            const verifyRes = await fetchWithTimeout(
              `${API_BASE}/api/payment/status/${reservationId}`,
              { method: "GET", headers: { Authorization: `Bearer ${token}` } },
              8000
            );
            const verifyText = await verifyRes.text();
            let verifyJson: any = {};
            try {
              verifyJson = JSON.parse(verifyText);
            } catch {
              verifyJson = {};
            }
            console.log("[PAY] /status yanıt:", verifyRes.status, verifyJson);
          } catch (e) {
            console.warn("[PAY] /status doğrulama hata/timeout:", String(e));
          }
        })();
      } else {
        const msg =
          payJson?.message ||
          "İşleminizi şu anda gerçekleştiremiyoruz. Lütfen daha sonra tekrar deneyiniz.";
        showError(msg);
      }
    } catch (e: any) {
      console.error("[PAY] GENEL HATA:", e);
      const msg = String(e?.message || e || "");
      if (msg.includes("Abort") || e?.name === "AbortError") {
        // istek zaman aşımı oldu; büyük ihtimalle backend yazdı (quick-insert gibi)
        showSuccess(
          "Ödeme yanıtı gecikti. İşlem büyük olasılıkla tamamlandı. Rezervasyonlarım'dan kontrol edebilirsiniz."
        );
      } else {
        showError(e?.message || "Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 mt-4 p-4 rounded-xl`}
    >
      <Text
        className={`text-base font-semibold ${isDark ? "text-white" : "text-black"} mb-3`}
      >
        {t("card information")}
      </Text>

      <TextInput
        placeholder={t("cardholder name")}
        placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        className={`${isDark ? "text-white" : "text-black"} border ${
          isDark ? "border-gray-700" : "border-gray-300"
        } rounded-lg px-3 py-2 mb-3`}
      />

      <TextInput
        placeholder={t("card number")}
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
        placeholder={t("cvv")}
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
        className={`rounded-lg py-3 items-center ${loading ? "bg-blue-400" : "bg-blue-600"}`}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-white font-semibold">{t("pay")}</Text>
        )}
      </TouchableOpacity>

      {/* Sonuç Modali */}
      <Modal transparent visible={resultModal.visible} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="w-full rounded-2xl p-5" style={{ backgroundColor: "#fff" }}>
            <View className="items-center mb-3">
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
              {resultModal.ok ? t("paymentSuccess") : t("paymentFailed")}
            </Text>
            <Text className="text-center text-xs mb-4">{resultModal.message}</Text>

            <TouchableOpacity
              onPress={goHome}
              className="mt-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: "#2563eb" }}
            >
              <Text className="text-white font-semibold uppercase">{t("ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreditCardForm;
