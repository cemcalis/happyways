import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import BackButton from '../../../Components/BackButton/BackButton';
import TabBar from '../../../Components/TabBar/TapBar';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

type NotificationPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "NotificationPage">;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
};

const NotificationPage = ({ navigation }: NotificationPageProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/api/notifications", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Bildirimler yüklenemedi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://10.0.2.2:3000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Bildirim okundu olarak işaretlenemedi:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => !item.read && markAsRead(item.id)}
      className={`p-4 mb-3 rounded-xl border ${
        item.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-orange-200'
      }`}
    >
      <View className="flex-row items-start">
        <Text className="text-xl mr-3">{getNotificationIcon(item.type)}</Text>
        <View className="flex-1">
          <Text className={`font-semibold text-base ${
            item.read ? 'text-gray-600' : 'text-gray-900'
          }`}>
            {item.title}
          </Text>
          <Text className={`text-sm mt-1 ${
            item.read ? 'text-gray-500' : 'text-gray-700'
          }`}>
            {item.message}
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            {new Date(item.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
        {!item.read && (
          <View className="w-3 h-3 bg-orange-500 rounded-full" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner text="Bildirimler yükleniyor..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <BackButton onPress={() => navigation.goBack()} />
        <Text className="text-lg font-bold text-gray-900">Bildirimler</Text>
        <View className="w-8" />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-4xl mb-4">🔔</Text>
            <Text className="text-gray-500 text-center">
              Henüz bildiriminiz bulunmuyor
            </Text>
          </View>
        }
      />

      <TabBar navigation={navigation} activeRoute="HomePage" />
    </SafeAreaView>
  );
};

export default NotificationPage;
