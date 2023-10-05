import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image,ScrollView } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../UserContext';
import { GroupsModel } from '../../../types/types';
import { useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import MemberSettings from './components/MemberSettings';
import { useGroupsContext } from './GroupsContext';

const GroupSettings = ({ navigation }: { navigation: any }) => {
  const { user,setUser } = useUserContext();
  const {groupsData,setGroupsData}= useGroupsContext();


  //@ts-ignore
  const route = useRoute<{ params: { group: GroupsModel } }>();

  const [group, setGroup] = useState(route.params.group);
  const [invitee, setInvitee] = useState("");
  const [isInvite, setIsInvite] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);


  type newGroupType = {
    groupName: string;
    minMile: number;
    minDays: number;
    moneyMile: number;
    startDate: Date | undefined;
  };

  const [editGroupInfo, setEditGroupInfo] = useState<newGroupType>({ groupName: group.groupName, minMile: group.minMile, minDays: group.minDays, moneyMile: group.minMile, startDate: group.startDate })

  const isHost = (user.id == group.host.username)


  //to reset after cancel
  useEffect(() => {
    // Parse the UTC date string to a Date object1
    let  utcStartDate;
    let localStartDate;
    if(group.startDate){
      utcStartDate = new Date(group.startDate);
      localStartDate = new Date(utcStartDate.getTime() - (utcStartDate.getTimezoneOffset() * 60000));

    }
    
    // Convert UTC to local time
  
    setEditGroupInfo({ 
      groupName: group.groupName, 
      minMile: group.minMile, 
      minDays: group.minDays, 
      moneyMile: group.minMile, 
      startDate: localStartDate // Format as local date string
    });
  }, [isEdit]);

  async function sendInvite() {
    await API.put('goGivers', '/goGivers/groups/sendInvite', {
      credentials: 'include',
      body: {
        "sender": user.id,
        "username": invitee,
        "groupId": group.id
      },
      response: true
    })
      .then((response) => {

      })
      .catch(error => Alert.alert(error.response.data.errorMessage))
  }

  function changeGroupInfo(attribute: keyof newGroupType, val: string | Date) {
    setEditGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      [attribute]: val,
    }));
  }

  const calculateFontSize = (text: string) => {
    const length = text.replace('.', '').length; // Remove the decimal point
    if (length <= 5) {
      return 30;
    } else if (length === 6) {
      return 25;
    } else {
      return 23;
    }
  };

  function setHost(user: String) {
    setIsEdit(false);
    for (let i = 0; i < group.usersList.length; i++) {
      if (group.usersList[i].username == user) {
        setGroup({ ...group, host: group.usersList[i] })

      }
    }
  }


  function kickMember(userToKick: string) {
    // Use the filter method to create a new array without the user to kick
    const updatedUsersList = group.usersList.filter(user => user.username !== userToKick);

    // Update the group object with the new usersList
    setGroup({ ...group, usersList: updatedUsersList });
  }


  function open() {
    if (group.usersList?.length == 0) {
      return;
    }

    if (openMembers) {
      setOpenMembers(false);
      return;
    }

    setOpenMembers(true);
  }



  //for search
  useEffect(() => {
    async function getAllUsers() {
      await API.get('goGivers', '/goGivers/users/getAllUsers', {
        credentials: 'include',
        response: true
      })
        .then((response) => {

        })
        .catch(error => Alert.alert(error.response.data.errorMessage))
    }
    getAllUsers()

  }, [])

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short', // 'short' or 'long' for abbreviated or full month name
    day: '2-digit', // '2-digit' for zero-padded day
  };

  async function leaveGroup(username: String) {
    const newList = groupsData.filter((x: string)=>x!=group.id)
    
    await API.put('goGivers', '/goGivers/groups/leaveGroup', {
      credentials: 'include',
      response: true,
      body: {
        "username": username,
        "groupId": group.id
      }
    })
    .then((response) => {
      navigation.navigate('GroupList')
      setGroupsData(newList);
      const newUser = {...user,groups:newList};
      setUser(newUser)

    })
    .catch(error => Alert.alert(error.response.data.errorMessage))
  }

  async function deleteGroup() {
    const newList = groupsData.filter((x: string)=>x!=group.id)

    await API.del('goGivers', '/goGivers/groups/deleteGroup', {
      credentials: 'include',
      response: true,
      body: {
        "username": user.id,
        "groupId": group.id
      }
    })
      .then((response) => {
        navigation.navigate('GroupList')
        setGroupsData(newList);
        const newUser = {...user,groups:newList};
        setUser(newUser)


      })
      .catch(error => Alert.alert(error.response.data.errorMessage))
  }

  function openEdit(){
    if( editGroupInfo.startDate && new Date(editGroupInfo.startDate)<=new Date()){
      Alert.alert("Can't edit, already started")
      return;

    }
    else{
      setIsEdit(true);
    }
  }



  async function save() {
    setIsEdit(false)

    setGroup({ ...group, groupName: editGroupInfo.groupName, minMile: editGroupInfo.minMile, minDays: editGroupInfo.minDays, moneyMile: editGroupInfo.moneyMile, startDate: editGroupInfo.startDate })
    let utcStartDate;
    if(editGroupInfo.startDate){
      utcStartDate = new Date(editGroupInfo.startDate);
      utcStartDate.setMinutes(utcStartDate.getMinutes() - utcStartDate.getTimezoneOffset());
    }
    await API.put('goGivers', '/goGivers/groups/editGroup', {
      credentials: 'include',
      response: true,
      body: {
        "username": user.id,
        "groupId": group.id,
        "minMile": editGroupInfo.minMile,
        "moneyMile": editGroupInfo.moneyMile,
        "startDate": utcStartDate?.toISOString(),
        "minDays": editGroupInfo.minDays
      }
    })

      .then((response) => {

      })
      .catch(error => Alert.alert(error.response.data.errorMessage))
  }





  return (
    <View style={{ paddingHorizontal: 40 }}>
      <>
        <View style={{ marginTop: 0 }}>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Pressable style={{ marginTop: 0, marginLeft: 0 }} onPress={() => { navigation.goBack() }}>
              <Text>Back</Text>
            </Pressable>
            {isHost && !isEdit &&
              <Pressable style={{ marginTop: 0, marginLeft: 'auto', marginRight: 20 }} onPress={openEdit}>
                <Text>Edit</Text>
              </Pressable>
            }
          </View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 30 }}>{group.groupName}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text style={{ fontSize: calculateFontSize(group.host.username), fontWeight: '300' }}>
              {"Host:  "}
            </Text>
            <Text style={{ fontSize: calculateFontSize(group.host.username), fontWeight: '700' }}>
              {group.host.username}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 30, marginLeft: 10 }}>
          {isEdit && group.host.username==user.id?
            <>
              <View>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                  <Text style={{}}>Members </Text>
                  <Pressable style={{ marginLeft: 'auto' }} onPress={open}><Text>{group.usersList.length ? group.usersList.length : 0}</Text></Pressable>
                </View>
                {openMembers && (
                  <ScrollView>
                    {group.usersList.map(x => (
                      <MemberSettings
                        user={x}
                        groupId={group.id}
                        host={group.host.username}
                        navigation={navigation}
                        setHost={setHost}
                        kickMember={kickMember}
                      />
                    ))}
                  </ScrollView>
                )}

                <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>


                <View style={{ flexDirection: 'row' }}>
                  <CustomInput placeholder='12' width={250} value={editGroupInfo.minMile.toString()} setValue={(value) => changeGroupInfo('minMile', value)} hideBorder="right" secureTextEntry={false} numeric></CustomInput>
                  <View style={{ borderWidth: 1, borderLeftWidth: 0, height: 32, borderRadius: 5, borderColor: '#cccccc', paddingHorizontal: 5, backgroundColor: 'white', marginTop: 10, marginLeft: -15, width: 50 }}>
                    <Text style={{ marginTop: 6 }}>miles</Text>
                  </View>
                </View>
                <Text style={{ marginLeft: 10, marginTop: -10, fontSize: 12 }}>Minimum Weekly Miles</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <CustomInput placeholder='5' width={250} value={editGroupInfo.minDays.toString()} setValue={(value) => changeGroupInfo('minDays', value)} hideBorder="right" secureTextEntry={false} numeric></CustomInput>
                  <View style={{ borderWidth: 1, borderLeftWidth: 0, height: 32, borderRadius: 5, borderColor: '#cccccc', paddingHorizontal: 5, backgroundColor: 'white', marginTop: 10, marginLeft: -15, width: 50 }}>
                    <Text style={{ marginTop: 6 }}>days</Text>
                  </View>
                </View>
                <Text style={{ marginLeft: 10, marginTop: -10, fontSize: 12 }}>Minimum Days Per Week</Text>
              </View>

              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ borderWidth: 1, borderRightWidth: 0, height: 32, borderRadius: 5, borderColor: '#cccccc', paddingHorizontal: 5, backgroundColor: 'white', marginTop: 10, width: 20, marginRight: -6 }}>
                    <Text style={{ marginTop: 6 }}>$</Text>
                  </View>
                  <CustomInput placeholder='12' width={270} value={editGroupInfo.moneyMile.toString()} setValue={(value) => changeGroupInfo('moneyMile', value)} hideBorder="left" secureTextEntry={false} numeric></CustomInput>
                </View>
                <Text style={{ marginLeft: 10, marginTop: -10, fontSize: 12 }}>Dollars per Mile</Text>
              </View>

              <View style={{ marginTop: 20, marginLeft: 10 }}>
                <Pressable onPress={() => setOpenDate(true)}>
                  <Text style={{ marginLeft: 0, fontSize: 18 }}>
                    {editGroupInfo.startDate
                      ? new Date(editGroupInfo.startDate)?.toLocaleDateString('en-US', options)
                      : "no start Date"}
                  </Text>
                </Pressable>
                <Text style={{ marginLeft: 0, fontSize: 12 }}>Start Date</Text>

              </View>
              <DatePicker
                modal
                mode="date"
                minimumDate = {new Date(new Date().setDate(new Date().getDate() + 1))}
                open={openDate}
                date={new Date()}
                onConfirm={(date) => {
                  setOpenDate(false)
                  changeGroupInfo("startDate", date)
                }}
                onCancel={() => {
                  setOpenDate(false)
                }}
              />


              <View style={{ marginTop: 20 }}></View>
              <CustomButton text='Save' type='primary' onPress={save}></CustomButton>
              <Pressable style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }} onPress={() => { setIsEdit(false) }}>
                <Text>Cancel</Text>
              </Pressable>
            </>
            :
            <>
              <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>
              <Text style={{ fontSize: 18 }}>Minimum Mile per Week : {group.minMile || 0}</Text>
              <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>
              <Text style={{ fontSize: 18 }}>Minimum Days per Week : {group.minDays || 0}</Text>
              <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>
              <Text style={{ fontSize: 18 }}>Dollars per Mile : ${group.moneyMile || 0}</Text>
              <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>
              <Text style={{ fontSize: 18 }}>Start Date: {group?.startDate ? new Date(group.startDate)?.toLocaleDateString('en-US', options) : "No start date available"}</Text>

            </>
          }
        </View>
        <View>
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            {isInvite && !isEdit ? (
              <>
                <CustomInput
                  placeholder='flub'
                  value={invitee}
                  setValue={(value) => setInvitee(value)}
                  hideBorder={undefined}
                  secureTextEntry={false}
                />
                <CustomButton text='Invite' type='primary' onPress={sendInvite} />
                <Pressable onPress={() => setIsInvite(false)}>
                  <Text style={{ color: 'red', fontWeight: '900' }}>Cancel</Text>
                </Pressable>
              </>
            ) : !isEdit && (
              <><Pressable onPress={() => navigation.navigate('InviteSearch', { group: group })}>
                <Text style={{ color: 'blue' }}>Add Members</Text>

              </Pressable>
                <View style={{ marginBottom: 30 }}></View>
                {group.usersList.length <= 1 ?
                  <CustomButton text='Delete Group' type='primary' bgColor='red' onPress={deleteGroup} />
                  :
                  <CustomButton text='Leave Group' type='primary' bgColor='red' onPress={() => leaveGroup(user.id)} />

                }
              </>

            )}
          </View>
        </View>
      </>
    </View>
  );
};

export default GroupSettings;
