import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Touchable, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { GroupsModel } from '../../../types/types';
import { API } from "aws-amplify";
import MemberItem from './components/MemberItem';
import { UserType } from '../../../types/types';


import 'react-native-url-polyfill/auto'

const GroupScreen = ({ navigation }: { navigation: any }) => {
  //@ts-ignore
  const route = useRoute<{ params: { groupId: string } }>();


  const [groupId, setGroupId] = useState<string>(route.params?.groupId);
  const [groupInfo, setGroupInfo] = useState<GroupsModel | null>();
  const [loading, setLoading] = useState(true); // State for loading

  const lastHashTagIndex = groupId.lastIndexOf('#'); // Find the index of the last hashtag
  const groupName = groupId.substring(0, lastHashTagIndex).trim();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/goGivers/groups/getGroup?groupId=${encodeURIComponent(groupId)}`;
        const response = await API.get('goGivers', url, {
          response: true
        });
        setGroupInfo(response.data.group);


      } catch (e) {
        console.log("can't get groups list", e);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };
    fetchData();
  }, []);


  const calculateFontSize = (text: string) => {
    const length = text.replace('.', '').length; // Remove the decimal point
    if (length <= 5) {
      return 20;
    } else if (length === 6) {
      return 15;
    } else {
      return 13;
    }
  };

  function toSetting(){
    navigation.navigate('GroupSettings', { group: groupInfo }) 
  }
  

  return (
    <ScrollView style={{ paddingHorizontal: 40 }}>
      <Pressable style={{marginTop:20, marginLeft:'auto', marginRight:20}} onPress={toSetting}>
        <Image source={require('../../../../assets/images/settings.png')} />
      </Pressable>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginTop: 0 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{groupName}</Text>
          {!loading &&
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Text style={{ fontSize: calculateFontSize(groupInfo?.moneyPool?.toFixed(2) || "0.00"), fontWeight: '300', }}>
                {"Donation Pool:  "}
              </Text>
              <Text style={{ fontSize: calculateFontSize(groupInfo?.moneyPool?.toFixed(2) || "0.00"), fontWeight: '700', }}>
                ${groupInfo?.moneyPool?.toFixed(2) || "0.00"}
              </Text>
            </View>
          }

        </View>

      </View>
      {loading ? ( // Display loading indicator during data fetching
        <ActivityIndicator size="large" color="blue" />
        //@ts-ignore

      ) : <>
        <Text style={{ fontSize: 25, alignSelf: 'center', marginVertical: 15, marginTop: 20 }}>Members</Text>
        {groupInfo?.usersList.map((u) => (
          //@ts-ignore
          <MemberItem key={u.username} user={u} navigation={useNavigation()}></MemberItem>
        ))}
      </>
      }
    </ScrollView>
  );

};

export default GroupScreen;
