import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, Image, Touchable, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { GroupsModel } from '../../../types/types';
import { API } from "aws-amplify";
import MemberItem from './components/MemberItem';
import { UserType } from '../../../types/types';
import 'react-native-url-polyfill/auto'
import { useUserContext } from '../../../../UserContext';
import { useFocusEffect } from '@react-navigation/native';


const GroupScreen = ({ navigation }: { navigation: any }) => {
  //@ts-ignore
  const route = useRoute<{ params: { groupId: string } }>();


  const [groupId, setGroupId] = useState<string>(route.params?.groupId);
  const [groupInfo, setGroupInfo] = useState<GroupsModel | null>();
  const [loading, setLoading] = useState(true); // State for loading
  const [currentInterval, setCurrentInterval] = useState<string[]>([]);
  const { user, setUser } = useUserContext();
  const [userStats, setUserStats] = useState({ days: 0, distance: 0 });


  const lastHashTagIndex = groupId.lastIndexOf('#'); // Find the index of the last hashtag
  const groupName = groupId.substring(0, lastHashTagIndex).trim();


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // First, make the PUT request
          const putResponse = await API.put('goGivers', '/goGivers/groups/updateUserMiles', {
            credentials: 'include',
            body: {
              "groupId": groupId
            },
            response: true
          });

          if (putResponse.data) {
            // console.log(putResponse.data.newUsersList[0].runs.length);
          }

          const putResponse2 = await API.put('goGivers', '/goGivers/groups/updateStrikes', {
            credentials: 'include',
            body: {
              "groupId": groupId
            },
            response: true
          });

          if (putResponse2.data) {
            console.log(putResponse2.data);
          }

          const putResponse3 = await API.put('goGivers', '/goGivers/groups/findLoser', {
            credentials: 'include',
            body: {
              "groupId": groupId
            },
            response: true
          });


          // Then, make the GET request with groupId
          const url = `/goGivers/groups/getGroup?groupId=${encodeURIComponent(groupId)}`;
          const getResponse = await API.get('goGivers', url, {
            response: true
          });

          setGroupInfo(getResponse.data.group);
          console.log(getResponse.data.group.usersList[0].runs, "My grooup");
          const currentLocalTime = new Date();

          if (getResponse.data.group.nextStrikeUpdate && currentLocalTime > new Date(getResponse.data.group.startDate)) {
            // Parse nextStrikeUpdate into a Date object
            const nextStrikeUpdateDate = new Date(getResponse.data.group.nextStrikeUpdate);

            // Calculate the first entry: nextStrikeUpdate - 8 days
            const firstEntryDate = new Date(nextStrikeUpdateDate);
            firstEntryDate.setDate(firstEntryDate.getDate() - 8);

            // Calculate the second entry: nextStrikeUpdate - 1 day
            const secondEntryDate = new Date(nextStrikeUpdateDate);
            secondEntryDate.setDate(secondEntryDate.getDate() - 1);

            // Create the list with the calculated dates
            const dateList = [firstEntryDate.toISOString(), secondEntryDate.toISOString()];

            // Now, dateList contains the desired entries
            // console.log(dateList);
            setCurrentInterval(dateList);
            setUserStats(getTotalDistanceForCurrentUser(getResponse.data.group, dateList))
          }
        } catch (e) {
          console.error("Error:", e);
        } finally {
          setLoading(false); // Set loading to false when data fetching is done
        }
      };

      fetchData();
    }, [groupId])); // Add `groupId` as a dependency if it's used inside the useEffect



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

  function toSetting() {
    if (loading) {
      return;
    }
    navigation.navigate('GroupSettings', { group: groupInfo })
  }

  function toHistory(){
    navigation.navigate('GroupHistory', { group: groupInfo })
  }

  function getTotalDistanceForCurrentUser(groupInfo1: GroupsModel, currentInterval1: string[]) {
    // Find the user with the given id in groupInfo.usersList

    // console.log(currentInterval1);
    if (groupInfo1 && currentInterval1) {
      const currentUser = groupInfo1.usersList.find(u => u.Id === user.id);

      // Check if the currentUser and runs attribute exist
      if (currentUser && currentUser.runs) {
        // Parse the interval dates to Date objects
        const startDate = new Date(currentInterval1[0]);
        const endDate = new Date(currentInterval1[1]);

        // Filter runs within the specified interval and sum their distances
        const temp = currentUser.runs
          .filter(run => {
            const runDate = new Date(run.date);

            return runDate >= startDate && runDate <= endDate;
          })
        const totalDistance = temp.reduce((sum, run) => sum + run.distance, 0);

        console.log({ days: temp.length, distance: totalDistance });
        return { days: temp.length, distance: totalDistance };
      }
    }
    console.log(-1);
    return { days: -1, distance: -1 }; // Return 0 if user or runs attribute not found
  }

  function getDistance() {
    let distance = 0;
    if (groupInfo?.usersList) {
      for (let i = 0; i < groupInfo?.usersList?.length; i++) {
        const currUser = groupInfo?.usersList[i];
        const mileage = currUser.mileage;
        distance += mileage;
      }
    }
    return distance.toFixed(2)
  }


  return (
    <ScrollView style={{ paddingHorizontal: 40 }}>
      <Pressable style={{ marginTop: 20, marginLeft: 'auto', marginRight: 20 }} onPress={toSetting}>
        <Image source={require('../../../../assets/images/settings.png')} />
      </Pressable>




      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginTop: 0 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{groupName}</Text>
          {!loading ?
            <View style={{ marginTop: 20 }}>
              {groupInfo?.currLoser && <Text style={{ fontSize: 22, color: 'red' }}>Loser : {groupInfo?.currLoser}</Text>}
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: calculateFontSize(groupInfo?.moneyPool?.toFixed(2) || "0.00"), fontWeight: '300', }}>
                  {"Donation Pool:  "}
                </Text>
                <Text style={{ fontSize: calculateFontSize(groupInfo?.moneyPool?.toFixed(2) || "0.00"), fontWeight: '700', }}>
                  ${getDistance()}
                </Text>
              </View>
              {currentInterval.length > 0 &&
                <View>

                  <Text>Current Interval: {currentInterval[0].substring(5, 10)} --- {currentInterval[1].substring(5, 10)}</Text>
                  <Text>{userStats.distance.toFixed(2)}/{groupInfo?.minMile} miles over {userStats.days}/{groupInfo?.minDays} days this interval</Text>

                </View>
              }
              <Pressable style={{backgroundColor: 'blue',paddingVertical: 10,paddingHorizontal: 20,borderRadius: 8,}} onPress={toHistory}>
                <Text style={{ color: 'white', textAlign: 'center' }}>History</Text>
              </Pressable>
            </View>
            :
            <ActivityIndicator color="blue"></ActivityIndicator>


          }
        </View>


      </View>
      {!loading && (
        <View>
          <Text style={{ fontSize: 25, alignSelf: 'center', marginVertical: 15, marginTop: 20 }}>Members</Text>
          {groupInfo?.usersList.map((u) => (
            <MemberItem key={u.username} user={u} navigation={useNavigation()}></MemberItem>
          ))}
        </View>
      )}



    </ScrollView>
  );

};

export default GroupScreen;
