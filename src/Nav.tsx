import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './screens/SignInScreen/SignInScreen';
import SignUpScreen from './screens/SignUpScreen/SignUpScreen';
import ResetScreen from './screens/ResetScreen/ResetScreen';
import ConfirmScreen from './screens/ConfirmScreen/Confirm';
import Home from './screens/HomeScreen';

export default function Nav() {
    const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <Stack.Navigator>
      
                <Stack.Screen name = "SignIn" component={SignInScreen}/>
                <Stack.Screen name = "SignUp" component={SignUpScreen}/>
                <Stack.Screen name = "ForgotPassword" component={ResetScreen}/>
                <Stack.Screen name = "ConfirmEmail" component={ConfirmScreen}/>
                <Stack.Screen name = "Home" component={Home}/>
            </Stack.Navigator>
    </NavigationContainer>
  );
}