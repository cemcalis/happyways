import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../../types";
import { useTheme } from "../../../../contexts/ThemeContext";
import TabBar from "../../../../Components/TabBar/TapBar";
import {
  ReservationHeader,
  ReservationForm,
  SearchHistory,
} from "./ReservationComponents";

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
  const { isDark } = useTheme();
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
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        <ReservationHeader />
        
        <ReservationForm
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          usePickupAsDropoff={usePickupAsDropoff}
          getdate={getdate}
          backdate={backdate}
          gettime={gettime}
          backtime={backtime}
          isSearching={isSearching}
          onPickupLocationSelect={handlePickupLocationSelect}
          onDropoffLocationSelect={handleDropoffLocationSelect}
          onToggleDropoffSameAsPickup={toggleDropoffSameAsPickup}
          onGetDateChange={setGetdate}
          onBackDateChange={setBackDate}
          onGetTimeChange={setGetTime}
          onBackTimeChange={setBackTime}
          onSearch={handleSearch}
        />

        <SearchHistory
          lastSearches={lastSearches}
          onClearHistory={clearHistory}
        />
      </ScrollView>
      
      <TabBar navigation={navigation} activeRoute="ReservationPage" />
    </SafeAreaView>
  );
};

export default ReservationPage;
