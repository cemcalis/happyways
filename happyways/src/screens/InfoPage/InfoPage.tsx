import BackButton from "../../../Components/BackButton/BackButton";
import { Text, TouchableOpacity, View, ImageBackground, Image, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import LeftArrowSvg from "../../../assets/HomePage/leftarrow.svg";
import { useTranslation } from "react-i18next";

type InfoPageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "InfoPage">;
};

const InfoPage = ({ navigation }: InfoPageProp) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { t } = useTranslation('common');

  useEffect(() => {
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNavigateToLogin = () => {
   
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("LoginPage");
    });
  };
  return (
    <ImageBackground
      source={require("../../../assets/InfoPage/car.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 justify-between">
        <BackButton onPress={() => navigation.goBack()} />
        <View className="items-center mt-8">
          <Image
            source={require("../../../assets/InfoPage/Logo.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

       
        <Animated.View 
          className="px-6 pb-12"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text className="text-white text-4xl font-bold leading-tight mb-4">
            {t('infoPage.title')}
          </Text>
          <Text className="text-white/80 text-base leading-relaxed mb-8">
            {t('infoPage.description')}
          </Text>
          <Text className="text-white/80 text-base leading-relaxed mb-8">
            {t('infoPage.callToAction')}
          </Text>

   <TouchableOpacity
  onPress={handleNavigateToLogin}
  activeOpacity={0.8}
  className="w-14 h-14 rounded-full bg-orange-500 items-center justify-center self-end shadow-md active:bg-orange-600 active:scale-95"
>
  <LeftArrowSvg 
    width={24} 
    height={24} 
    fill="#FFFFFF" 
    style={{ transform: [{ rotate: '180deg' }] }} 
  />
</TouchableOpacity>

         
          
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default InfoPage;
