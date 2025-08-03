import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#f97316', // orange-500
  text = 'Yükleniyor...',
  className = ''
}) => {
  return (
    <View className={`flex-1 justify-center items-center bg-gray-50 px-4 ${className}`}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="text-gray-600 mt-4 text-center font-medium">
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
