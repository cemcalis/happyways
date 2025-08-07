import React from "react";
import { View, Text } from "react-native";

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
  return (
    <View style={{ padding: 16, backgroundColor: "#f9f9f9", marginBottom: 16, borderRadius: 8 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Rezervasyon Özeti</Text>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4 }}>Araç : {carInfo.model}</Text>
        <Text style={{ marginBottom: 4 }}>Süre : {carInfo.pickupDate} / {carInfo.dropoffDate}</Text>
        <Text style={{ marginBottom: 4 }}>Teslim Alış : {carInfo.pickup}</Text>
        <Text style={{ marginBottom: 4 }}>Teslim Ediliş : {carInfo.dropoff}</Text>
        <View style={{ borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 8, marginTop: 8 }}>
          <Text style={{ marginBottom: 4 }}>Tutar : {carInfo.price}TL</Text>
          <Text style={{ marginBottom: 4 }}>KDV : {carInfo.kdv}TL</Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Toplam : {carInfo.total}TL</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationSummary;
