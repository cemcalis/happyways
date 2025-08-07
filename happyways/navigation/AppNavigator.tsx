import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ScreenGroups } from "./screenGroups";


import RegisterPage from "../src/screens/RegisterPage/RegisterPage";
import LoginPage from "../src/screens/LoginPage/LoginPage";
import HomePage from "../src/screens/MainPage/HomePage/HomePage";
import InfoPage from "../src/screens/InfoPage/InfoPage";
import Otp from "../src/screens/OtpPage/Otp";
import ForgetPasswordPage from "../src/screens/ForgetPasswordPage/ForgetPasswordPage";
import ResetPassword from "../src/screens/ResetPasswordPage/ResetPassword";
import CampaignPage from "../src/screens/MainPage/CampaignPage/CapmaignPage/CampaignPage";
import AllCarsPage from "../src/screens/MainPage/CarsPage/AllCarsPage/AllCarsPage";
import CarsDetailPage from "../src/screens/MainPage/CarsPage/CarsDetailPage/CarsDetailPage";
import PaymentPage from "../src/screens/MainPage/PaymentPage/PaymentPage";
import ReservationPage from "../src/screens/MainPage/ReservationPage/ReservationPage";
import CampaignDetailPage from "../src/screens/MainPage/CampaignPage/CampaignDetailPage/CampaignDetailPage";
import MineReservationPage from "../src/screens/MainPage/ProfilePage/reservation/mineReservation";
import MePage from "../src/screens/MainPage/ProfilePage/me/me";
import ContactPage from "../src/screens/MainPage/ProfilePage/contact/contact";
import ProfilePage from "../src/screens/MainPage/ProfilePage/account/account";
import NotificationPage from "../src/screens/NotificationPage/NotificationPage";
import AdditionalRequests from "../src/screens/MainPage/CarsPage/AdditionalRequests/AdditionalRequests";


const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  initialRoute: keyof RootStackParamList;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ initialRoute }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* ===== AUTH SCREENS ===== */}
        <Stack.Group>
          <Stack.Screen
            name="InfoPage"
            component={InfoPage}
            options={{ 
              headerShown: false,
              animation: 'fade_from_bottom',
              animationDuration: 400,
            }}
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 350,
            }}
          />
          <Stack.Screen
            name="RegisterPage"
            component={RegisterPage}
            options={{ 
              headerShown: false,
              animation: 'slide_from_left',
              animationDuration: 350,
            }}
          />
          <Stack.Screen
            name="ForgetPasswordPage"
            component={ForgetPasswordPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPasswordPage"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OtpPage"
            component={Otp}
            options={{ headerShown: false }}
          />
        </Stack.Group>

        {/* ===== MAIN APP SCREENS ===== */}
        <Stack.Group>
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllCarsPage"
            component={AllCarsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
          name="AdditionalRequests"
          component={AdditionalRequests}
          options={{ headerShown: false }}
          />
      
          
          <Stack.Screen
            name="ReservationPage"
            component={ReservationPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CampaignPage"
            component={CampaignPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CampaignDetailPage"
            component={CampaignDetailPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentPage"
            component={PaymentPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CarsDetailPage"
            component={CarsDetailPage}
            options={{ headerShown: false }}
          />
        </Stack.Group>

        {/* ===== PROFILE SCREENS ===== */}
        <Stack.Group>
          <Stack.Screen
            name="ContactPage"
            component={ContactPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MePage"
            component={MePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MineReservationPage"
            component={MineReservationPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotificationPage"
            component={NotificationPage}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
