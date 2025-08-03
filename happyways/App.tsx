import "./global.css";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator as StackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackParamList } from "./types";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthGuard from "./Components/AuthGuard/AuthGuard";

import RegisterPage from "./src/screens/RegisterPage/RegisterPage";
import LoginPage from "./src/screens/LoginPage/LoginPage";
import HomePage from "./src/screens/MainPage/HomePage/HomePage";
import InfoPage from "./src/screens/InfoPage/InfoPage";
import Otp from "./src/screens/OtpPage/Otp";
import ForgetPasswordPage from "./src/screens/ForgetPasswordPage/ForgetPasswordPage";
import ResetPassword from "./src/screens/ResetPasswordPage/ResetPassword";
import CampaignPage from "./src/screens/MainPage/CampaignPage/CapmaignPage/CampaignPage";
import AllCarsPage from "./src/screens/MainPage/CarsPage/AllCarsPage/AllCarsPage";
import CarsDetailPage from "./src/screens/MainPage/CarsPage/CarsDetailPage/CarsDetailPage";
import PaymentPage from "./src/screens/MainPage/PaymentPage/PaymentPage";
import ReservationPage from "./src//screens/MainPage/ReservationPage/ReservationPage";
import CampaignDetailPage from "./src/screens/MainPage/CampaignPage/CampaignDetailPage/CampaignDetailPage";
import MineReservationPage from "./src/screens/MainPage/ProfilePage/reservation/mineReservation";
import MePage from "./src/screens/MainPage/ProfilePage/me/me";
import ContactPage from "./src/screens/MainPage/ProfilePage/contact/contact";
import ProfilePage from "./src/screens/MainPage/ProfilePage/account/account";


const Tab = createBottomTabNavigator();
const Stack = StackNavigator<RootStackParamList>();

// Protected Screen Wrapper
const ProtectedScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        
        const userJson = await AsyncStorage.getItem("currentUser");
        if (userJson) {
          setInitialRoute("HomePage");
        } else {
          setInitialRoute("InfoPage"); 
        }
      } catch (error) {
        console.error("Session check error:", error);
        setInitialRoute("InfoPage");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  
  if (isLoading) {
    return (
      <View className="flex-1 bg-orange-500 justify-center items-center">
        
        <View className="items-center">
          
          <Image 
            source={require('./assets/WelcomePage/Logo.png')}
            className="w-16 h-16 mb-4"
            resizeMode="contain"
          />
          
          
          <Text className="text-white text-3xl font-bold tracking-wide">
            Happy Ways
          </Text>
          
          
          <Text className="text-white/90 text-base font-medium mt-1 tracking-wider">
            Happiest Way to Rent a Car
          </Text>
        </View>
        
        
        <View className="absolute top-64">
          <View className="w-2 h-2 bg-white/60 rounded-full"></View>
        </View>
      </View>
    );
  }

  if (initialRoute === null) {
    
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute || "InfoPage"}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
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
        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
