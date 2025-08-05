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
  AllCarsPage: { 
    searchParams?: {
      pickup: string;
      drop: string;
      pickupDate: string;
      dropDate: string;
      pickupTime: string;
      dropTime: string;
    }
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
  };
  ReservationPage: {
    carId: number;
    carModel: string;
    carPrice: string;
    pickupDate: string;
    dropDate: string;
    pickupTime: string;
    dropTime: string;
    pickup: string;
    drop: string;
  };
  CarsDetailPage: { 
    carId: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupDate?: string;
    dropoffDate?: string;
    pickupTime?: string;
    dropoffTime?: string;
  };
  TapBar : undefined;
  CampaignDetailPage: { campaignId: number };
  ContactPage: undefined;
  MePage: undefined;
  MineReservationPage:undefined;
  
}
