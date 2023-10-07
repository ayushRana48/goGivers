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
import HistoryItem from './components/HistoryItem';


const GroupHistoryScreen = ({ navigation }: { navigation: any }) => {
    //@ts-ignore
    const route = useRoute<{ params: { group: GroupsModel } }>();


    let historyList: any = [];

    if (route.params.group?.records && route.params.group?.records?.length > 0) {
        historyList = route.params.group?.records?.map((h) => {
            return <HistoryItem item={h} groupId=""></HistoryItem>
        })
    }









    return (
        <ScrollView style={{ paddingHorizontal: 40 }}>
            <Pressable style={{ marginTop: 20, marginLeft: 0 }} onPress={() => { navigation.goBack() }}>
                <Text>Back</Text>
            </Pressable>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginTop: 20 }}>History</Text>
                {!route.params.group.records || route.params.group.records.length === 0 ?
                    <Text style={{ fontSize: 20, marginTop: 20 }}>No History</Text>
                    :
                    <ScrollView>
                        {historyList}
                        <Text>fdfgasdg</Text>
                    </ScrollView>
                }
            </View>


        </ScrollView>
    );

};

export default GroupHistoryScreen;
