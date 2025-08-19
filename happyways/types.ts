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