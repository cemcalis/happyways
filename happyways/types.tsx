export type RootStackParamList = {
  HomePage: undefined;
  RegisterPage: undefined;
  LoginPage: undefined;
  InfoPage : undefined;
  OtpPage: { email: string }; 
  ResetPasswordPage:{ email: string };
  ForgetPasswordPage: { email: string };
  ProfilePage: undefined;
  CampaignPage: { id: number };
  AllCarsPage: {carId: number };
  PaymentPage: undefined;
  ReservationPage: undefined;
  CarsDetailPage: { carId: number };
  TapBar : undefined;
  CampaignDetailPage: undefined;
  ContactPage: undefined;
  MePage: undefined;
  MineReservationPage:undefined;
  
}
