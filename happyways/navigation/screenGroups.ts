export const AuthScreens = {
  InfoPage: "InfoPage",
  LoginPage: "LoginPage", 
  RegisterPage: "RegisterPage",
  ForgetPasswordPage: "ForgetPasswordPage",
  ResetPasswordPage: "ResetPasswordPage",
  OtpPage: "OtpPage"
} as const;

export const MainScreens = {
  HomePage: "HomePage",
  AllCarsPage: "AllCarsPage",
  ReservationPage: "ReservationPage", 
  CampaignPage: "CampaignPage",
  CampaignDetailPage: "CampaignDetailPage",
  PaymentPage: "PaymentPage",
  CarsDetailPage: "CarsDetailPage"
} as const;

export const ProfileScreens = {
  ContactPage: "ContactPage",
  MePage: "MePage", 
  ProfilePage: "ProfilePage",
  MineReservationPage: "MineReservationPage",
  NotificationPage: "NotificationPage",
  ReservationSummaryPage: "ReservationSummaryPage"
} as const;


export const ScreenGroups = {
  Auth: AuthScreens,
  Main: MainScreens,
  Profile: ProfileScreens
} as const;
