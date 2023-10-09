import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../../UserContext';
import { useRoute } from '@react-navigation/native';
import 'react-native-url-polyfill/auto'

const Invites = ({ navigation }: { navigation: any }) => {
    const { user, setUser } = useUserContext();
    const [invites, setInvites] = useState<{ sender: String, groupId: String }[]>([]);
    const [openInvite, setOpenInvite] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            setLoading(false);
            setInvites(user.invites)

        }
    }, [user])





    async function toggleInvite(accept: boolean, groupId: String) {
        if (invites?.length == 1) {
            setOpenInvite(false);
        }
        setInvites((prevInvites) => prevInvites.filter((invite) => invite.groupId !== groupId));
        await API.put('goGivers', '/goGivers/groups/toggleInvite', {
            credentials: 'include',
            body: {
                "accept": accept,
                "username": user.id,
                "groupId": groupId
            },
            response: true
        })
            .then((response) => {
                if(accept){
                    const newGroupsList = [...user.groups, groupId]; // Create a new array with groupId appended
                    const newUser = { ...user, groups: newGroupsList }; // Create a new user object with the updated groups array
                    setUser(newUser); // Update the user state with the new user object
                    console.log(response.data)

                     
                }

            })
            .catch(error => console.log("djfjd",error))
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

    function open() {
        if (invites?.length == 0) {
            return;
        }

        if (openInvite) {
            setOpenInvite(false);
            return;
        }

        setOpenInvite(true);
    }




    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? <ActivityIndicator size="large" color="blue" />
                :
                <><View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <Text style={styles.invitesText}>Invites </Text>
                    <Pressable style={{ marginLeft: 'auto' }} onPress={open}><Text>{invites ? invites?.length : 0}</Text></Pressable>
                </View><View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>

                    {openInvite && renderInviteComponents}
                </>
            }
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





