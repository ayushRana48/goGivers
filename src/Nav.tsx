import * as React from 'react';
import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './screens/AuthScreens/SignInScreen/SignInScreen';
import SignUpScreen from './screens/AuthScreens/SignUpScreen/SignUpScreen';
import ResetScreen from './screens/AuthScreens/ResetScreen/ResetScreen';
import ConfirmScreen from './screens/AuthScreens/ConfirmScreen/Confirm';
import MainNav from './MainNav';
import StravaConnectScreen from './screens/AuthScreens/StravaConnectScreen/StravaConnect';
export default function Nav() {
    const Stack = createNativeStackNavigator();
  
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  },
};
  return (
    <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false } }>
            <Stack.Screen name = "SignIn" component={SignInScreen}/>
            <Stack.Screen name = "SignUp" component={SignUpScreen}/>
            <Stack.Screen name = "ForgotPassword" component={ResetScreen}/>
            <Stack.Screen name = "ConfirmEmail" component={ConfirmScreen}/>
            <Stack.Screen name = "StravaConnect" component={StravaConnectScreen}/>
            <Stack.Screen name = "MainNav" component={MainNav}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}