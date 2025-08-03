import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

interface ReusableTextInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
}

const ReusableTextInput: React.FC<ReusableTextInputProps> = ({
  label,
  icon,
  error = false,
  errorMessage = '',
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 font-semibold mb-2 text-base">{label}</Text>}
      <View className={`bg-white rounded-xl shadow-md border flex-row items-center px-4 py-4 ${
        error ? 'border-red-500' : 'border-gray-200'
      }`}>
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-gray-800 text-base"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error && errorMessage && (
        <Text className="text-red-500 text-sm mt-1 ml-2">{errorMessage}</Text>
      )}
    </View>
  );
};

export default ReusableTextInput;
