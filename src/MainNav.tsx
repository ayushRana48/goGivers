import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Groups from './screens/MainScreens/Groups/GroupsNav';
import Activity from './screens/MainScreens/ActivityScreen';
import Profile from './screens/MainScreens/ProfileScreen';

const Tab = createBottomTabNavigator();


export default function MainNav() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Activity" component={Activity} />
          <Tab.Screen name="Groups" component={Groups} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
  }