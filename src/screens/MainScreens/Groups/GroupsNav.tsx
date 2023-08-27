import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsListScreen from './GroupsListScreen';
import NewGroupScreen from './NewGroupScreen';

const GroupsNav = ({navigation}:any) => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name = "GroupList" component={GroupsListScreen}/>
        <Stack.Screen name = "NewGroup" component={NewGroupScreen}/>
      </Stack.Navigator>
  );

};

export default GroupsNav;
