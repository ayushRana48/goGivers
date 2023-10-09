import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Groups from './screens/MainScreens/Groups/GroupsNav';
import Profile from './screens/MainScreens/ProfileScreen';
import { useDontUseContext } from './DontUseContext';
import { useEffect } from 'react';
import { API } from 'aws-amplify';
import { useUserContext } from '../UserContext';
import ActivitiesNav from './screens/MainScreens/ActivityScreen/ActivitesNav';

const Tab = createBottomTabNavigator();



export default function MainNav() {

  const { name } = useDontUseContext();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const fetchData = () => {
      const url = `/goGivers/users/getUser?username=${name}`;

      API.get('goGivers', url, {
        response: true
      })
        .then(response => {
          setUser(response.data.user);
          console.log(response.data.user, "fsfdffsf");
          // Call updateMileage inside the .then block of setUser
          updateMileage(response.data.user);
        })
        .catch(error => {
          console.log("FFFerroreee",error);
        });
    };

    const updateMileage = (updatedUser:any) => {
      const url = `/goGivers/users/updateTotalMile`;
      console.log({
        "username": updatedUser.id,
          "currTotalMile": updatedUser.totalMileage,
          "lastStravaCheck": updatedUser.lastStravaCheck,
          "refresh": updatedUser.stravaRefresh,
          "createdAt": updatedUser.createdAt,
      })
      API.put('goGivers', url, {
        response: true,
        body: {
          "username": updatedUser.id,
          "currTotalMile": 0,
          "refresh": updatedUser.stravaRefresh,
          "createdAt": updatedUser.createdAt,
        }
      })
        .then(response => {
          const newUser = { ...updatedUser, totalMileage: response.data.distanceUpdate };
          setUser(newUser);
          console.log(response.data)
        })
        .catch(error => {
          console.log("erroreee",error);
        });
    };

    fetchData();
  }, []);



  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Activity" component={ActivitiesNav} />
      <Tab.Screen name="Groups" component={Groups} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}