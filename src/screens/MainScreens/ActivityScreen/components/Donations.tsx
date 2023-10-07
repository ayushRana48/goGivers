import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Auth, API } from "aws-amplify";
import 'react-native-url-polyfill/auto'
import { useUserContext } from '../../../../../UserContext';
import HistoryItem from '../../Groups/components/HistoryItem';

const Donations = ({ navigation }: { navigation: any }) => {
    const { user, setUser } = useUserContext();

    const [donations,setDonations]= useState([])
    const [openDonations,setOpenDonations]=useState(false);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
    if(user){
      const fetchData = () => {
        const url = `/goGivers/users/getUser?username=${user.username}`;
  
        API.get('goGivers', url, {
          response: true
        })
          .then(response => {
            setUser(response.data.user);
            if(response.data.user.donations){
                setDonations(response.data.user.donations)

            }
            console.log(response.data.user, "fsfdffsf");
            setLoading(false);

          })
          .catch(error => {
            console.log("FFFerroreee",error);
          });
      };

  
      fetchData();
    }
    }, [user]);



   
    function open() {
        if (donations?.length == 0) {
            return;
        }

        if (openDonations) {
            setOpenDonations(false);
            return;
        }

        setOpenDonations(true);
    }

    let historyList: any = [];

    if (donations?.length > 0) {
        historyList = donations.map((h:any) => {
            return <HistoryItem item={h} groupId={h.groupId}></HistoryItem>
        })
    }




    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? <ActivityIndicator size="large" color="blue" />
                :
                <><View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <Text style={styles.donationsText}>Donations </Text>
                    <Pressable style={{ marginLeft: 'auto' }} onPress={open}><Text>{donations ? donations?.length : 0}</Text></Pressable>
                </View>
                <View style={{ height: 1.5, backgroundColor: '#d4d2d2', width: '100%', marginVertical: 5 }}></View>
                    {openDonations && historyList}
                </>
            }
        </ScrollView>
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

export default Donations;





