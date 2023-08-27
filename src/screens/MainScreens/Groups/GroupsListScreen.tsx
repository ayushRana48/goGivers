import React, { useEffect, useState } from 'react';
import {View, Text, Button} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'


const GroupsListScreen = ({navigation}:any) => {
  
  function newGroup(){
    navigation.navigate('NewGroup');
  }
 
  return (
    <View style={{padding:40}}>
      <Text style={{fontSize: 24, alignSelf: 'center'} }>No Groups</Text>
      <CustomButton onPress={newGroup} text={"New Group"}/>
    </View>
  );

};

export default GroupsListScreen;
