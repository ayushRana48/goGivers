import React, { useEffect, useState } from 'react';
import {View, Text} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import 'react-native-url-polyfill/auto'
import { useDontUseContext } from '../../../DontUseContext';
import { useUserContext } from '../../../../UserContext';


const Profile = ({navigation}:any) => {


  //@ts-ignore
  const [username,setUsername]= useState(useRoute()?.params?.username)
  const [missingScope,setMissingScope]=useState(false)
  const { setName,name } = useDontUseContext();
  const {user,setUser}= useUserContext();

  
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
            "username":name,
            "refresh":authState.refreshToken
          },
          response:true
        })
        .then((response) =>{
          const newUser ={...user,stravaRefresh:authState.refreshToken}
          setUser(newUser);
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
      setName("");
      const x=await Auth.signOut()
      navigation.navigate('SignIn');
      setUser();

    }
    catch(error){
      console.log(error)
    }
    
  };

  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Home</Text>
      <View style={{marginTop:60}}>
        <Text style={{fontSize: 24, alignSelf: 'center'}}>Welcome {name}</Text>
        <Text style={{fontSize: 18, alignSelf: 'center',marginTop:20}}>Total Miles: {user.totalMileage}</Text>
        <View style={{marginTop:60}}>
          <CustomButton text="Logout" onPress={Logout} type={'primary'} />
        </View>
      </View>

    </View>
  );

};

export default Profile;
