// Authentication related navigation screens
export const AuthScreens = {
  InfoPage: "InfoPage",
  LoginPage: "LoginPage", 
  RegisterPage: "RegisterPage",
  ForgetPasswordPage: "ForgetPasswordPage",
  ResetPasswordPage: "ResetPasswordPage",
  OtpPage: "OtpPage"
} as const;

// Main app navigation screens
export const MainScreens = {
  HomePage: "HomePage",
  AllCarsPage: "AllCarsPage",
  ReservationPage: "ReservationPage", 
  CampaignPage: "CampaignPage",
  CampaignDetailPage: "CampaignDetailPage",
  PaymentPage: "PaymentPage",
  CarsDetailPage: "CarsDetailPage"
} as const;

// Profile related navigation screens
export const ProfileScreens = {
  ContactPage: "ContactPage",
  MePage: "MePage", 
  ProfilePage: "ProfilePage",
  MineReservationPage: "MineReservationPage",
  NotificationPage: "NotificationPage"
} as const;

// All screen groups combined
export const ScreenGroups = {
  Auth: AuthScreens,
  Main: MainScreens,
  Profile: ProfileScreens
} as const;
