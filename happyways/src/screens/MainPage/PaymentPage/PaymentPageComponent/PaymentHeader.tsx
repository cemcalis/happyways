import React from 'react';
import { View, Text } from 'react-native';
import BackButton from '../../../../../Components/BackButton/BackButton';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface PaymentHeaderProps {
  onBack: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation('payment');

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${
        isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-100'
      }`}
    >
      <BackButton onPress={onBack} />
      <Text className={`text-lg text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('payment')}
      </Text>
      <View className="w-8" />
    </View>
  );
};

export default PaymentHeader;
