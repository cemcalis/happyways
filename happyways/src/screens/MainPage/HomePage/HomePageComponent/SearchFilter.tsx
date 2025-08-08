import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import Icon from "../../../../../Components/Icons/Icons";
import ReusableTextInput from "../../../../../Components/ReusableTextInput/ReusableTextInput";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

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
  const { isDark } = useTheme();
  const { t } = useTranslation('home');

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
    <View className="flex-row items-center mb-6">
      <View className="flex-1">
        <ReusableTextInput
          placeholder={t('searchCarOrCampaign')}
          value={searchText}
          onChangeText={setSearchText}
          icon={<Icon name="search" size={18} />}
        />
      </View>
      <TouchableOpacity 
        className="ml-3 bg-orange-500 rounded-lg p-3"
        onPress={onFilterPress}
      >
        <Icon name="filter" size={16} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchFilter;
