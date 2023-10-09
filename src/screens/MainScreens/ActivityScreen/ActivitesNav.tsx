import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Activity from '.';
import Donations from './DonationScreen';

const ActivitiesNav = ({navigation}:any) => {

  const Stack = createNativeStackNavigator();

  return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name = "Activity" component={Activity}/>
          <Stack.Screen name = "Donations" component={Donations}/>
        </Stack.Navigator>
  );
};

export default ActivitiesNav;
