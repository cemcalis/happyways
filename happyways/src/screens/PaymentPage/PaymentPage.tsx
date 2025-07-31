import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'

type PaymentPageProp= {
  navigation:NativeStackNavigationProp<RootStackParamList,"PaymentPage">
}

const PaymentPage = ({navigation}:PaymentPageProp) => {
  return (
    <View>
      <Text>PaymentPage</Text>
    </View>
  )
}

export default PaymentPage

const styles = StyleSheet.create({})