import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reservation {
  id: string;
  car_id: string;
  car_model: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;
  pickup_location: string;
  dropoff_location: string;
  total_price: string;
  extra_driver: boolean;
  extra_driver_price: string;
  insurance: boolean;
  insurance_price: string;
  payment_id: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const user_email = await AsyncStorage.getItem('user_email');
      if (!user_email) {
        Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
        return;
      }

      const response = await fetch('http://172.20.10.3:3000/api/reservation/my-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReservations(data.reservations || []);
      } else {
        Alert.alert('Hata', data.message || 'Rezervasyonlar yüklenemedi');
      }
    } catch (error) {
      console.error('Rezervasyon yükleme hatası:', error);
      Alert.alert('Hata', 'Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Rezervasyonlar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        <Text style={styles.headerSubtitle}>{reservations.length} rezervasyon</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz rezervasyonunuz bulunmuyor</Text>
            <Text style={styles.emptySubtext}>İlk rezervasyonunuzu yapmak için araç arama sayfasını ziyaret edin</Text>
          </View>
        ) : (
          reservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.carModel}>{reservation.car_model}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(reservation.status)}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📅 Alış Tarihi:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(reservation.pickup_date)} {reservation.pickup_time}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📅 Teslim Tarihi:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(reservation.dropoff_date)} {reservation.dropoff_time}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📍 Alış Yeri:</Text>
                  <Text style={styles.infoValue}>{reservation.pickup_location}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📍 Teslim Yeri:</Text>
                  <Text style={styles.infoValue}>{reservation.dropoff_location}</Text>
                </View>

                {reservation.extra_driver && (
                  <View style={styles.extraService}>
                    <Text style={styles.extraServiceText}>
                      ✅ Ek Sürücü (+{reservation.extra_driver_price} TL)
                    </Text>
                  </View>
                )}

                {reservation.insurance && (
                  <View style={styles.extraService}>
                    <Text style={styles.extraServiceText}>
                      ✅ Sigorta (+{reservation.insurance_price} TL)
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Toplam Tutar:</Text>
                  <Text style={styles.priceValue}>{reservation.total_price} TL</Text>
                </View>
                <Text style={styles.reservationId}>#{reservation.id}</Text>
              </View>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>
                  💳 Ödeme: {reservation.payment_status === 'paid' ? '✅ Tamamlandı' : '⏳ Beklemede'}
                </Text>
                <Text style={styles.dateText}>
                  Oluşturulma: {formatDate(reservation.created_at)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  reservationCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  carModel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  extraService: {
    backgroundColor: '#e8f5e8',
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  extraServiceText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  reservationId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  paymentInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 13,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
});

export default MyReservations;
