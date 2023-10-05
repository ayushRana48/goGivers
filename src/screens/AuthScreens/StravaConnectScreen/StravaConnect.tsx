import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import 'react-native-url-polyfill/auto'
import { useDontUseContext } from '../../../DontUseContext';
import { useUserContext } from '../../../../UserContext';


const StravaConnectScreen = ({navigation}:any) => {


  //@ts-ignore
  const [username,setUsername]= useState(useRoute()?.params?.username)
  const { setName,name } = useDontUseContext();
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    console.log(name);
    const fetchData = () => {
        const url = `/goGivers/users/getUser?username=${name}`;
  
        API.get('goGivers', url, {
          response: true
        })
          .then(response => {
            console.log(response.data.user, "fsfdffsf");
            if(response.data.user.stravaRefresh){
                navigation.navigate('MainNav',{name});
            }
            setLoading(false);

          })
          .catch(error => {
            console.log("FFFerroreee",error);
          });
      };
      fetchData();
  },[])

  
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
        await API.put('goGivers', '/goGivers/users/addStravaRefresh', {
          body:{
            "username":name,
            "refresh":authState.refreshToken
          },
          response:true
        })
        .then((response) =>{
            navigation.navigate('MainNav',{username});
        })
        .catch((e) => {
          console.log("not working", e);
        });
      }
      else{
        (true)
      }
    }
    catch(error){
      console.log(error)
    } 
  }




  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Connect to Strava</Text>
      { loading? <ActivityIndicator color="blue"></ActivityIndicator>:
      <View style={{marginTop:60}}>
        <CustomButton text='Connect to Strava' onPress={getAuth} type={'primary'} bgColor='#FC4C02' color='white'></CustomButton>
      </View>
    }

    </View>
  );

};

export default StravaConnectScreen;
