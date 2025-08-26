import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { isDark } = useTheme();
  
  return (
<View className="mb-4">
      {label && <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold mb-2 text-base`}>{label}</Text>}
      <View 
        className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border flex-row items-center px-4 py-4 shadow-md shadow-black/10 ${
          error ? 'border-red-500' : ''
        }`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'} text-base `}
          style={{ textAlignVertical: 'center' }}
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
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
