import { View, Text, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../assets/themes';
export default function PreparingOrder() {
    const navigation = useNavigation();
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('DeliveryScreen');
        },10000);
    },[])
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/delivery.gif')}
            style={{ height: 350, width: 350 }}  // Adjust the height and width as needed
          />
        </View>
  )
}