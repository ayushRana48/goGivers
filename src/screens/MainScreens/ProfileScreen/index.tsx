import React, { useEffect, useState } from 'react';
import {View, Text, Button} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import { useUserContext } from '../../../../UserContext';
import 'react-native-url-polyfill/auto'
import { useDontUseContext } from '../../../../DontUseContext';


const Profile = ({navigation}:any) => {


  //@ts-ignore
  const [username,setUsername]= useState(useRoute()?.params?.username)
  const [missingScope,setMissingScope]=useState(false)
  const { setUser,user } = useUserContext();
  const {setName} = useDontUseContext();

  
  
  const getAuth =async() =>{  
    const client_id='111319'
    const client_secret='b03bfa9b476ff3e1536d632e33224d6b23f0f506';
    const config = {
      clientId: client_id,
      clientSecret: client_secret,
      redirectUrl: 'com.gogivers://com.gogivers',
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}`,
      },
      scopes: ['activity:read_all'],
    };
    
    try{
      const authState = await authorize(config);
     
      if(authState.scopes[0].includes("activity:read_all") && authState.refreshToken!=null){
        setMissingScope(false)
        await API.put('goGivers', '/goGivers/users/addStravaRefresh', {
          body:{
            "username":user.id,
            "refresh":authState.refreshToken
          },
          response:true
        })
        .then((response) =>{

        })
        .catch((e) => {
          console.log("not working", e);
        });
      }
      else{
        setMissingScope(true)
      }
    }

    catch(error){
      console.log(error)
    } 
  }


  const Logout = async () => {
    try{
      const x=await Auth.signOut()
      navigation.navigate('SignIn');
      setUser();
      setName("")

    }
    catch(error){
      console.log(error)
    }
    
  };

  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Home</Text>
      <View style={{marginTop:60}}>
        <CustomButton text='Connect to Strava' onPress={getAuth} type={'primary'} bgColor='#FC4C02' color='white'></CustomButton>
        {missingScope?<Text style={{fontSize: 12, alignSelf: 'center', color:'red'}}>Missing read all scope. Try Strava Auth Again</Text>
        :<Text style={{fontSize: 24, alignSelf: 'center'}}>Welcome {user.id}</Text>}

        <Text>{user.totalMileage? user.totalMileage : 0} miles</Text>
        <View style={{marginTop:60}}>
          <CustomButton text="Logout" onPress={Logout} type={'primary'} />
        </View>
      </View>

    </View>
  );

};

export default Profile;
