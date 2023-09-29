import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, Image, Pressable } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { useNavigation, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth, API } from "aws-amplify";
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native'
import 'react-native-url-polyfill/auto'
import { GroupsModel } from '../../../types/types'
import { useUserContext } from '../../../../UserContext';
import GroupItem from './components/GroupItem'
import { useGroupsContext } from './GroupsContext';

const GroupsListScreen = ({ navigation }: any) => {
  const { user } = useUserContext();
  const { groupsData, setGroupsData } = useGroupsContext();

  function newGroup() {
    navigation.navigate('NewGroup');
  }

  const [groups, setGroups] = useState<string[]>();
  const [loading, setLoading] = useState(true); // State for loading


  useEffect(() => {
    if (user?.id) {
      console.log("FETTCHHh")
      if (user.groups) {
        console.log(user.groups)
        setGroups(user.groups);
        setGroupsData(user.groups);
        setLoading(false);
      }
      else {
        setGroups([])
        setGroupsData([])
      }
    }


  }, [user]);

  const groupItemList = groups?.map(x => <GroupItem key={x} groupName={x} navigation={navigation}></GroupItem>)


  return (
    <ScrollView>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ alignSelf: 'center', fontSize: 20 }}>{user.id}'s groups</Text>
      </View>
      <Pressable style={{ position: 'absolute', right: 20, top: 20 }} onPress={newGroup}>
        <Image source={require('../../../../assets/images/NewGroupIcon.png')} />
      </Pressable>

      <View style={{ paddingHorizontal: 40, marginTop: 20, marginBottom: 15 }}>
        {loading ? ( // Display loading indicator during data fetching
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            {groupsData && groupsData?.length > 0 ? (
              groupsData.map((groupName: any) => (
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
