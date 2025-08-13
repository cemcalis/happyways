import React, { useState, useEffect } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../../types";
import { useTheme } from "../../../../contexts/ThemeContext";
import TabBar from "../../../../Components/TabBar/TapBar";
import { useTranslation } from "react-i18next";
import {
  ReservationHeader,
  ReservationForm,
  SearchHistory,
  SelectedCarInfo,
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
  route: RouteProp<RootStackParamList, "ReservationPage">;
};

const ReservationPage = ({ navigation, route }: ReservationPageProps) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('reservation');
  

  const { carId, carModel, carPrice, source, pickupDate, dropDate, pickupTime, dropTime, pickup, drop } = route.params || {};
  
  const [pickupLocation, setPickupLocation] = useState<LocationType | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationType | null>(null);
  const [usePickupAsDropoff, setUsePickupAsDropoff] = useState(true);
  const [getdate, setGetdate] = useState("");
  const [backdate, setBackDate] = useState("");
  const [gettime, setGetTime] = useState("");
  const [backtime, setBackTime] = useState("");
  const [lastSearches, setLastSearches] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<string>("");
  const [daysDifference, setDaysDifference] = useState<number>(0);


  const calculateTotalPrice = (startDate: string, endDate: string) => {
    if (!startDate || !endDate || !carPrice) return;
    
    try {
  
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(dateStr);
      };
      
      const start = parseDate(startDate);
      const end = parseDate(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (dayDiff > 0) {
        const dailyPrice = parseFloat(carPrice.replace(/[^0-9]/g, '')) || 0;
        const total = dailyPrice * dayDiff;
        setDaysDifference(dayDiff);
        setCalculatedPrice(total.toString());
      }
    } catch (error) {
      console.log("Tarih parse hatası:", error);
    }
  };


  useEffect(() => {
    if (getdate && backdate) {
      calculateTotalPrice(getdate, backdate);
    }
  }, [getdate, backdate, carPrice]);

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

  const handleReservation = () => {
    if (source === "HomePage" && carId) {
     
      if (!pickupLocation) {
        Alert.alert("Eksik Bilgi", "Lütfen alış lokasyonunu seçin");
        return;
      }
      
      if (!dropoffLocation && !usePickupAsDropoff) {
        Alert.alert("Eksik Bilgi", "Lütfen dönüş lokasyonunu seçin");
        return;
      }
      
      if (!getdate) {
        Alert.alert("Eksik Bilgi", "Lütfen alış tarihini seçin");
        return;
      }
      
      if (!backdate) {
        Alert.alert("Eksik Bilgi", "Lütfen dönüş tarihini seçin");
        return;
      }
      
      if (!gettime) {
        Alert.alert("Eksik Bilgi", "Lütfen alış saatini seçin");
        return;
      }
      
      if (!backtime) {
        Alert.alert("Eksik Bilgi", "Lütfen dönüş saatini seçin");
        return;
      }

   
      navigation.navigate("AdditionalRequests", {
        carId: carId,
        carModel: carModel || "",
        carPrice: carPrice || "",
        pickupDate: getdate,
        dropDate: backdate,
        pickupTime: gettime,
        dropTime: backtime,
        pickup: pickupLocation.name,
        drop: usePickupAsDropoff ? pickupLocation.name : (dropoffLocation?.name || ""),
        source: "HomePage"
      });
    } else {
   
      handleSearch();
    }
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
          onSearch={handleReservation}
          source={source}
          carId={carId}
          carModel={carModel}
          carPrice={carPrice}
          calculatedPrice={calculatedPrice}
          daysDifference={daysDifference}
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
