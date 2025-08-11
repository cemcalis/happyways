
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import LocationSvg from "../../assets/HomePage/location.svg";
import LeftArrowSvg from "../../assets/HomePage/leftarrow.svg";

type LocationType = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
};

type Props = {
  onSelect?: (loc: LocationType) => void;
};

const LocationSelect: React.FC<Props> = ({ onSelect }) => {
  const { isDark } = useTheme();
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [showLocationList, setShowLocationList] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/api/location");
        const data = await response.json();
        setLocations(data);
        setSelectedLocation(data[0]);
        if (onSelect) onSelect(data[0]);
      } catch (err) {

      }
    };
    fetchLocations();
  }, []);

  const handleSelect = (loc: LocationType) => {
    setSelectedLocation(loc);
    setShowLocationList(false);
    if (onSelect) onSelect(loc);
  };

  return (
    <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
      <LocationSvg width={16} height={16} />
      <TouchableOpacity onPress={() => setShowLocationList(!showLocationList)}>
        <Text className={`text-sm ml-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {selectedLocation ? selectedLocation.name + ', ' + (selectedLocation.country || '') : 'Konum Seç'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => setShowLocationList(!showLocationList)}>
        <LeftArrowSvg width={12} height={12} style={{ transform: [{ rotate: showLocationList ? '180deg' : '90deg' }] }} fill={isDark ? "#9CA3AF" : "#6B7280"} />
      </TouchableOpacity>
      {showLocationList && (
        <View 
          className={`absolute top-7 left-6 min-w-40 max-w-55 rounded-lg border z-10 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
          style={styles.shadowContainer}
        >
          <ScrollView style={{ maxHeight: 90 }}>
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => handleSelect(loc)}
                className={`p-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-100'}`}
              >
                <Text className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{loc.name}, {loc.country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
});

export default LocationSelect;
