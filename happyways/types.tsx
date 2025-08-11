export type RootStackParamList = {
  HomePage: undefined;
  RegisterPage: undefined;
  LoginPage: undefined;
  InfoPage : undefined;
  OtpPage: { email: string }; 
  ResetPasswordPage:{ email: string };
  ForgetPasswordPage: { email: string };
  ProfilePage: undefined;
  CampaignPage: undefined;
  NotificationPage: undefined;
  AdditionalRequests: {
    carId: number;
    carModel: string;
    carPrice: string;
    pickupDate: string;
    dropDate: string;
    pickupTime: string;
    dropTime: string;
    pickup: string;
    drop: string;
    source?: string; // Nereden geldiğini takip etmek için
  };
  AllCarsPage: { 
    searchParams?: {
      pickup: string;
      drop: string;
      pickupDate: string;
      dropDate: string;
      pickupTime: string;
      dropTime: string;
    };
    campaignDiscount?: number;
    source?: string; // Nereden geldiğini takip etmek için
  };
  PaymentPage: {
    carId: number;
    carModel?: string;
    carPrice?: string; // Günlük araç fiyatı
    pickupDate?: string;
    dropDate?: string;
    pickupTime?: string;
    dropTime?: string;
    pickup?: string;
    drop?: string;
    source?: string; // Nereden geldiğini takip etmek için
    extraDriver?: boolean; // Ek sürücü seçimi
    extraDriverPrice?: string; // Ek sürücü fiyatı
    insurance?: boolean; // Sigorta seçimi
    insurancePrice?: string; // Sigorta fiyatı
    totalPrice?: string; // Toplam fiyat
    totalDays?: string; // Toplam gün sayısı
    basePrice?: string; // Araç için toplam fiyat (günlük × gün sayısı)
  };
  ReservationPage: {
    carId?: number;
    carModel?: string;
    carPrice?: string;
    basePrice?: string;
    extraDriverPrice?: string;
    extraDriverSelected?: boolean;
    totalDays?: number;
    pickupDate?: string;
    dropDate?: string;
    pickupTime?: string;
    dropTime?: string;
    pickup?: string;
    drop?: string;
    prefilledData?: any;
    source?: string; // Nereden geldiğini takip etmek için
  };
  CarsDetailPage: { 
    carId: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    dropoffDate?: string;
    pickupTime?: string;
    dropoffTime?: string;
    source?: string; // Nereden geldiğini takip etmek için
  };
  TapBar : undefined;
  CampaignDetailPage: { campaignId: number };
  ContactPage: undefined;
  MePage: undefined;
  MineReservationPage:undefined;
  
}
