import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Groups from './screens/MainScreens/Groups/GroupsNav';
import Activity from './screens/MainScreens/ActivityScreen';
import Profile from './screens/MainScreens/ProfileScreen';
import { useDontUseContext } from '../DontUseContext';
import { API } from 'aws-amplify';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();


export default function MainNav({navigation}:any) {
  const route = useRoute()

  const{name,setUser} = useDontUseContext()
  //@ts-ignore
  console.log("LK:DGJa;skdgj;OISDG     ",name)

  useEffect(()=>{
    const fetchData = async () => {
        console.log("FETCHINF DASTAAAf from MAINN NAVE")
        console.log(name)
        try {
            const url = `/goGivers/users/getAllUsers`;
            console.log(url)
            const response = await API.get('goGivers', url, {
                response: true
            });
          
            // setUser(response.data?.user);
            console.log(response.data)
            // setInvites(response.data?.user.invites); // Use response.data to set invites
            // updateMileage();
        } catch (error) {
            console.log("error getting usddserefff")
            console.log(error)
        }
    };

    
    fetchData()
},[])

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Activity" component={Activity} />
          <Tab.Screen name="Groups" component={Groups} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
  }