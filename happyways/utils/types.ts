export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

export interface UserPreferences {
  language: 'tr' | 'en';
  currency: 'TRY' | 'USD' | 'EUR';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

export interface UserStatistics {
  totalReservations: number;
  totalSpent: number;
  favoriteCarType: string;
  memberSince: string;
}
export interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  price: number;
  dailyPrice: number;
  image: string;
  images?: string[];
  gear: 'Manual' | 'Automatic';
  fuel: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
  seats: number;
  baggage: number;
  ac: boolean;
  available: boolean;
  features?: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Location {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  type: 'airport' | 'city' | 'hotel' | 'station';
  isActive: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  subtitle1?: string;
  subtitle2?: string;
  discountPercent?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  conditions?: string;
}

export interface ReservationDetails {
  id: number;
  car_id: number;
  car: Car;
  user_id: number;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  total_price: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export type ReservationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'active' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export interface SearchParams {
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;

}

export interface SearchResult {
  cars: Car[];
  totalCount: number;
  filters: SearchFilters;
}

export interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  carTypes: string[];
  features: string[];
  sortBy: 'price' | 'rating' | 'year' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateForm {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
cardHolderFirstName: string;
  cardHolderLastName: string;
  use3DSecure: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormErrors {
  [field: string]: string;
}








// Rezervasyon Detay endpoint’i yok
// Backend route.js’te GET /api/reservation/:id tanımı yok. Detay sayfası hep fallback ile çalıştığı için kullanıcı/şartlar/ödeme kalemleri gibi alanlar boş kalıyor.

// Süre (NaN saat) ve Invalid Date
// Backend’te calculateDuration() **new Date(\${pickup_date}T${time}`)** ile parse ediyor. pickup_date ISO değilse (DD.MM.YYYYvb.)Invalid Date→NaN` üretiyor. Bu da “NaN saat” sorununa neden oluyor.
// (Aynı neden, ekranda Invalid Date görülmesine de yol açıyor.)

// mineReservation.tsx ve reservationsummary.tsx
// İçerik kararlı değil (bazı satırlar bozulmuş/eksik). Filtre–sıralama–navigasyon ve özet görünümü stabil hale getirildi.