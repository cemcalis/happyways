import React from 'react';
import { View, Text } from 'react-native';
import BackButton from '../../../../../Components/BackButton/BackButton';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface PaymentHeaderProps { onBack: () => void; }

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('payment');
  const title = t('payment', { defaultValue: 'Ödeme' });

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#0B1220' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#233047' : '#F3F4F6'
    }}>
      <BackButton onPress={onBack} />
      <Text style={{
        position: 'absolute', left: 0, right: 0, textAlign: 'center',
        fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#111827'
      }}>
        {title}
      </Text>
      <View style={{ width: 32 }} />
    </View>
  );
};
export default PaymentHeader;
