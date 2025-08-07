import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../../types";
import ReusableTextInput from "../../../../Components/ReusableTextInput/ReusableTextInput";
import LocationSelect from "../../../../Components/LocationSelect/LocationSelect";
import TabBar from "../../../../Components/TabBar/TapBar";
import Icon from "../../../../Components/Icons/Icons";

type LocationType = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
};




type ReservationPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ReservationPage">;
};

const ReservationPage = ({ navigation }: ReservationPageProps) => {
  const [pickupLocation, setPickupLocation] = useState<LocationType | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationType | null>(null);
  const [usePickupAsDropoff, setUsePickupAsDropoff] = useState(true);
  const [getdate, setGetdate] = useState("");
  const [backdate, setBackDate] = useState("");
  const [gettime, setGetTime] = useState("");
  const [backtime, setBackTime] = useState("");
  const [lastSearches, setLastSearches] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);


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

  const handlePickupLocationSelect = (location: LocationType) => {
    setPickupLocation(location);
    if (usePickupAsDropoff) {
      setDropoffLocation(location);
    }
  };

  const handleDropoffLocationSelect = (location: LocationType) => {
    setDropoffLocation(location);
    setUsePickupAsDropoff(false);
  };

  const toggleDropoffSameAsPickup = () => {
    if (!usePickupAsDropoff) {
      setUsePickupAsDropoff(true);
      setDropoffLocation(pickupLocation);
    } else {
      setUsePickupAsDropoff(false);
    }
  };

  const handleSearch = async () => {
    if (!pickupLocation || !getdate || !backdate || !gettime || !backtime) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun");
      return;
    }

    try {
      setIsSearching(true);

      const dropLocation = usePickupAsDropoff ? pickupLocation : dropoffLocation || pickupLocation;

      const searchData = {
        pickup: pickupLocation.name,
        drop: dropLocation.name,
        date: `${getdate}, ${gettime} - ${backdate}, ${backtime}`,
      };

      const searchParams = {
        pickup: pickupLocation.name,
        drop: dropLocation.name,
        pickupLocationId: pickupLocation.id,
        dropoffLocationId: dropLocation.id,
        pickupDate: getdate,
        dropDate: backdate,
        pickupTime: gettime,
        dropTime: backtime,
      };

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

      navigation.navigate("AllCarsPage", { searchParams });
    } catch (error) {
      console.log("Arama hatası:", error);
      Alert.alert("Hata", "Arama sırasında bir hata oluştu");
    } finally {
      setIsSearching(false);
    }
  };


  const clearHistory = async () => {
    await AsyncStorage.removeItem("lastSearches");
    setLastSearches([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
   
        <View className="flex-row items-center justify-center py-4 mb-2">
          <Text className="text-xl font-bold text-black">Araç Ara</Text>
        </View>

        <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4">
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Alış Lokasyonu</Text>
            <LocationSelect onSelect={handlePickupLocationSelect} />
            {pickupLocation && (
              <Text className="text-xs text-gray-500 mt-1">Seçilen: {pickupLocation.name}</Text>
            )}
          </View>

          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1">
              <ReusableTextInput
                placeholder="4 Nisan"
                value={getdate}
                onChangeText={setGetdate}
                icon={<Icon name="date" size={20} />}
              />
            </View>
            <View className="flex-1">
              <ReusableTextInput
                placeholder="7 Nisan"
                value={backdate}
                onChangeText={setBackDate}
                icon={<Icon name="date" size={20} />}
              />
            </View>
          </View>

          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1">
              <ReusableTextInput
                placeholder="Ös 12:00"
                value={gettime}
                onChangeText={setGetTime}
                icon={<Icon name="clock" size={20} />}
              />
            </View>
            <View className="flex-1">
              <ReusableTextInput
                placeholder="Ös 12:00"
                value={backtime}
                onChangeText={setBackTime}
                icon={<Icon name="clock" size={20} />}
              />
            </View>
          </View>

          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={toggleDropoffSameAsPickup}
          >
            <View
              className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                !usePickupAsDropoff ? "bg-orange-500 border-orange-500" : "border-gray-400 bg-white"
              }`}
            >
              {!usePickupAsDropoff && (
                <Text className="text-white font-bold text-xs"> </Text>
              )}
            </View>
            <Text className="text-sm text-gray-700">
              Farklı bir lokasyona bırakacağım
            </Text>
          </TouchableOpacity>

          {!usePickupAsDropoff && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">İade Lokasyonu</Text>
              <LocationSelect onSelect={handleDropoffLocationSelect} />
              {dropoffLocation && (
                <Text className="text-xs text-gray-500 mt-1">Seçilen: {dropoffLocation.name}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            onPress={handleSearch}
            disabled={isSearching}
            className={`rounded-xl py-4 shadow-lg ${isSearching ? 'bg-gray-400' : 'bg-orange-500'}`}
          >
            <Text className="text-center text-white text-lg font-bold">
              {isSearching ? "Aranıyo." : "Araç Ara"}
            </Text>
          </TouchableOpacity>
        </View>

        {lastSearches.length > 0 && (
          <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Son Aramalar</Text>
            <FlatList
              data={lastSearches}
              keyExtractor={(_, index) => index.toString()}
              nestedScrollEnabled={false}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-xl mb-3 shadow-sm">
                  <View className="flex-1">
                    <Text className="text-black font-semibold text-sm mb-1">
                      {item.pickup} → {item.drop}
                    </Text>
                    <Text className="text-gray-500 text-xs">{item.date}</Text>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity onPress={clearHistory} className="mt-2">
              <Text className="text-red-500 text-sm text-center font-semibold">
                Geçmişi Temizle
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <TabBar navigation={navigation} activeRoute="ReservationPage" />
    </SafeAreaView>
  );
};

export default ReservationPage;
