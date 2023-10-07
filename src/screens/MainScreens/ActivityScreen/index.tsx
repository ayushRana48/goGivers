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
import Donations from './components/Donations';
const Activity = ({navigation}:any) => {

 
  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Activity</Text>
      <Invites navigation={navigation}></Invites>
      <Donations navigation={navigation}></Donations>

    </View>
  );

};

export default Activity;
