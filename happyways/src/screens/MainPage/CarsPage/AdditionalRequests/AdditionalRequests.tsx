import { Text, View, TouchableOpacity, Switch, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '../../../../../Components/BackButton/BackButton'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../types'
import { useNavigation } from '@react-navigation/native'
import TabBar from '../../../../../Components/TabBar/TapBar'
import ReservationCard from '../../../../../Components/ReservationCard/ReservationCard'

type AdditionalRequestsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AdditionalRequests">;
};

type PriceData = {
  basePrice: number;
  totalDays: number;
  extraDriver: {
    selected: boolean;
    price: number;
  };
  insurance: {
    selected: boolean;
    rate: number;
    price: number;
  };
  finalPrice: number;
};

const AdditionalRequests = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "AdditionalRequests">>();

  const [extraDriver, setExtraDriver] = React.useState(false);
  const [insurance, setInsurance] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [priceData, setPriceData] = React.useState<PriceData | null>(null);
  
  const basePrice = 8000.00;
  const totalDays = 4;
  const extraDriverPrice = 297.00; 

  const calculatePrice = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.0.2.2:3000/api/cars/additional-services/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePrice,
          totalDays,
          extraDriver,
          insurance,
          carId: 1
        })
      });

      const result = await response.json();
      if (result.success) {
        setPriceData(result.data);
      }
    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    calculatePrice();
  }, [extraDriver, insurance]);

  const finalPrice = priceData?.finalPrice || basePrice;
  const extraDriverTotal = priceData?.extraDriver?.price || 0;
  const insuranceTotal = priceData?.insurance?.price || 0;

  const handleRentNow = async () => {
    try {

      const validationResponse = await fetch('http://10.0.2.2:3000/api/cars/additional-services/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extraDriver,
          insurance,
          carId: 1,
          pickupDate: "2024-04-17",
          dropDate: "2024-04-24"
        })
      });

      const validationResult = await validationResponse.json();
      
      if (validationResult.success) {
        navigation.navigate("ReservationPage", {
          carId: 1,
          carModel: "BMW X3",
          carPrice: finalPrice.toString(),
          pickupDate: "17 Nisan 2024",
          dropDate: "24 Nisan 2024",
          pickupTime: "14:00",
          dropTime: "14:00",
          pickup: "Ercan",
          drop: "Lefkoşa"
        });
      } else {
        console.error('Validation failed:', validationResult.errors);
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">

      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black ml-4">Araç Detayı</Text>
      </View>

      <View className="flex-1 px-4 py-2">

        <View className="bg-orange-50 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-orange-500 rounded-xl items-center justify-center mr-3">
                <Image 
                  source={require("../../../../../assets/CarsPage/adddriver.png")} 
                  style={{ width: 20, height: 20, tintColor: 'white' }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black">Ek Sürücü</Text>
                <Text className="text-gray-600 text-sm">Toplam Fiyat (3 Gün):</Text>
                <Text className="text-orange-600 font-bold">₺ 297.00</Text>
              </View>
            </View>
            <View className="w-12 h-6 bg-gray-200 rounded-full items-end justify-center pr-1">
              <View className="w-5 h-5 bg-white rounded-full shadow-sm"></View>
            </View>
          </View>
        </View>

        {/* Spacer - much more space */}
        <View style={{ height: 250 }} />

        {/* Rental Details */}
        <View className="mx-4">
          <ReservationCard
            pickupLocation="Ercan"
            dropoffLocation="Lefkoşa"
            pickupDate="Paz, 17 Nis"
            dropoffDate="Paz, 24 Nis"
            pickupTime="14:00"
            dropoffTime="14:00"
          />
        </View>

        {/* Rent Button */}
        <TouchableOpacity 
          className="bg-orange-500 rounded-xl py-4 shadow-lg active:opacity-80"
          onPress={handleRentNow}
        >
          <Text className="text-white text-center font-bold text-lg">
            Hemen Kirala
          </Text>
        </TouchableOpacity>
      </View>

      <TabBar navigation={navigation} activeRoute="AllCarsPage" />
    </SafeAreaView>
  )
}

export default AdditionalRequests