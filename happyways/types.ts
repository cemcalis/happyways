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
    car_id: number;
    car_model: string;
    car_price: string;
    pickup_date: string;
    dropoff_date: string;
    pickup_time: string;
    dropoff_time: string;
    pickup_location: string;
    dropoff_location: string;
    user_email?: string;
    source?: string;
  };
  AllCarsPage: {
    searchParams?: {
      pickup_location: string;
      dropoff_location: string;
      pickup_date: string;
      dropoff_date: string;
      pickup_time: string;
      dropoff_time: string;
    };
    campaignDiscount?: number;
    user_email?: string;
    source?: string;
  };
  PaymentPage: {
    car_id: number;
    car_model?: string;
    car_price?: string;
    pickup_date?: string;
    dropoff_date?: string;
    pickup_time?: string;
    dropoff_time?: string;
    pickup_location?: string;
    dropoff_location?: string;
    source?: string;
    user_email?: string;
    extra_driver?: boolean;
    extra_driver_price?: string;
    insurance?: boolean;
    insurance_price?: string;
    total_price?: string;
    total_days?: string;
    base_price?: string;

  };
  ReservationPage: {
    car_id?: number;
    car_model?: string;
    car_price?: string;
    base_price?: string;
    extra_driver_price?: string;
    extra_driver_selected?: boolean;
    total_days?: number;
    pickup_date?: string;
    dropoff_date?: string;
    pickup_time?: string;
    dropoff_time?: string;
    pickup_location?: string;
    dropoff_location?: string;
    prefilled_data?: any;
    source?: string;
    user_email?: string;
  };
 ReservationSummaryPage: {
    reservationId: number;
    fallback?: {
      id: number;
      car_id: number;
      model: string;
      year: number | string;
      image: string;
      pickup_location: string;
      dropoff_location: string;
      pickup_date: string;
      dropoff_date: string;
      pickup_time: string;
      dropoff_time: string;
      total_price: string;
      status: string;
      duration: string;
      status_info?: { status: string; message: string; color: string; icon: string };
    };
  };


  CarsDetailPage: {
    car_id: number;
    pickup_location?: string;
    dropoff_location?: string;
    pickup_date?: string;
    dropoff_date?: string;
    pickup_time?: string;
    dropoff_time?: string;
    source?: string;
    user_email?: string;
  };
  TapBar : undefined;
  CampaignDetailPage: { campaignId: number };
  ContactPage: undefined;
  MePage: undefined;
  MineReservationPage:undefined;
  
}