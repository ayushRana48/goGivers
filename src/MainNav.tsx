import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Groups from './screens/MainScreens/Groups/GroupsNav';
import Activity from './screens/MainScreens/ActivityScreen';
import Profile from './screens/MainScreens/ProfileScreen';
import { useDontUseContext } from './DontUseContext';
import { useEffect } from 'react';
import { API } from 'aws-amplify';
import { useUserContext } from '../UserContext';

const Tab = createBottomTabNavigator();



export default function MainNav() {

  const {name} = useDontUseContext();
  const {setUser} = useUserContext();

  useEffect(()=>{
    const fetchData = async () => {
      console.log(name, "from the mainNAVVAai");
      try {
          const url = `/goGivers/users/getUser?username=${name}`;
          console.log(url);
          const response = await API.get('goGivers', url, {
              response: true
          });
          setUser(response.data.user);
          console.log(response.data.user, "fsfdffsf");
          
      } catch (error) {
          console.log(error)
      }
  };

  fetchData();
  },[])

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Activity" component={Activity} />
          <Tab.Screen name="Groups" component={Groups} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
  }