import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface ReservationSummaryProps {
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
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ carInfo }) => {
  const { isDark } = useTheme();
  
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
      }}>Rezervasyon Özeti</Text>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>Araç : {carInfo.model}</Text>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>Süre : {carInfo.pickupDate} / {carInfo.dropoffDate}</Text>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>Teslim Alış : {carInfo.pickup}</Text>
        <Text style={{ 
          marginBottom: 4, 
          color: isDark ? "#D1D5DB" : "#000000" 
        }}>Teslim Ediliş : {carInfo.dropoff}</Text>
        <View style={{ 
          borderTopWidth: 1, 
          borderTopColor: isDark ? "#374151" : "#ddd", 
          paddingTop: 8, 
          marginTop: 8 
        }}>
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#D1D5DB" : "#000000" 
          }}>Tutar : {carInfo.price}TL</Text>
          <Text style={{ 
            marginBottom: 4, 
            color: isDark ? "#D1D5DB" : "#000000" 
          }}>KDV : {carInfo.kdv}TL</Text>
          <Text style={{ 
            fontWeight: "bold", 
            fontSize: 16, 
            color: isDark ? "#FFFFFF" : "#000000" 
          }}>Toplam : {carInfo.total}TL</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationSummary;
