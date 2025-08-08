import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../../../contexts/ThemeContext';

const CarsLoadingState = () => {
  const { isDark } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20,
      backgroundColor: isDark ? '#111827' : '#FFFFFF'
    }}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={{ 
        marginTop: 10, 
        fontSize: 16, 
        color: isDark ? '#9CA3AF' : '#666',
        textAlign: 'center' 
      }}>
        Araçlar yükleniyor...
      </Text>
    </View>
  );
};

export default CarsLoadingState;
