import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsListScreen from './GroupsListScreen';
import NewGroupScreen from './NewGroupScreen';
import GroupScreen from './GroupScreen'
import GroupSettings from './GroupSettings';
import InviteSearch from './components/InviteSearch';
import { GroupsProvider } from './GroupsContext';

const GroupsNav = ({navigation}:any) => {

  const Stack = createNativeStackNavigator();

  return (
    <GroupsProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name = "GroupList" component={GroupsListScreen}/>
          <Stack.Screen name = "GroupScreen" component={GroupScreen}/>
          <Stack.Screen name = "NewGroup" component={NewGroupScreen}/>
          <Stack.Screen name = "GroupSettings" component={GroupSettings}/>
          <Stack.Screen name = "InviteSearch" component={InviteSearch}/>


        </Stack.Navigator>
    </GroupsProvider>
  );

};

export default GroupsNav;
