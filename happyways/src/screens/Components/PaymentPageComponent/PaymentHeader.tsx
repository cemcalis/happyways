import React from 'react';
import { View, Text } from 'react-native';
import BackButton from '../../../../Components/BackButton/BackButton';

interface PaymentHeaderProps {
  onBack: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onBack }) => {
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: 16, 
      paddingVertical: 12, 
      backgroundColor: '#fff', 
      borderBottomWidth: 1, 
      borderBottomColor: '#F3F4F6' 
    }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Ödeme</Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

export default PaymentHeader;
