import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import { useUserContext } from '../../../../UserContext';
import CustomInput from '../../../components/CustomInput';
import Charity from './components/Charity';
import { useRoute } from '@react-navigation/native';

const DonationsScreen = ({ navigation }: { navigation: any }) => {
    const { user, setUser } = useUserContext();

    //@ts-ignore
    const route = useRoute<{ params: { amount: int } }>();


    const [searchTerm, setSearchTerm] = useState("")
    const [charities, setCharities] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        console.log(route.params.amount,"from DOnatpokfopas")
    })

    function search() {
        if(!searchTerm){
            return;
        }
        const url = `https://partners.every.org/v0.2/search/${searchTerm}?apiKey=pk_live_30cfa34ce3abd7c4d55054f05810a576`

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                return response.json(); // Parse the JSON response

            })
            .then(data => {
                // Handle the data from the API response
                console.log(data.nonprofits[0]);
                console.log(data.nonprofits[2]);

                setCharities(data.nonprofits);
            })
            .catch(error => {
                // Handle errors occurred during the fetch
                console.error('There has been a problem with your fetch operation:', error);
            });
    }





let charitiesList:any = []
if (charities.length > 0) {
    charitiesList = charities.map((c: any) => {
        return <Charity navigation={navigation} name={c.name} url={c.profileUrl} imageUrl={c.logoUrl} id={c.slug} amount ={route.params.amount}></Charity>
    })
}



return (
    <View style={styles.container}>
        <Text style={{ fontSize: 40 }}>Search For Charities</Text>
        <CustomInput
            placeholder='charity name'
            value={searchTerm}
            setValue={(value) => setSearchTerm(value)}
            hideBorder={undefined}
            secureTextEntry={false}
        />
        <Pressable style={{ backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, }} onPress={search}>
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>Search</Text>
        </Pressable>

        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={{height :400, marginTop:20}}>
            {charitiesList}
        </ScrollView>


    </View>
);
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        alignItems: 'center'
    }

});

export default DonationsScreen;


