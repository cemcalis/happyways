import { Text, View, TouchableOpacity, Switch, Image, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '../../../../../Components/BackButton/BackButton'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../types'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTheme } from '../../../../../contexts/ThemeContext'
import TabBar from '../../../../../Components/TabBar/TapBar'
import ReservationCard from '../../../../../Components/ReservationCard/ReservationCard'
import { useTranslation } from 'react-i18next'
import { ENV } from '../../../../../utils/env'

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
  const route = useRoute<RouteProp<RootStackParamList, "AdditionalRequests">>();
  const { isDark } = useTheme();
  const { t } = useTranslation('cars');
  const { carId, carModel, carPrice, pickupDate, dropDate, pickupTime, dropTime, pickup, drop, source, userEmail } = route.params;

  console.log('=== ROUTE PARAMS DEBUG ===');
  console.log('source:', source);
  console.log('pickupDate:', pickupDate);
  console.log('dropDate:', dropDate);
  console.log('pickupTime:', pickupTime);
  console.log('dropTime:', dropTime);
  console.log('=== END ROUTE PARAMS ===');

  const [extraDriver, setExtraDriver] = React.useState(false);
  const [insurance, setInsurance] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [priceData, setPriceData] = React.useState<PriceData | null>(null);
  
  
  const calculateDays = () => {
    console.log('=== CALCULATE DAYS DEBUG ===');
    console.log('pickupDate:', pickupDate);
    console.log('dropDate:', dropDate);
    
    if (!pickupDate || !dropDate) {
      console.log('Missing dates, returning 1');
      return 1;
    }
    
    
    console.log('pickupDate type:', typeof pickupDate);
    console.log('dropDate type:', typeof dropDate);
    
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropDate);
    
    console.log('Pickup date object:', pickup);
    console.log('Dropoff date object:', dropoff);
    console.log('Pickup valid:', !isNaN(pickup.getTime()));
    console.log('Dropoff valid:', !isNaN(dropoff.getTime()));
    
    const timeDiff = dropoff.getTime() - pickup.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    console.log('Time diff (ms):', timeDiff);
    console.log('Days calculated:', daysDiff);
    console.log('Final result:', daysDiff > 0 ? daysDiff : 1);
    console.log('=== END DEBUG ===');
    
    return daysDiff > 0 ? daysDiff : 1;
  };

  const totalDays = calculateDays();
  console.log('Final totalDays:', totalDays);
  

  const extractPrice = (priceString: string) => {
    if (!priceString) return 200; 
    

    const numericPrice = parseFloat(priceString);
    if (!isNaN(numericPrice)) {
      console.log('Direct parse successful:', numericPrice);
      return numericPrice;
    }
    
    const numericString = priceString.replace(/[^0-9.]/g, '');
    const price = parseFloat(numericString);
    
    console.log('Original carPrice:', priceString);
    console.log('Extracted numeric:', numericString);
    console.log('Final price:', price);
    
    return isNaN(price) ? 200 : price;
  };
  
  const dailyCarPrice = extractPrice(carPrice);
  const basePrice = dailyCarPrice * totalDays; 
  const dailyExtraDriverPrice = 99.00; 
  const extraDriverPrice = dailyExtraDriverPrice * totalDays; 


  const toggleExtraDriver = () => {
    setExtraDriver(!extraDriver);
  }; 

  const calculatePrice = async () => {
    try {
      setLoading(true);
      
      setPriceData({
        basePrice,
        totalDays,
        extraDriver: {
          selected: extraDriver,
          price: extraDriver ? extraDriverPrice : 0
        },
        insurance: {
          selected: insurance,
          rate: 0.1,
          price: insurance ? (basePrice * 0.1) : 0
        },
        finalPrice: basePrice + (extraDriver ? extraDriverPrice : 0) + (insurance ? (basePrice * 0.1) : 0)
      });
    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    calculatePrice();
  }, [extraDriver, insurance]);

  const extraDriverTotal = extraDriver ? extraDriverPrice : 0;
  const insurancePrice = insurance ? (basePrice * 0.1) : 0; 
  const finalPrice = basePrice + extraDriverTotal + insurancePrice;

  const handleRentNow = async () => {
    try {
     const validationResponse = await fetch(`${ENV.API_BASE_URL}/api/cars/additional-services/validate`, {
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

      if (!validationResponse.ok) {
        const errorText = await validationResponse.text();
        try {
          const errData = JSON.parse(errorText);
          throw new Error(errData.message || 'Validation request failed');
        } catch {
          throw new Error(errorText);
        }
      }

      const validationResult = await validationResponse.json();

       if (validationResult.success) {
      navigation.navigate("PaymentPage", {
        carId: carId,
        carModel: carModel,
        carPrice: dailyCarPrice.toString(), 
        pickupDate: pickupDate,
        dropDate: dropDate,
        pickupTime: pickupTime,
        dropTime: dropTime,
        pickup: pickup,
        drop: drop,
        source: source,
        extraDriver: extraDriver,
        extraDriverPrice: extraDriverTotal.toString(),
        insurance: insurance,
        insurancePrice: insurancePrice.toString(),
        totalPrice: finalPrice.toString(),
        totalDays: totalDays.toString(),
        basePrice: basePrice.toString(),
        userEmail,
      
      });
    }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>

      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className={`text-2xl ${isDark ? 'text-white' : 'text-black'}`}>←</Text>
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'} ml-4`}>{t('carDetails')}</Text>
      </View>

      <View className="flex-1">
   
        <View className="px-4 mb-4">
          <TouchableOpacity 
            onPress={toggleExtraDriver}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-100'} rounded-2xl p-4 border`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-orange-500 rounded-xl items-center justify-center mr-3">
                  <Image 
                    source={require("../../../../../assets/CarsPage/adddriver.png")} 
                    style={styles.iconImage}
                   
                  />
                </View>
                <View className="flex-1">
                  <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{t('extraDriver')}</Text>
                  <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{t('totalPrice')} ({totalDays} {t('days')}):</Text>
                  <Text className="text-orange-600 font-bold">₺ {extraDriverPrice.toFixed(2)}</Text>
                </View>
              </View>
            
              <View className={`w-12 h-6 rounded-full items-end justify-center pr-1 ${extraDriver ? 'bg-orange-500' : 'bg-gray-200'}`}>
                <View className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-all duration-200 ${extraDriver ? 'translate-x-0' : '-translate-x-5'}`}></View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

      
        <View className="flex-1 justify-center px-4">
          <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-4 shadow-sm border`}>
         
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{t('pickUp')}</Text>
                <Text className={`${isDark ? 'text-white' : 'text-black'} font-semibold text-lg`}>{pickup || "Ercan"}</Text>
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{pickupDate}, {pickupTime}</Text>
              </View>
              <View className={`w-8 h-0.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} mx-4`}></View>
              <View className="flex-1 items-end">
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{t('dropOff')}</Text>
                <Text className={`${isDark ? 'text-white' : 'text-black'} font-semibold text-lg`}>{drop || "Lefkoşa"}</Text>
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{dropDate}, {dropTime}</Text>
              </View>
            </View>

        
            <View className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-100'}`}>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{totalDays} {t('Days')}</Text>
              <Text className={`${isDark ? 'text-white' : 'text-black'} font-bold text-2xl`}>₺ {finalPrice.toFixed(2)}</Text>
              {extraDriver && (
                <Text className="text-orange-500 text-sm mt-1">
                  {t('extraDriver')} (+₺ {extraDriverTotal.toFixed(2)})
                </Text>
              )}
            </View>
          </View>
        </View>

    
        <View className="px-4 pb-4">
          <TouchableOpacity 
            className="bg-orange-500 rounded-xl py-4 active:opacity-80"
            onPress={handleRentNow}
            style={styles.shadowButton}
          >
            <Text className="text-white text-center font-bold text-lg">
              {t('rentNow')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TabBar navigation={navigation} activeRoute="AllCarsPage" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconImage: {
    width: 20,
    height: 20,

  },
});

export default AdditionalRequests