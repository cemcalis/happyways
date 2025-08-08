import React from 'react';
import { View, Text } from 'react-native';
import BackButton from '../../../../../Components/BackButton/BackButton';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface PaymentHeaderProps {
  onBack: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: 16, 
      paddingVertical: 12, 
      backgroundColor: isDark ? '#1F2937' : '#fff', 
      borderBottomWidth: 1, 
      borderBottomColor: isDark ? '#374151' : '#F3F4F6' 
    }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>Ödeme</Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

export default PaymentHeader;
