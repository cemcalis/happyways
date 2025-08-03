import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-600 mt-4">Kimlik doğrulanıyor...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
