import "./global.css";
import { Text, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackParamList } from "./types";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";

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
        <AppNavigator initialRoute={initialRoute} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
