import { API_CONFIG } from './config';
import i18n from '../i18n';
export interface ReservationData {
  carId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  userId?: number;
}

export interface Reservation {
  id: number;
  carId: number;
  carModel: string;
  carImage: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  dropoffDateTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  userId: number;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservation?: Reservation;
  error?: string;
}

class ReservationAPI {
  private baseURL = API_CONFIG.BASE_URL;

  async createReservation(
    reservationData: ReservationData,
    token: string
  ): Promise<ReservationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();
      
       if (!response.ok) {
        throw new Error(data.message || i18n.t('reservation:errors.create'));
      }
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || i18n.t('reservation:errors.create'),
        error: error.message,
      };
    }
  }

  async getUserReservations(token: string): Promise<Reservation[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/reservation/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Rezervasyonlar alınamadı');
      }

      return data.reservations || [];
    } catch (error) {
      console.error('Rezervasyonlar alınırken hata:', error);
      return [];
    }
  }

  async getReservationById(
    reservationId: number,
    token: string
  ): Promise<Reservation | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/reservation/${reservationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Rezervasyon bulunamadı');
      }

      return data.reservation;
    } catch (error) {
      console.error('Rezervasyon alınırken hata:', error);
      return null;
    }
  }

   async deleteReservation(
    reservationId: number,
    token: string
  ): Promise<ReservationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/reservation/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Rezervasyon silinemedi');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Rezervasyon silinirken hata oluştu',
        error: error.message,
      };
    }
  }

  async updateReservation(
    reservationId: number,
    updateData: Partial<ReservationData>,
    token: string
  ): Promise<ReservationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/reservation/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Rezervasyon güncellenemedi');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Rezervasyon güncellenirken hata oluştu',
        error: error.message,
      };
    }
  }

async searchAvailableCars(searchParams: {
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    dropoff_date: string;
    pickup_time: string;
    dropoff_time: string;
  }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams(searchParams as any);
      const response = await fetch(`${this.baseURL}/api/cars/search?${queryParams}`);


      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Araçlar aranırken hata oluştu');
      }

      return data.cars || [];
    } catch (error) {
      console.error('Araç arama hatası:', error);
      return [];
    }
  }
}

export const reservationAPI = new ReservationAPI();
