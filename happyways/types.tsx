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
    userEmail?: string;
    source?: string; 
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
    userEmail?: string;
    source?: string; 
  };
  PaymentPage: {
    carId: number;
    carModel?: string;
    carPrice?: string; 
    pickupDate?: string;
    dropDate?: string;
    pickupTime?: string;
    dropTime?: string;
    pickup?: string;
    drop?: string;
    source?: string; 
    userEmail?: string;
    extraDriver?: boolean; 
    extraDriverPrice?: string; 
    insurance?: boolean; 
    insurancePrice?: string; 
    totalPrice?: string; 
    totalDays?: string; 
    basePrice?: string; 
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
    source?: string; 
    userEmail?: string;
  };
  CarsDetailPage: {
    carId: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    dropoffDate?: string;
    pickupTime?: string;
    dropoffTime?: string;
    source?: string; 
    userEmail?: string;
  };
  TapBar : undefined;
  CampaignDetailPage: { campaignId: number };
  ContactPage: undefined;
  MePage: undefined;
  MineReservationPage:undefined;
  
}