import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../../types";
import ReusableTextInput from "../../../../Components/ReusableTextInput/ReusableTextInput";

import DoublelocationSvg from "../../../../assets/reservation/doublelocation.svg";
import ClockSvg from "../../../../assets/reservation/clock.svg";
import DateSvg from "../../../../assets/reservation/date.svg";




type ReservationPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReservationPage">;
};

const ReservationPage = ({ navigation }: ReservationPageProps) => {
  const [ofis, setOfis] = useState("");
  const [getdate, setGetdate] = useState("");
  const [backdate, setBackDate] = useState("");
  const [gettime, setGetTime] = useState("");
  const [backtime, setBackTime] = useState("");
  const [differentDrop, setDifferentDrop] = useState(false);
  const [returnOffice, setReturnOffice] = useState("");
  const [lastSearches, setLastSearches] = useState<any[]>([]);


  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem("lastSearches");
        if (savedSearches) {
          setLastSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        console.log("Geçmiş aramalar alınamadı:", error);
      }
    };
    fetchSearches();
  }, []);


  const handleSearch = async () => {
    if (!ofis || !getdate || !backdate || !gettime || !backtime) return;

    const searchData = {
      pickup: ofis,
      drop: differentDrop ? returnOffice : ofis,
      date: `${getdate}, ${gettime} - ${backdate}, ${backtime}`,
    };

    try {
      const existingSearches = await AsyncStorage.getItem("lastSearches");
      const searches = existingSearches ? JSON.parse(existingSearches) : [];

      const updatedSearches = [
        searchData,
        ...searches.filter(
          (item: any) => JSON.stringify(item) !== JSON.stringify(searchData)
        ),
      ].slice(0, 5);

      await AsyncStorage.setItem("lastSearches", JSON.stringify(updatedSearches));
      setLastSearches(updatedSearches);
    } catch (error) {
      console.log("Arama kaydedilemedi:", error);
    }

    navigation.navigate("AllCarsPage");
  };


  const clearHistory = async () => {
    await AsyncStorage.removeItem("lastSearches");
    setLastSearches([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-semibold text-center mb-5 text-black">
          Araç Ara
        </Text>

        <InputRow
          icon={<DoublelocationSvg width={18} height={18} />}
          placeholder="Alış Ofisi"
          value={ofis}
          onChangeText={setOfis}
        />


        <View className="flex-row justify-between mb-3">
          <InputRow
            icon={<DateSvg width={18} height={18} />}
            placeholder="Alış Tarihi"
            value={getdate}
            onChangeText={setGetdate}
            style="mr-2 flex-1"
          />
          <InputRow
            icon={<DateSvg width={18} height={18} />}
            placeholder="İade Tarihi"
            value={backdate}
            onChangeText={setBackDate}
            style="flex-1"
          />
        </View>


        <View className="flex-row justify-between mb-3">
          <InputRow
            icon={<ClockSvg width={18} height={18} />}
            placeholder="Alış Saati"
            value={gettime}
            onChangeText={setGetTime}
            style="mr-2 flex-1"
          />
          <InputRow
            icon={<ClockSvg width={18} height={18} />}
            placeholder="İade Saati"
            value={backtime}
            onChangeText={setBackTime}
            style="flex-1"
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center mb-3 border border-gray-300 rounded-lg px-3 py-3"
          onPress={() => setDifferentDrop(!differentDrop)}
        >
          <View
            className={`w-5 h-5 rounded-full border mr-2 ${
              differentDrop ? "bg-orange-500 border-orange-500" : "border-gray-400"
            }`}
          />
          <Text className="text-sm text-black">
            Farklı bir lokasyona bırakacağım
          </Text>
        </TouchableOpacity>

        {differentDrop && (
          <InputRow
            icon={<DoublelocationSvg width={18} height={18} />}
            placeholder="İade Ofisi"
            value={returnOffice}
            onChangeText={setReturnOffice}
          />
        )}

        {lastSearches.length > 0 && (
          <View className="mb-3 border-t border-gray-200 pt-3">
            <Text className="text-sm text-gray-600 mb-2">Son Aramalar</Text>
            <FlatList
              data={lastSearches}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="flex-row justify-between p-2 border-b border-gray-100">
                  <Text className="text-black font-medium">
                    {item.pickup} → {item.drop}
                  </Text>
                  <Text className="text-gray-500 text-xs">{item.date}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={clearHistory}>
              <Text className="text-orange-500 text-sm text-center mt-2 font-semibold">
                Geçmişi Temizle
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSearch}
          className="bg-orange-500 rounded-lg py-3 mt-3"
        >
          <Text className="text-center text-white text-base font-semibold">
            Araç Ara
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationPage;

const InputRow = ({
  icon,
  placeholder,
  value,
  onChangeText,
  style,
}: any) => (
  <View
    className={`flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3 ${style}`}
  >
    {icon}
    <ReusableTextInput

      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      className="flex-1 ml-2 text-black"
      placeholderTextColor="#9CA3AF"
    />
  </View>
);
