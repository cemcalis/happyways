import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const CarsLoadingState = () => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20 
    }}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={{ 
        marginTop: 10, 
        fontSize: 16, 
        color: '#666',
        textAlign: 'center' 
      }}>
        Araçlar yükleniyor...
      </Text>
    </View>
  );
};

export default CarsLoadingState;
