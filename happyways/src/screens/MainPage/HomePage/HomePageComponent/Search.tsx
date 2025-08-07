import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "../../../../../Components/Icons/Icons";

type Campaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  transaction_date: string;
  rent_date: string;
  subtitle1: string;
  subtitle2: string;
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
  baggage: number;
  ac: boolean;
};

type SearchFilterProps = {
  campaigns: Campaign[];
  cars: Car[];
  onFilteredDataChange: (filteredCars: Car[], filteredCampaigns: Campaign[], searchText: string) => void;
  onFilterPress: () => void;
};

const SearchFilter = ({ campaigns, cars, onFilteredDataChange, onFilterPress }: SearchFilterProps) => {
  const [searchText, setSearchText] = useState("");

  // Debounced arama filtreleme useEffect'i
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.trim() === "") {
        onFilteredDataChange(cars, campaigns, "");
      } else {
       
        const filteredCarResults = cars.filter((car) => 
          car.model.toLowerCase().includes(searchText.toLowerCase()) ||
          car.year.toString().includes(searchText) ||
          car.fuel.toLowerCase().includes(searchText.toLowerCase()) ||
          car.gear.toLowerCase().includes(searchText.toLowerCase())
        );

        const filteredCampaignResults = campaigns.filter((campaign) => 
          campaign.title.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.subtitle1.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.subtitle2.toLowerCase().includes(searchText.toLowerCase())
        );

        onFilteredDataChange(filteredCarResults, filteredCampaignResults, searchText);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [cars, campaigns, searchText]);

  return (
    <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 mb-6 shadow-sm">
      <Icon name="search" size={18} />
      <TextInput
        className="flex-1 text-gray-800 ml-3"
        placeholder="Araç veya kampanya arayın..."
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
      />
      <TouchableOpacity 
        className="ml-3 bg-orange-500 rounded-lg p-2"
        onPress={onFilterPress}
      >
        <Icon name="filter" size={16} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchFilter;
