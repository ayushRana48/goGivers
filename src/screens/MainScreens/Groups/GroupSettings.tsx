import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../UserContext';
import { GroupsModel } from '../../../types/types';
import { useRoute } from '@react-navigation/native';

const GroupSettings = ({ navigation }: { navigation: any }) => {
  const { user } = useUserContext();

  //@ts-ignore
  const route = useRoute<{ params: { group: GroupsModel } }>();

  const [group, setGroup] = useState(route.params.group);
  const [invitee, setInvitee] = useState("");
  const [isInvite, setIsInvite] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  type newGroupType = {
    groupName: string;
    minMile: number;
    minDays: number;
    moneyMile: number;
  };

  const [editGroupInfo, setEditGroupInfo] = useState<newGroupType>({ groupName: group.groupName, minMile: group.minMile, minDays:group.minDays, moneyMile:group.minMile })

  const isHost = (user == group.host.username)

  useEffect(() => {
    console.log('groip')
    console.log(group);
  }, [])

  async function sendInvite() {
    await API.put('goGivers', '/goGivers/groups/sendInvite', {
      credentials: 'include',
      body:{
        "sender":user,
        "username":invitee,
        "groupId":group.id
        },
      response:true
    })
    .then((response) => {
      console.log(response.data,"fsfsf")
      
    })
    .catch(error => Alert.alert(error.response.data.errorMessage))
  }

  function changeGroupInfo(attribute: keyof newGroupType, val: string) {
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

  useEffect(()=>{
    async function getAllUsers() {
        await API.get('goGivers', '/goGivers/users/getAllUsers', {
          credentials: 'include',
          response:true
        })
        .then((response) => {
          console.log(response.data.users[0].id,"fsfsf")
          
        })
        .catch(error => Alert.alert(error.response.data.errorMessage))
      }
    getAllUsers()
    
  },[])



  return (
    <View style={{ paddingHorizontal: 40 }}>
      <>
        <View style={{ marginTop: 0 }}>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Pressable style={{ marginTop: 0, marginLeft: 0 }} onPress={() => { navigation.goBack() }}>
              <Text>Back</Text>
            </Pressable>
            {isHost && !isEdit &&
              <Pressable style={{ marginTop: 0, marginLeft: 'auto', marginRight: 20 }} onPress={() => { setIsEdit(true) }}>
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
          {isEdit ?
            <>
              <View>
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
                  <CustomInput placeholder='0.50' width={270} value={editGroupInfo.moneyMile.toString()} setValue={(value) => changeGroupInfo('moneyMile', value)} hideBorder="left" secureTextEntry={false} numeric decimal></CustomInput>
                </View>
                <Text style={{ marginLeft: 10, marginTop: -10, fontSize: 12 }}>Dollars per Mile</Text>
              </View>
              <View style={{ marginTop: 20}}></View>
              <CustomButton text='Save' type='primary' onPress={() => setIsEdit(false)}></CustomButton>
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
              <Text style={{ fontSize: 18 }}>Next Check: {group?.startDate ? group.startDate.toString() : "No start date available"}</Text>
            </>
          }
        </View>
        <View>
          <View style={{marginTop:40,alignItems:'center'}}>
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
              <Pressable onPress={() => navigation.navigate('InviteSearch', { group: group }) 
            }>
                <Text style={{ color: 'blue' }}>Add Members</Text>
              </Pressable>
              
            )}
          </View>
        </View>
      </>
    </View>
  );
};

export default GroupSettings;
