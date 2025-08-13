import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
interface ReservationSummaryProps {
  carInfo: {
    model: string;
    pickup: string;
    dropoff: string;
    pickupDate: string;
    dropoffDate: string;
    pickupTime?: string;
    dropoffTime?: string;
    price: number;
    kdv: number;
    total: number;
    totalDays?: number;
  };
  extraDriver?: boolean;
  extraDriverPrice?: string;
  insurance?: boolean;
  insurancePrice?: string;
  totalPrice?: string;
  userEmail?: string; 
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ 
  carInfo, 
  extraDriver, 
  extraDriverPrice,
  insurance,
  insurancePrice,
  totalPrice,
  userEmail
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('payment');
  return (
    <View style={{ 
      padding: 16, 
      backgroundColor: isDark ? "#1F2937" : "#f9f9f9", 
      marginBottom: 16, 
      borderRadius: 8 
    }}>
      <Text style={{ 
        fontWeight: "bold", 
        fontSize: 18, 
        marginBottom: 8, 
        color: isDark ? "#FFFFFF" : "#000000" 
      }}>{t("reservationSummary")}</Text>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>{t("car")}: {carInfo.model}</Text>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>{t("duration")}: {carInfo.pickupDate} / {carInfo.dropoffDate}</Text>
        {carInfo.totalDays && (
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#10B981" : "#059669",
            fontWeight: "600"
          }}>{t("rentalPeriod")}: {carInfo.totalDays} {t("days")}</Text>
        )}
        {carInfo.pickupTime && carInfo.dropoffTime && (
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#D1D5DB" : "#000000" 
          }}>{t("time")}: {carInfo.pickupTime} - {carInfo.dropoffTime}</Text>
        )}
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>{t("pickupLocation")}: {carInfo.pickup}</Text>
        <Text style={{
          marginBottom: 4,
          color: isDark ? "#D1D5DB" : "#000000"
        }}>{t("dropoffLocation")}: {carInfo.dropoff}</Text>
        {userEmail && (
          <Text style={{
            marginBottom: 4,
            color: isDark ? "#D1D5DB" : "#000000"
          }}>{t("email")}: {userEmail}</Text>
        )}
        <View style={{
          borderTopWidth: 1,
          borderTopColor: isDark ? "#374151" : "#ddd",
          paddingTop: 8,
          marginTop: 8
        }}>
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#D1D5DB" : "#000000" 
          }}>{t("total")}: {carInfo.price} TL</Text>
          
          {extraDriver && (
            <Text style={{ 
              marginBottom: 4, 
              color: isDark ? "#D1D5DB" : "#000000" 
            }}>{t("extraDriver")}: {extraDriverPrice} TL</Text>
          )}
          
          {insurance && (
            <Text style={{ 
              marginBottom: 4, 
              color: isDark ? "#D1D5DB" : "#000000" 
            }}>Sigorta : {insurancePrice} TL</Text>
          )}
          
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#F59E0B" : "#D97706",
            fontWeight: "600" 
          }}>{t("deposit")}: {carInfo.model?.includes('BMW') ? '1800' : '2000'} TL</Text>
          
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#D1D5DB" : "#000000" 
          }}>{t("kdv")}: {carInfo.kdv} TL</Text>
          
          <Text style={{ 
            fontWeight: "bold", 
            fontSize: 16, 
            color: isDark ? "#FFFFFF" : "#000000" 
          }}>{t("total")}: {totalPrice || carInfo.total} TL</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationSummary;
