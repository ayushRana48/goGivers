import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image, ScrollView } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import CustomInput from '../../../../components/CustomInput/CustomInput';
import { useUserContext } from '../../../../../UserContext';
import { useRoute } from '@react-navigation/native';
import 'react-native-url-polyfill/auto'

const InviteSearch = ({ navigation }: { navigation: any }) => {
    const { user } = useUserContext();

    //@ts-ignore
    const route = useRoute<{ params: { group: GroupsModel } }>();

    const [group, setGroup] = useState(route.params.group);
    const [allUsers, setAllUsers] = useState<String[]>([]);
    const [invitee, setInvitee] = useState("");
    const [searchResults, setSearchResults] = useState<String[]>([]);



    useEffect(() => {
        async function getAllUsers() {
            await API.get('goGivers', '/goGivers/users/getAllUsers', {
                credentials: 'include',
                response: true
            })
                .then((response) => {

                    const newList = response.data.users.map((x: { id: String; }) => x.id)
                    setAllUsers(newList);

                })
                .catch(error => Alert.alert(error.response.data.errorMessage))
        }

        getAllUsers()

    }, [])

    useEffect(() => {

        const index = allUsers.indexOf(user.id);
        if (index != -1) {
            allUsers.splice(index, 1);

        }
        let results = allUsers.filter((person) =>
            person.toLowerCase().includes(invitee.toLowerCase())
            || person.toLowerCase() == invitee.toLowerCase());

        if (invitee.length == 0) {
            results = allUsers
        }
        setSearchResults(results);

    }, [invitee])



    async function sendInvite(result: String) {
        await API.put('goGivers', '/goGivers/groups/sendInvite', {
            credentials: 'include',
            body: {
                "sender": user.id,
                "username": result,
                "groupId": group.id
            },
            response: true
        })
            .then((response) => {

            })
            .catch(error => Alert.alert(error.response.data.errorMessage))
    }



    return (
        <View style={{ paddingHorizontal: 40 }}>
            <Pressable style={{ marginTop: 0, marginLeft: 0, marginBottom: 40 }} onPress={() => { navigation.goBack() }}>
                <Text>Back</Text>
            </Pressable>
            <Text>Invite Friends</Text>
            <CustomInput
                placeholder='invite friends'
                value={invitee}
                setValue={(value) => setInvitee(value)}
                hideBorder={undefined}
                secureTextEntry={false}
            />

            <ScrollView>
                {searchResults.map((result, index) => (
                    <View key={index} style={styles.box}>
                        <Text>{result}</Text>
                        <Pressable onPress={() => sendInvite(result)}>
                            <Text>Plus</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    hoverBox: {
        backgroundColor: 'lightgray',
    },
});


export default InviteSearch;
