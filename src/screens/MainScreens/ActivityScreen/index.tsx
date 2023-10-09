import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useNavigation, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth, API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import Invites from './components/Invites';
import Donations from './components/Donations';
import Charity from './components/Charity';
import { WebView } from 'react-native-webview';

const DonateButton = () => {
  return (
    <View >
      <WebView
                  source={{ uri: 'https://reactnative.dev/' }} 

      />
    </View>
  );
};

const Activity = ({ navigation }: any) => {


  return (
    <View style={{ padding: 40 }}>
      <Text style={{ fontSize: 24, alignSelf: 'center' }}>Activity</Text>
      <Invites navigation={navigation}></Invites>
      <Donations navigation={navigation}></Donations>
      {/* <Charity id="ds" navigation={navigation} name="Charrr" url="https://www.youtube.com/" imageUrl="https://res.cloudinary.com/everydotorg/image/upload/c_lfill,w_24,h_24,dpr_2/c_crop,ar_24:24/q_auto,f_auto,fl_progressive/profile_pics/juyuxardqr3azfksso7d"></Charity> */}
     </View>
  );

};

export default Activity;
