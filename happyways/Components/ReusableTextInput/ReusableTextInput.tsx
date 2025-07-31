import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

interface ReusableTextInputProps extends TextInputProps {
  label: string;
}

const ReusableTextInput: React.FC<ReusableTextInputProps> = ({
  label,
  ...props
}) => {
  return (
    <View>
      <Text className="text-gray-700 font-semibold mb-2 text-base">{label}</Text>
      <View className="bg-white rounded-xl shadow-sm border border-gray-100">
        <TextInput
          className="px-4 py-4 text-gray-800 text-base rounded-xl"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
    </View>
  );
};

export default ReusableTextInput;
