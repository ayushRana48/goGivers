import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Pressable, TextComponent, Modal, StyleSheet } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Auth, API } from 'aws-amplify';
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native';
import 'react-native-url-polyfill/auto';
import { UserType } from '../../../../types/types'
import Strikes from './Strikes';

const MemberItem = ({ user, navigation }: { user: UserType; navigation: any }) => {

  // Calculate the text width and adjust font size and truncation accordingly
  const MIN_FONT_SIZE = 14; // Adjust this as needed
  const MAX_FONT_SIZE = 17; // Adjust this as needed
  const MAX_TEXT_WIDTH = 250; // Adjust this as needed

  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(()=>{
    console.log(user.runs,"runnsns")
  },[])

  let mileage=0;
  if(user.runs){
    for(let i=0;i<user.runs.length;i++){
      mileage+=user.runs[i].distance;
    } 
  }

  //@ts-ignore
  let fontSize = MAX_FONT_SIZE;
  let truncatedName = user.username;

  // Calculate the width of the text
  const textWidth = 20 * fontSize * 0.6; // A rough estimate

  if (textWidth > MAX_TEXT_WIDTH) {
    // Reduce font size if the text exceeds max width
    fontSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE - (textWidth - MAX_TEXT_WIDTH) / 10);

    // Calculate the maximum number of characters that can fit
    const maxCharacters = Math.floor(MAX_TEXT_WIDTH / (fontSize * 0.6));

    // Truncate the text if necessary
    truncatedName = user.username.slice(0, maxCharacters - 3) + '...';
  }

  return (
    <Pressable
      style={{ borderTopWidth: 1, borderColor: '#d4d2d2', height: 55, flexDirection: 'row', alignItems: 'center' }}
      onPress={()=>setOpenModal(true)}
    >
      <Modal
        transparent={true}
        animationType="slide"
        visible={openModal}
        onRequestClose={() => setOpenModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 25 }}>{user.mileage.toFixed(2)} Miles </Text>
            <Pressable style={styles.closeButton} onPress={() => setOpenModal(false)}>
              <Text style={{ fontWeight: '800', fontSize: 18, color: 'red' }}>X</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Image source={require('../../../../../assets/images/GroupIcon.png')} style={{ marginHorizontal: 15 }} />
      <Text style={{ fontSize, maxWidth: MAX_TEXT_WIDTH }} numberOfLines={1} ellipsizeMode="tail">
        {truncatedName}
      </Text>
      <Strikes strikes={user.strikes}></Strikes>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Semi-transparent gray background
  },
  modalContent: {
    backgroundColor: 'rgba(204, 204, 204,0.9)',
    padding: 80,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
});



export default MemberItem;
