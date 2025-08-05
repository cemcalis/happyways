import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../types";


import HomeSvg from "../../../../../assets/HomePage/home.svg";
import CarSvg from "../../../../../assets/HomePage/car.svg";
import CampaignSvg from "../../../../../assets/HomePage/campaign.svg";
import ReservationSvg from "../../../../../assets/HomePage/search.svg";
import UserSvg from "../../../../../assets/HomePage/user.svg";
import FilterSvg from "../../../../../assets/HomePage/filter.svg";
import SortSvg from "../../../../../assets/HomePage/sort.svg";
import LeftArrowSvg from "../../../../../assets/HomePage/leftarrow.svg";

type ReservationPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReservationPage">;
};

type Reservation = {
  id: number;
  pickup: string;
  dropoff: string;
  date: string;
};

const tabItems = [
  { icon: <HomeSvg width={20} height={20} />, label: "Anasayfa", route: "HomePage" },
  { icon: <CarSvg width={20} height={20} />, label: "Araçlar", route: "AllCarsPage" },
  { icon: <ReservationSvg width={20} height={20} />, label: "Rezervasyon", route: "ReservationPage" },
  { icon: <CampaignSvg width={20} height={20} />, label: "Kampanyalar", route: "CampaignPage" },
  { icon: <UserSvg width={20} height={20} />, label: "Hesabım", route: "ProfilePage" },
];

const ReservationListPage = ({ navigation }: ReservationPageProp) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const dummyData: Reservation[] = [
    { id: 1, pickup: "Ercan", dropoff: "Lefkoşa", date: "Paz, 17 Nis, 14:00" },
    { id: 2, pickup: "Ercan", dropoff: "Lefkoşa", date: "Paz, 24 Nis, 14:00" },
    { id: 3, pickup: "Lefkoşa", dropoff: "Ercan", date: "Pzt, 30 Nis, 10:00" },
  ];

  useEffect(() => {
    setReservations(dummyData);
  }, []);

  const handleSort = (type: string) => {
    let sorted = [...reservations];
    if (type === "new") sorted.sort((a, b) => b.id - a.id);
    else if (type === "old") sorted.sort((a, b) => a.id - b.id);
    setReservations(sorted);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View className="flex-row justify-between items-center bg-white px-5 py-4 mb-3 rounded-lg border border-gray-200 shadow-sm">
      <View className="flex-1">
        <Text className="text-base font-semibold text-black">{item.pickup}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.date}</Text>
      </View>
      <Text className="text-orange-500 text-xl px-2">⟶</Text>
      <Text className="text-base font-semibold text-black">{item.dropoff}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">

      <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowSvg width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Rezervasyonlar</Text>
        <View className="w-5" /> 
      </View>

      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity className="flex-row items-center">
          <FilterSvg width={18} height={18} />
          <Text className="ml-2 text-sm text-black">Filtre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <SortSvg width={20} height={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-lg p-4 w-56 shadow-lg">
            <TouchableOpacity onPress={() => handleSort("new")}>
              <Text className="py-2 text-black">Güncel Rezervasyonlar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort("old")}>
              <Text className="py-2 text-black">Eski Rezervasyonlar</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="py-2 text-black">Fiyat Yüksek</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="py-2 text-black">Fiyat Düşük</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View className="flex-row bg-white border-t border-gray-200 py-2">
        {tabItems.map(({ icon, label, route }, i) => (
          <TouchableOpacity
            key={i}
            className="flex-1 items-center"
            onPress={() => navigation.navigate(route as any)}
          >
            <View className="mb-1">{icon}</View>
            <Text className="text-xs text-black">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ReservationListPage;
