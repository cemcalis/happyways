import React, { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../types";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { apiRequest, handleApiError, showErrorAlert } from "../../../../../utils/errorHandling";
import TabBar from "../../../../../Components/TabBar/TapBar";
import FilterModal from "../../HomePage/HomePageComponent/FilterModal";
import { CarsHeader, CarsLoadingState, CarsFilter, CarsList } from "./CarsComponents";
import { useTranslation } from "react-i18next";

type AllCarsPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AllCarsPage">;
  route: RouteProp<RootStackParamList, "AllCarsPage">;
};

type Car = {
  id: number;
  model: string;
  year: number;
  price: string;
  image: string;
  gear: string;
  fuel: string;
  seats: number;
  ac: boolean;
};

const AllCarsPage = ({ navigation, route }: AllCarsPageProp) => {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isGrid, setIsGrid] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchInfo, setSearchInfo] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState({
    fuelTypes: [] as string[],
    gearTypes: [] as string[]
  });
  const { token } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation('cars');
  const { t: tAuth } = useTranslation('auth');

  const { searchParams, user_email } = route.params || {};
  const source = route.params?.source;

  const handleApplyFilters = useCallback(async (fuelTypes: string[], gearTypes: string[]) => {
    setActiveFilters({ fuelTypes, gearTypes });
    
    try {
   
      const response = await fetch("http://10.0.2.2:3000/api/cars/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cars,
          searchText,
          fuelTypes,
          gearTypes,
          sortBy: 'price_asc'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFilteredCars(data.cars);
      } else {
     
        let filtered = cars;
        
        if (searchText.trim() !== "") {
          filtered = filtered.filter((car) => 
            car.model.toLowerCase().includes(searchText.toLowerCase()) ||
            car.year.toString().includes(searchText)
          );
        }
        
        if (fuelTypes.length > 0) {
          filtered = filtered.filter(car => fuelTypes.includes(car.fuel));
        }
        
        if (gearTypes.length > 0) {
          filtered = filtered.filter(car => gearTypes.includes(car.gear));
        }
        
        setFilteredCars(filtered);
      }
    } catch (error) {
      console.error("Filtreleme hatası:", error);
   
      let filtered = cars;
      
      if (searchText.trim() !== "") {
        filtered = filtered.filter((car) => 
          car.model.toLowerCase().includes(searchText.toLowerCase()) ||
          car.year.toString().includes(searchText)
        );
      }
      
      if (fuelTypes.length > 0) {
        filtered = filtered.filter(car => fuelTypes.includes(car.fuel));
      }
      
      if (gearTypes.length > 0) {
        filtered = filtered.filter(car => gearTypes.includes(car.gear));
      }
      
      setFilteredCars(filtered);
    }
  }, [cars, searchText]);

  const handleFilterPress = useCallback(() => {
    setShowFilter(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setShowFilter(false);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      if (!token) {
        Alert.alert("Hata", "Oturum süreniz dolmuş, lütfen tekrar giriş yapın");
        return;
      }

      try {
        let url = "http://10.0.2.2:3000/api/cars/allcars";
    
        if (searchParams) {
          const queryParams = new URLSearchParams({
            pickup_location: searchParams.pickup_location,
            dropoff_location: searchParams.dropoff_location,
            pickup_date: searchParams.pickup_date,
            dropoff_date: searchParams.dropoff_date,
            pickup_time: searchParams.pickup_time,
            dropoff_time: searchParams.dropoff_time,
          });
          url += `?${queryParams.toString()}`;
        }

        console.log("API Request URL:", url);

        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        setCars(data.cars || []);
        setFilteredCars(data.cars || []);
        setSearchInfo(data.searchInfo);
      } catch (error: any) {
        console.error("Arabalar alınamadı:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        Alert.alert("API Hatası", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams, token]);

  useEffect(() => {
    const filterCars = async () => {
      try {

        const response = await fetch("http://10.0.2.2:3000/api/cars/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cars,
            searchText,
            fuelTypes: activeFilters.fuelTypes,
            gearTypes: activeFilters.gearTypes,
            sortBy: 'price_asc'
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFilteredCars(data.cars);
        } else {
    
          let filtered = cars;
          
          if (searchText.trim() !== "") {
            filtered = filtered.filter((car) => 
              car.model.toLowerCase().includes(searchText.toLowerCase()) ||
              car.year.toString().includes(searchText)
            );
          }
          
          if (activeFilters.fuelTypes.length > 0) {
            filtered = filtered.filter(car => activeFilters.fuelTypes.includes(car.fuel));
          }
          
          if (activeFilters.gearTypes.length > 0) {
            filtered = filtered.filter(car => activeFilters.gearTypes.includes(car.gear));
          }
          
          setFilteredCars(filtered);
        }
      } catch (error) {
        console.error("Filtreleme hatası:", error);
      
        let filtered = cars;
        
        if (searchText.trim() !== "") {
          filtered = filtered.filter((car) => 
            car.model.toLowerCase().includes(searchText.toLowerCase()) ||
            car.year.toString().includes(searchText)
          );
        }
        
        if (activeFilters.fuelTypes.length > 0) {
          filtered = filtered.filter(car => activeFilters.fuelTypes.includes(car.fuel));
        }
        
        if (activeFilters.gearTypes.length > 0) {
          filtered = filtered.filter(car => activeFilters.gearTypes.includes(car.gear));
        }
        
        setFilteredCars(filtered);
      }
    };

    if (cars.length > 0) {
      filterCars();
    }
  }, [cars, searchText, activeFilters]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {loading ? (
        <CarsLoadingState />
      ) : (
        <>
          <CarsHeader navigation={navigation} searchInfo={searchInfo} />

          <CarsFilter
            searchText={searchText}
            setSearchText={setSearchText}
            filteredCarsCount={filteredCars.length}
            handleFilterPress={handleFilterPress}
            isGrid={isGrid}
            setIsGrid={setIsGrid}
            searchInfo={searchInfo}
          />

          <FilterModal
            showFilter={showFilter}
            onClose={handleFilterClose}
            navigation={navigation}
            filteredCarsCount={filteredCars.length}
            onApplyFilters={handleApplyFilters}
            currentFilters={activeFilters}
          /> 
          
          <CarsList
            filteredCars={filteredCars}
            isGrid={isGrid}
            navigation={navigation}
            searchParams={searchParams}
            source={source}
            user_email={user_email}
          />
        </>
      )}
      <TabBar navigation={navigation} activeRoute="AllCarsPage" />
    </SafeAreaView>
  );
};

export default AllCarsPage;
