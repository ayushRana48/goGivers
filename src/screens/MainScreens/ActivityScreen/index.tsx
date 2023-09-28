import React, { useEffect, useState } from 'react';
import {View, Text, Button} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import Invites from './components/Invites';
import { useDontUseContext } from '../../../../DontUseContext';


const Activity = ({ navigation }: any) => {

  const route = useRoute()
  //@ts-ignore

  const {name} = useDontUseContext()
  console.log(name, "fnzdsklgszAirb") 

  
  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Activity</Text>
      <Invites navigation={navigation} username={name} />
    </View>
  );

};

export default Activity;
