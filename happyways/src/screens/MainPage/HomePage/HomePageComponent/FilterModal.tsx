import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../../../types";

import { useTheme } from "../../../../../contexts/ThemeContext";

type FilterModalProps = {
  showFilter: boolean;
  onClose: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  filteredCarsCount: number;
  onApplyFilters: (fuelTypes: string[], gearTypes: string[]) => void;
  currentFilters: {
    fuelTypes: string[];
    gearTypes: string[];
  };
};

const FilterModal = ({
  showFilter,
  onClose,
  navigation,
  filteredCarsCount,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) => {
  const { t } = useTranslation("home");
  const { isDark } = useTheme();
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(currentFilters.fuelTypes);
  const [selectedGearTypes, setSelectedGearTypes] = useState<string[]>(currentFilters.gearTypes);

  const fuelTypes = [t("gasoline"), t("diesel"), t("electric")];
  const gearTypes = [t("manual"), t("automatic")];

  const toggleFuelType = (fuel: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleGearType = (gear: string) => {
    setSelectedGearTypes((prev) =>
      prev.includes(gear) ? prev.filter((g) => g !== gear) : [...prev, gear]
    );
  };

  const clearFilters = () => {
    setSelectedFuelTypes([]);
    setSelectedGearTypes([]);
    onApplyFilters([], []);
  };

  const handleApplyFilter = () => {
    onApplyFilters(selectedFuelTypes, selectedGearTypes);
    onClose();
  };

  if (!showFilter) {
    return null;
  }

  return (
    <View className="absolute left-0 right-0 top-0 bottom-0 z-50 bg-black/50 justify-center items-center">
      <View
        className={`rounded-xl p-6 mx-4 w-80 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Text
          className={`text-lg font-bold mb-4 text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("filters")}
        </Text>

        <View className="mb-4">
          <Text
            className={`text-sm font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("fuelType")}
          </Text>
          <View className="flex-row flex-wrap">
            {fuelTypes.map((fuel) => (
              <TouchableOpacity
                key={fuel}
                className={`rounded-lg px-3 py-2 mr-2 mb-2 ${
                  selectedFuelTypes.includes(fuel)
                    ? "bg-orange-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-100"
                }`}
                onPress={() => toggleFuelType(fuel)}
              >
                <Text
                  className={`text-sm ${
                    selectedFuelTypes.includes(fuel)
                      ? "text-white"
                      : isDark
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {fuel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text
            className={`text-sm font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("gearType")}
          </Text>
          <View className="flex-row flex-wrap">
            {gearTypes.map((gear) => (
              <TouchableOpacity
                key={gear}
                className={`rounded-lg px-3 py-2 mr-2 mb-2 ${
                  selectedGearTypes.includes(gear)
                    ? "bg-orange-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-100"
                }`}
                onPress={() => toggleGearType(gear)}
              >
                <Text
                  className={`text-sm ${
                    selectedGearTypes.includes(gear)
                      ? "text-white"
                      : isDark
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {gear}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className={`px-4 py-3 rounded-lg flex-1 mr-2 ${
              isDark ? "bg-gray-600" : "bg-gray-500"
            }`}
            onPress={clearFilters}
          >
            <Text className="text-white text-center font-semibold">
              {t("clear")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-orange-500 px-4 py-3 rounded-lg flex-1 ml-2"
            onPress={handleApplyFilter}
          >
            <Text className="text-white text-center font-semibold">
              {t("apply")} ({filteredCarsCount})
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="mt-3 py-2" onPress={onClose}>
          <Text
            className={`text-center ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t("close")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterModal;
