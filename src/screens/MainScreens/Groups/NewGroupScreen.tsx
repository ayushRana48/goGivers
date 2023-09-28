import React, { useEffect, useState } from 'react';
import {View, Text, Button, StyleSheet,Alert, Pressable, Image} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../UserContext';
import { useGroupsContext } from './GroupsContext';

type newGroupType = {
    groupName: string;
    minMile: string; 
    minDays: string; 
    moneyMile: string; 
  };
  

const NewGroupScreen = ({navigation}:any) => {
    const {user, setUser } = useUserContext();
    const {groupsData,setGroupsData}= useGroupsContext();


  const [groupInfo,setGroupInfo]= useState<newGroupType>({groupName:"",minMile:"",minDays:"",moneyMile:""})
  
  
  async function createGroup(){

  
    let alertMessage = "";

    if (groupInfo.groupName === "") {
      alertMessage += "Group Name is empty.";
    }

    else if (groupInfo.minMile === "") {
      alertMessage += "Minimum weekly miles is empty.\n";
    }

    else if (groupInfo.minDays === "") {
      alertMessage += "Minimum weekly days is empty.\n";
    }

    else if (groupInfo.moneyMile === "") {
      alertMessage += "Dollars per mile is empty.\n";
    }

    if(alertMessage!=""){
      Alert.alert("Whoops", alertMessage);
      return;
    }

    

    await API.post('goGivers', '/goGivers/groups/newGroup', {
        credentials: 'include',
        body:{
            "username":user.id,
            "groupName":groupInfo.groupName,
            "minMile":groupInfo.minMile,
            "minDays":groupInfo.minDays,
            "moneyMile":groupInfo.moneyMile
          },
        response:true
      })
      .then((response) => {
        const newList = [...groupsData];
        newList.push(response.data.newGroup.id);
        setGroupsData(newList)
        const newUser = {...user,groups:newList};
    
        setUser(newUser)

        navigation.navigate('GroupScreen', { groupId: response.data.newGroup.id });

      })
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
      <Text>{user.id} j</Text>
      <View style={{width:'90%'}}>
        <CustomInput placeholder='Group Name' value={groupInfo.groupName} setValue={(value) => changeGroupInfo('groupName', value)} secureTextEntry={false}></CustomInput>
        <Text style={{marginLeft:10, marginTop:-10, fontSize:12}}>Group Name</Text>
      </View>

      <View style={{width:'90%',height:0.5,backgroundColor:'black', marginTop:30}}></View>

      <View style={[styles.middleRow, {width:'100%', marginBottom:40}]}>

        <View>
        <View style={{flexDirection:'row'}}>
            <CustomInput placeholder='12' width={250} value={groupInfo.minMile} setValue={(value) => changeGroupInfo('minMile', value)} hideBorder="right" secureTextEntry={false} numeric></CustomInput>
            <View style={{borderWidth:1,borderLeftWidth:0,height:32,borderRadius: 5,borderColor: '#cccccc',paddingHorizontal:5,backgroundColor:'white',marginTop:10,marginLeft:-15,width:50}}>
              <Text style={{marginTop:6}}>miles</Text>
            </View>
          </View>
          <Text style={{marginLeft:10, marginTop:-10,fontSize:12}}>Minimum Weekly Miles</Text>
        </View>
        <View>
          <View style={{flexDirection:'row'}}>
          
            <CustomInput placeholder='5' width={250} value={groupInfo.minDays} setValue={(value) => changeGroupInfo('minDays', value)} hideBorder="right" secureTextEntry={false} numeric></CustomInput>
            <View style={{borderWidth:1,borderLeftWidth:0,height:32,borderRadius: 5,borderColor: '#cccccc',paddingHorizontal:5,backgroundColor: 'white',marginTop:10,marginLeft:-15,width:50}}>
              <Text style={{marginTop:6}}>days</Text>
            </View>
          </View>
        <Text style={{marginLeft:10, marginTop:-10,fontSize:12}}>Minimum Days Per Week</Text>
        </View>
        <View>
          <View style={{flexDirection:'row'}}>
           <View style={{borderWidth:1,borderRightWidth:0,height:32,borderRadius: 5,borderColor: '#cccccc',paddingHorizontal:5,backgroundColor:'white',marginTop:10,width:20,marginRight:-6}}>
              <Text style={{marginTop:6}}>$</Text>
            </View>
            <CustomInput placeholder='0.50' width={270} value={groupInfo.moneyMile} setValue={(value) => changeGroupInfo('moneyMile', value)} hideBorder="left" secureTextEntry={false} numeric decimal></CustomInput>
           
          </View>
          <Text style={{marginLeft:10, marginTop:-10,fontSize:12}}>Dollars per Mile</Text>
        </View>
      </View>

      <View style={{width:'90%',height:0.5,backgroundColor:'black', marginBottom:30}}></View>


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
    marginTop: 30,
    alignItems: "center",

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




