import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import ReusableTextInput from "../../../../../Components/ReusableTextInput/ReusableTextInput";
import LocationSelect from "../../../../../Components/LocationSelect/LocationSelect";
import Icon from "../../../../../Components/Icons/Icons";

type LocationType = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
};

interface ReservationFormProps {
  pickupLocation: LocationType | null;
  dropoffLocation: LocationType | null;
  usePickupAsDropoff: boolean;
  getdate: string;
  backdate: string;
  gettime: string;
  backtime: string;
  isSearching: boolean;
  onPickupLocationSelect: (location: LocationType) => void;
  onDropoffLocationSelect: (location: LocationType) => void;
  onToggleDropoffSameAsPickup: () => void;
  onGetDateChange: (date: string) => void;
  onBackDateChange: (date: string) => void;
  onGetTimeChange: (time: string) => void;
  onBackTimeChange: (time: string) => void;
  onSearch: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  pickupLocation,
  dropoffLocation,
  usePickupAsDropoff,
  getdate,
  backdate,
  gettime,
  backtime,
  isSearching,
  onPickupLocationSelect,
  onDropoffLocationSelect,
  onToggleDropoffSameAsPickup,
  onGetDateChange,
  onBackDateChange,
  onGetTimeChange,
  onBackTimeChange,
  onSearch,
}) => {
  const { isDark } = useTheme();

  return (
    <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-4 mb-4`}>
      {/* Pickup Location */}
      <View className="mb-4">
        <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Alış Lokasyonu
        </Text>
        <LocationSelect onSelect={onPickupLocationSelect} />
        {pickupLocation && (
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Seçilen: {pickupLocation.name}
          </Text>
        )}
      </View>

      {/* Date Selection */}
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <ReusableTextInput
            placeholder="4 Nisan"
            value={getdate}
            onChangeText={onGetDateChange}
            icon={<Icon name="date" size={20} />}
          />
        </View>
        <View className="flex-1">
          <ReusableTextInput
            placeholder="7 Nisan"
            value={backdate}
            onChangeText={onBackDateChange}
            icon={<Icon name="date" size={20} />}
          />
        </View>
      </View>

      {/* Time Selection */}
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <ReusableTextInput
            placeholder="Ös 12:00"
            value={gettime}
            onChangeText={onGetTimeChange}
            icon={<Icon name="clock" size={20} />}
          />
        </View>
        <View className="flex-1">
          <ReusableTextInput
            placeholder="Ös 12:00"
            value={backtime}
            onChangeText={onBackTimeChange}
            icon={<Icon name="clock" size={20} />}
          />
        </View>
      </View>

      {/* Different Dropoff Location Toggle */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={onToggleDropoffSameAsPickup}
      >
        <View
          className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
            !usePickupAsDropoff 
              ? "bg-orange-500 border-orange-500" 
              : `border-gray-400 ${isDark ? 'bg-gray-700' : 'bg-white'}`
          }`}
        >
          {!usePickupAsDropoff && (
            <Text className="text-white font-bold text-xs"> </Text>
          )}
        </View>
        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Farklı bir lokasyona bırakacağım
        </Text>
      </TouchableOpacity>

      {/* Dropoff Location (if different) */}
      {!usePickupAsDropoff && (
        <View className="mb-4">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            İade Lokasyonu
          </Text>
          <LocationSelect onSelect={onDropoffLocationSelect} />
          {dropoffLocation && (
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Seçilen: {dropoffLocation.name}
            </Text>
          )}
        </View>
      )}

      {/* Search Button */}
      <TouchableOpacity
        onPress={onSearch}
        disabled={isSearching}
        className={`rounded-xl py-4 shadow-lg ${isSearching ? 'bg-gray-400' : 'bg-orange-500'}`}
      >
        <Text className="text-center text-white text-lg font-bold">
          {isSearching ? "Aranıyo." : "Araç Ara"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReservationForm;
