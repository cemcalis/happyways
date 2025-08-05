import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../types';

import EarthSvg from "../../../../../assets/account/earth.svg";
import MoneySvg from "../../../../../assets/account/money.svg";
import ThemaSvg from "../../../../../assets/account/thema.svg";
import LinkedinSvg from "../../../../../assets/account/linkedin.svg";
import IgSvg from "../../../../../assets/account/ig.svg";
import XSvg from "../../../../../assets/account/x.svg";
import YoutubeSvg from "../../../../../assets/account/youtube.svg";
import FacebookSvg from "../../../../../assets/account/facebook.svg";

type ProfilePageProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ProfilePage">;
};

const AccountPage = ({ navigation }: ProfilePageProp) => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
 
        <Text className="text-center text-lg font-semibold my-3 text-[#000000]">Hesabım</Text>

       
        <TouchableOpacity className="px-4 py-4 border-b border-gray-200 flex-row justify-between mb-[16px]"
         onPress={() => navigation.navigate("MePage")}
        >
          <Text className="text-base text-[#000000]">Üyelik Bilgilerim</Text>
          <Text className="text-gray-400">{'>'}</Text>
        </TouchableOpacity>

        
        <TouchableOpacity className="px-4 py-4 border-b border-gray-200 flex-row justify-between mb-[16px]"
         onPress={() => navigation.navigate("MineReservationPage")}
        >
          <Text className="text-base text-[#000000]">Rezervasyonlarım</Text>
          <Text className="text-gray-400">{'>'}</Text>
        </TouchableOpacity>

       
        <View className="px-4 mb-[10px]">
          <Text className="text-[#FE5502] font-semibold mb-3">Ayarlar</Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-row items-center space-x-3">
              <EarthSvg width={20} height={20} />
              <Text className="text-[#000000]">Dil</Text>
            </View>
            <Text className="text-[#565656]">Türkçe</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <View className="flex-row items-center space-x-3">
              <MoneySvg width={20} height={20} />
              <Text className="text-[#000000]">Para Birimi</Text>
            </View>
            <Text className="text-[#565656]">₺ TRY</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center space-x-3">
              <ThemaSvg width={20} height={20} />
              <Text className="text-[#000000]">Tema</Text>
            </View>
            <Text className="text-[#565656]">Açık</Text>
          </TouchableOpacity>
        </View>

       
        <TouchableOpacity className="mx-6 bg-[#FF0000] rounded-lg py-3 shadow-lg mb-[70px]">
          <Text className="text-white text-center text-base font-semibold">Çıkış</Text>
        </TouchableOpacity>

       
        <TouchableOpacity className="p-4 border-t border-gray-200 flex-row justify-between mb-[20px]"
        onPress={() => navigation.navigate("ContactPage")}
        >
          <Text className="text-base text-[#000000]">HappyWays İletişim</Text>
          <Text className="text-gray-400">{'>'}</Text>
        </TouchableOpacity>

       
        <View className="p-4 items-center">
          <Text className="text-[#565656] mb-3">Sosyal Medya Hesaplarımız</Text>
          <View className="flex-row space-x-6">
            <LinkedinSvg width={22} height={22} />
            <IgSvg width={22} height={22} />
            <XSvg width={22} height={22} />
            <YoutubeSvg width={22} height={22} />
            <FacebookSvg width={22} height={22} />
          </View>
          <Text className="text-gray-400 mt-3">Yazılım Versiyon</Text>
          <Text className="text-gray-400">01.01</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default AccountPage;
