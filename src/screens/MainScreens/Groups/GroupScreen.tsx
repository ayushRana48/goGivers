import React, { useEffect, useState } from 'react';
import {View, Text, Button, Image, Touchable, Pressable, ActivityIndicator,ScrollView} from 'react-native';
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { GroupsModel } from '../../../types/types';
import { API } from "aws-amplify";
import MemberItem from './components/MemberItem';
import { UserType } from '../../../types/types';


import 'react-native-url-polyfill/auto'

const GroupScreen =() => {
    //@ts-ignore
    const route = useRoute<{ params: { groupId: string } }>();
    

    const [groupId, setGroupId] = useState<string>(route.params?.groupId);
    const [groupInfo,setGroupInfo]=useState<GroupsModel|null>();
    const [loading, setLoading] = useState(true); // State for loading

    const lastHashTagIndex = groupId.lastIndexOf('#'); // Find the index of the last hashtag
    const groupName = groupId.substring(0, lastHashTagIndex).trim();


    useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `/goGivers/groups/getGroup?groupId=${encodeURIComponent(groupId)}`;
            console.log(url);
            const response = await API.get('goGivers', url, {
              response: true
            });
            console.log(response.data.group.usersList[0].Item.username)
            setGroupInfo(response.data.group);

            
          } catch (e) {
            console.log("can't get groups list", e);
          } finally {
            setLoading(false); // Set loading to false when data fetching is done
          }
        };
        console.log("s")
        fetchData();
      }, []);
    

      const calculateFontSize = (text: string) => {
        const length = text.replace('.', '').length; // Remove the decimal point
        if (length <= 5) {
          return 25;
        } else if (length === 6) {
          return 20;
        } else {
          return 18;
        }
      };
      
// [{"Item": {"__typename": "UsersModel", "_lastChangedAt": 234234122, "_version": 1, "createdAt": "2023-08-05T08:54:39.784+00:00", "email": "Rana.ay@northeastern.edu", "id": "Test", "invites": [Array], "stravaRefresh": "efcc1a5e8ce5de62ae99ed9f02d6ae6443db633f", "totalMileage": 0, "totalMoneyDonated": 0, "totalMoneyRaised": 0, "updatedAt": "2023-08-05T08:54:39.784+00:00", "username": "Test"}}, {"Item": {"__typename": "UsersModel", "_lastChangedAt": 234234122, "_version": 1, "createdAt": "2023-08-05T08:49:56.581+00:00", "email": "4ayushrana@gmail.com", "groups": [Array], "id": "Flub", "invites": [Array], "stravaRefresh": "6cf503d72db443c9bfdbbe067a007fa864cee79b", "totalMileage": 0, "totalMoneyDonated": 0, "totalMoneyRaised": 0, "updatedAt": "2023-08-05T08:49:56.659+00:00", "username": "Flub"}}]
  return (
    <ScrollView style={{paddingHorizontal:40}}>
        <View style={{flexDirection:'row'}}>
            <View style={{marginVertical: 20}}>
                <Text style={{ fontSize: 30,fontWeight:'bold' }}>{groupName}</Text>
            </View>
            {!loading &&
            <View style={{marginTop:20,height:36,marginLeft:'auto'}}>
                <Text style={{fontSize: calculateFontSize(groupInfo?.moneyPool?.toFixed(2) || "0.00"),fontWeight: '900', }}>
                    ${groupInfo?.moneyPool?.toFixed(2) || "0.00"}
                </Text>                
                <Text style={{marginTop:-8}}>Donation Pool</Text>
            </View>
            }
        </View>
        {loading ? ( // Display loading indicator during data fetching
          <ActivityIndicator size="large" color="blue" />
          //@ts-ignore
          
        ) : <>
                <Text style={{fontSize:25, alignSelf:'center',marginVertical:15}}>Members</Text>
                {groupInfo?.usersList.map((u) => (
                //@ts-ignore
                <MemberItem key={u.username} user={u.Item} navigation={useNavigation()}></MemberItem>
                ))}
            </>
        }
    </ScrollView>
  );

};

export default GroupScreen;
