import React, { useEffect, useState } from 'react';
import {View, Text, Button, ActivityIndicator,ScrollView, Image, Pressable} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import {GroupsModel} from '../../../types/types'
import { useUserContext } from '../../../../UserContext';
import GroupItem from './components/GroupItem'

const GroupsListScreen = ({navigation}:any) => {
  const {user } = useUserContext();

  function newGroup(){
    navigation.navigate('NewGroup');
  }

  const [groups,setGroups] = useState<string[]>();
  const [loading, setLoading] = useState(true); // State for loading


  useEffect(() => {
    console.log("FETTCHHh")
    const fetchData = async () => {
      try {
        const url = `/goGivers/users/getUser?usegrname=${user}`;
        console.log(url);
        const response = await API.get('goGivers', url, {
          response: true
        });
        console.log(response.data)
        
        if (response.data.user.groups.length > 0) {
          setGroups(response.data.user.groups);
        } else {
          setGroups([]);
        }
      } catch (e) {
        console.log("can't get groups list", e);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };
    fetchData();
  }, []);

  const groupItemList = groups?.map(x=><GroupItem key={x} groupName={x} navigation={navigation}></GroupItem>)
  
  function removeGroup(id:String){
    const updatedGroup = groups?.filter(x => x !== id);

    // Update the group object with the new usersList
    setGroups(updatedGroup);
  }
 
  return (
    <ScrollView>
      <View style={{marginVertical: 20}}>
        <Text style={{ alignSelf: 'center', fontSize: 20 }}>{user}'s groups</Text>
      </View>
      <Pressable  style={{ position: 'absolute', right: 20,top:20}} onPress={newGroup}>
        <Image  source={require('../../../../assets/images/NewGroupIcon.png')} />
      </Pressable>

      <View style={{ paddingHorizontal: 40, marginTop: 20, marginBottom:15}}>
        {loading ? ( // Display loading indicator during data fetching
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            {groups && groups?.length > 0 ? (
              groups.map((groupName) => (
                <GroupItem key={groupName} groupName={groupName} navigation={navigation} />
              ))
            ) : (
              <Text style={{ fontSize: 24, alignSelf: 'center', marginBottom: 120 }}>No Groups</Text>
            )}
          </>
        )}
        <GroupItem key={"f"} groupName={",jsdngfa;skdjng;adkjgn;adkjsfgn;k"} navigation={navigation}></GroupItem>


      </View>
    </ScrollView>
  );

};

export default GroupsListScreen;
