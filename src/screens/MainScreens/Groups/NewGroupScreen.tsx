import React, { useEffect, useState } from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../UserContext';

type newGroupType = {
    groupName: string;
    minMile: string; 
    minDays: string; 
    moneyMile: string; 
  };
  

const NewGroupScreen = ({navigation}:any) => {
    const {user } = useUserContext();

  const [groupInfo,setGroupInfo]= useState<newGroupType>({groupName:"",minMile:"",minDays:"",moneyMile:""})
  
  
  async function createGroup(){
    console.log("the host is", user);
    console.log(groupInfo);
    await API.post('usersAPI', '/users/groups/newGroup', {
        credentials: 'include',
        body:{
            "username":"NewUser",
            "groupName":";adovlksdjvlkasdf",
            "minMile":"4",
            "minDays":"2",
            "moneyMile":"3"
          },
        response:true
      })
      .then((response) => console.log(response,"fsfsf"))
      .catch((e) => {
        console.log("not working", e);
      });
  }


  function changeGroupInfo(attribute: keyof newGroupType, val: string) {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      [attribute]: val,
    }));
  }
 
  return (
    <View style={styles.container}>
      <CustomInput placeholder='Group Name' value={groupInfo.groupName} setValue={(value) => changeGroupInfo('groupName', value)} secureTextEntry={false}></CustomInput>

      <View style={styles.middleRow}>
        <CustomInput width={80} placeholder='Min Mile' value={groupInfo.minMile} setValue={(value) => changeGroupInfo('minMile', value)} secureTextEntry={false}></CustomInput>
        <CustomInput width={80} placeholder='Min Days' value={groupInfo.minDays} setValue={(value) => changeGroupInfo('minDays', value)} secureTextEntry={false}></CustomInput>
        <CustomInput width={80} placeholder='Money Mile' value={groupInfo.moneyMile} setValue={(value) => changeGroupInfo('moneyMile', value)} secureTextEntry={false}></CustomInput>

      </View>

      <CustomButton text='Create Group' type='primary' onPress={createGroup}></CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginTop:30,
  },
 
  middleRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  middleColumn: {
    flex: 0.3,
    height: 100, // Set your desired height
    backgroundColor: "green",
  },
  gap: {
    width: "10%",
  },
  bottomElement: {
    width: "80%",
    height: 100, // Set your desired height
    backgroundColor: "red",
  },
});


export default NewGroupScreen;




