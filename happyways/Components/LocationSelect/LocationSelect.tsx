
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import LocationSvg from "../../../../../assets/HomePage/location.svg";
import LeftArrowSvg from "../../../../../assets/HomePage/leftarrow.svg";

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
        <Text style={{ color: '#111827', fontSize: 14, marginLeft: 6 }}>
          {selectedLocation ? selectedLocation.name + ', ' + (selectedLocation.country || '') : 'Konum Seç'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => setShowLocationList(!showLocationList)}>
        <LeftArrowSvg width={12} height={12} style={{ transform: [{ rotate: showLocationList ? '180deg' : '90deg' }] }} fill="#9CA3AF" />
      </TouchableOpacity>
      {showLocationList && (
        <View style={{
          position: 'absolute',
          top: 28,
          left: 24,
          minWidth: 160,
          maxWidth: 220,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          zIndex: 10,
        }}>
          <ScrollView style={{ maxHeight: 90 }}>
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => handleSelect(loc)}
                style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
              >
                <Text style={{ fontSize: 14 }}>{loc.name}, {loc.country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default LocationSelect;
