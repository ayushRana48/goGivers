import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking, Pressable, Image } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import { useUserContext } from '../../../../../UserContext';
import { authorize } from 'react-native-app-auth';

const Charity = ({ navigation, name, url, imageUrl,id,amount }: { navigation: any, name: string, url: string, imageUrl: string,id:string,amount:number }) => {
    const { user, setUser } = useUserContext();

    const [donations, setDonations] = useState([])
    const [openDonations, setOpenDonations] = useState(false);

    const [loading, setLoading] = useState(true);

    const handleOpenUrl = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Don't know how to open URL: ${url}`);
        }
    };

    const openDonateLink = async () => {
        const successRedirectUrl = 'com.gogivers'; // Replace with your desired success redirect URL
    
        const donateUrl = `https://staging.every.org/${id}?amount=${amount}&frequency=ONCE#donate`;
    
        const canOpen = await Linking.canOpenURL(donateUrl);
        if (canOpen) {
          await Linking.openURL(donateUrl);
        } else {
          console.error('Cannot open donate link');
        }
      };
    



    return (
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#d4d2d2', height: 85, alignItems: 'center' }}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: imageUrl }}></Image>
            <View>
                <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-between',marginLeft:20, width:'80%' }}>
                    <Text style={{width:180, fontSize:15}}>{name}</Text>
                    <Pressable onPress={handleOpenUrl} style={{marginLeft:'auto'}}>
                        <Text style={{color:'blue', fontSize:15}}>Url</Text>
                    </Pressable>
                </View>
                <Pressable style={{ backgroundColor: '#86e876', height:30, paddingHorizontal: 20, borderRadius: 8,width:'70%',marginLeft:20,marginTop:10}} onPress={openDonateLink}>
                    <Text style={{ color: 'blue',fontWeight:'700', textAlign: 'center',marginTop:7 }}>Donate</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    donationsText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingRight: 10,

    },

});

export default Charity;





