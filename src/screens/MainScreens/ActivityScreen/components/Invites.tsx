import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image, ScrollView } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import { useUserContext } from '../../../../../UserContext';
import 'react-native-url-polyfill/auto'

const Invites = ({ navigation, username }: { navigation: any; username: string }) => {
    const { user,setUser } = useUserContext();
    const [invites, setInvites] = useState<{ sender: String, groupId: String }[]>([]);
    const [openInvite,setOpenInvite]=useState(false);

    useEffect(()=>{
        const fetchData = async () => {
            console.log("FETCHINF DASTAAA")
            console.log(username)
            try {
                const url = `/goGivers/users/getUser?username=airborm1`;
                console.log(url)
                const response = await API.get('goGivers', url, {
                    response: true
                });
              
                setUser(response.data?.user);
                console.log(response.data?.user)
                setInvites(response.data?.user.invites); // Use response.data to set invites
                // updateMileage();
            } catch (error) {
                console.log("error getting usddsere")
                console.log(error)
            }
        };
    },[])


    useEffect(() => {
        const fetchData = async () => {
            console.log("FETCHINF DASTAAA")
            console.log(username)
            try {
                const url = `/goGivers/users/getUser?username=airborm1`;
                console.log(url)
                const response = await API.get('goGivers', url, {
                    response: true
                });
              
                setUser(response.data?.user);
                console.log(response.data?.user)
                setInvites(response.data?.user.invites); // Use response.data to set invites
                // updateMileage();
            } catch (error) {
                console.log("error getting usddsere")
                console.log(error)
            }
        };

        const updateMileage = async () => {
            try {
                const url = `/goGivers/users/updateTotalMile`;
                const response = await API.put('goGivers', url, {
                    response: true,
                    body:{
                        "username":user.id,
                        "currTotalMile":user.totalMileage,
                        "lastStravaCheck":user.lastStravaCheck,
                        "refresh":user.stravaRefresh,
                        "createdAt":user.createdAt, 
                    }
                });

                const newUser = {...user,totalMileage:response.data.distanceUpdate}
              
                setUser(newUser);
                console.log(response.data.distanceUpdate);
                console.log(newUser);
            } catch (error) {
                console.log(error)
            }
        };




        // fetchData();
    }, []);



    async function toggleInvite(accept: boolean, groupId: String) {
        if(invites?.length==1){
            setOpenInvite(false);
        }
        setInvites((prevInvites) => prevInvites.filter((invite) => invite.groupId !== groupId));
        await API.put('goGivers', '/goGivers/groups/toggleInvite', {
            credentials: 'include',
            body: {
                "accept": accept,
                "username": user,
                "groupId": groupId
            },
            response: true
        })
            .then((response) => {

            })
            .catch(error => console.log(error))
    }


    const renderInviteComponents =
        invites?.map((invite, index) => (
            <View key={index} style={styles.inviteContainer}>
                <Text style={styles.groupIdText}>Group ID: {invite.groupId}</Text>
                <Text style={styles.senderText}>From: {invite.sender}</Text>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.yesButton} onPress={() => toggleInvite(true, invite.groupId)}>
                        <Text style={styles.buttonText}>Yes</Text>
                    </Pressable>
                    <Pressable style={styles.noButton} onPress={() => toggleInvite(false, invite.groupId)}>
                        <Text style={styles.buttonText}>No</Text>
                    </Pressable>
                </View>
            </View>
        ));

    function open(){
        console.log("clickk")
        console.log(openInvite)
        if(invites?.length==0){
            return;
        }

        if(openInvite){
            setOpenInvite(false);
            return;
        }

        setOpenInvite(true);
    }




    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{flexDirection:'row', marginTop:30}}>
                <Text style={styles.invitesText}>Invites </Text>
                <Pressable style={{marginLeft:'auto'}} onPress={open}><Text>{invites ? invites?.length : 0}</Text></Pressable>
            </View>
            {!openInvite && <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>}

            {openInvite && renderInviteComponents}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    invitesText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingRight: 10,
       
    },
    inviteContainer: {
        paddingVertical: 10,
        borderTopColor: 'lightgray',
        borderTopWidth: 1,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
    groupIdText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    senderText: {
        fontSize: 14,
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    yesButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    noButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Invites;





