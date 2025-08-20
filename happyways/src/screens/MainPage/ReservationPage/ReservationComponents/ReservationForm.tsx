import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from "../../../../../contexts/ThemeContext";
import ReusableTextInput from "../../../../../Components/ReusableTextInput/ReusableTextInput";
import LocationSelect from "../../../../../Components/LocationSelect/LocationSelect";
import Icon from "../../../../../Components/Icons/Icons";
import { useTranslation } from "react-i18next";
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
  source?: string;
   car_id?: number;
  car_model?: string;
  car_price?: string;
  calculated_price?: string;
  days_difference?: number;
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
  source,
   car_id,
  car_model,
  car_price,
  calculated_price,
  days_difference,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('reservation');
  
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showDropoffDatePicker, setShowDropoffDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
  
  
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [dropoffTime, setDropoffTime] = useState(new Date());

  const handlePickupDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPickupDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('tr-TR');
      onGetDateChange(formattedDate);
    }
  };

  const handleDropoffDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDropoffDatePicker(false);
    if (selectedDate) {
      setDropoffDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('tr-TR');
      onBackDateChange(formattedDate);
    }
  };

  const handlePickupTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowPickupTimePicker(false);
    if (selectedTime) {
      setPickupTime(selectedTime);
      const formattedTime = selectedTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      onGetTimeChange(formattedTime);
    }
  };

  const handleDropoffTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowDropoffTimePicker(false);
    if (selectedTime) {
      setDropoffTime(selectedTime);
      const formattedTime = selectedTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      onBackTimeChange(formattedTime);
    }
  };

  return (
    <View 
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-4 mb-4`}
      style={styles.shadowContainer}
    >
      
      <View className="mb-4">
        <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          {t('pickupLocation')}
        </Text>
        <LocationSelect onSelect={onPickupLocationSelect} />
        {pickupLocation && (
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {t('selected')}: {pickupLocation.name}
          </Text>
        )}
      </View>

      
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t('pickupDate')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowPickupDatePicker(true)}
            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border flex-row items-center px-4 py-4`}
            style={styles.shadowContainer}
          >
            <Icon name="date" size={20} />
            <Text className={`flex-1 ml-3 ${isDark ? 'text-gray-200' : 'text-gray-800'} text-base`}>
              {getdate || t('selectDate')}
            </Text>
          </TouchableOpacity>
          {showPickupDatePicker && (
            <DateTimePicker
              value={pickupDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePickupDateChange}
              minimumDate={new Date()} 
            />
          )}
        </View>
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t('dropoffDate')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDropoffDatePicker(true)}
            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border flex-row items-center px-4 py-4`}
            style={styles.shadowContainer}
          >
            <Icon name="date" size={20} />
            <Text className={`flex-1 ml-3 ${isDark ? 'text-gray-200' : 'text-gray-800'} text-base`}>
              {backdate || t('selectDate')}
            </Text>
          </TouchableOpacity>
          {showDropoffDatePicker && (
            <DateTimePicker
              value={dropoffDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDropoffDateChange}
              minimumDate={pickupDate} 
            />
          )}
        </View>
      </View>

      
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t('pickupTime')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowPickupTimePicker(true)}
            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border flex-row items-center px-4 py-4`}
            style={styles.shadowContainer}
          >
            <Icon name="clock" size={20} />
            <Text className={`flex-1 ml-3 ${isDark ? 'text-gray-200' : 'text-gray-800'} text-base`}>
              {gettime || t('selectTime')}
            </Text>
          </TouchableOpacity>
          {showPickupTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePickupTimeChange}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t('dropoffTime')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDropoffTimePicker(true)}
            className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border flex-row items-center px-4 py-4`}
            style={styles.shadowContainer}
          >
            <Icon name="clock" size={20} />
            <Text className={`flex-1 ml-3 ${isDark ? 'text-gray-200' : 'text-gray-800'} text-base`}>
              {backtime || t('selectTime')}
            </Text>
          </TouchableOpacity>
          {showDropoffTimePicker && (
            <DateTimePicker
              value={dropoffTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDropoffTimeChange}
            />
          )}
        </View>
      </View>

      
       {source === "HomePage" && car_id && calculated_price && (
        <View className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
          <Text className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'} mb-1`}>
            {t('priceCalculation')}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
            {days_difference} {t('days')} × {car_price} = {calculated_price} ₺
          </Text>
        </View>
      )}

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
            <Text className="text-white font-bold text-xs">✓</Text>
          )}
        </View>
        <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
          {t('differentDropoffLocation')}
        </Text>
      </TouchableOpacity>


      {!usePickupAsDropoff && (
        <View className="mb-4">
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t('dropoffLocation')}
          </Text>
          <LocationSelect onSelect={onDropoffLocationSelect} />
          {dropoffLocation && (
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {t('selected')}: {dropoffLocation.name}
            </Text>
          )}
        </View>
      )}


      <TouchableOpacity
        onPress={onSearch}
        disabled={isSearching}
        className={`rounded-xl py-4 ${isSearching ? 'bg-gray-400' : 'bg-orange-500'}`}
        style={styles.shadowButton}
      >
        <Text className="text-center text-white text-lg font-bold">
          {isSearching
            ? t('searching')
            : source === "HomePage" && car_id
              ? t('continueReservation')
              : t('searchCars')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ReservationForm;
