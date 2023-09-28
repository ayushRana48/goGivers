import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Pressable } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Auth, API } from 'aws-amplify';
import { authorize } from 'react-native-app-auth';
import { Linking } from 'react-native';
import 'react-native-url-polyfill/auto';
import {UserType} from '../../../../types/types'
import Strikes from './Strikes';

const MemberItem = ({ user, navigation }: { user: UserType; navigation: any })  => {

  // Calculate the text width and adjust font size and truncation accordingly
  const MIN_FONT_SIZE = 14; // Adjust this as needed
  const MAX_FONT_SIZE = 17; // Adjust this as needed
  const MAX_TEXT_WIDTH = 250; // Adjust this as needed


  //@ts-ignore
  let fontSize = MAX_FONT_SIZE;
  let truncatedName = user.username;

  // Calculate the width of the text
  const textWidth =  20 * fontSize * 0.6; // A rough estimate
  

  if (textWidth > MAX_TEXT_WIDTH) {
    // Reduce font size if the text exceeds max width
    fontSize = Math.max(MIN_FONT_SIZE, MAX_FONT_SIZE - (textWidth - MAX_TEXT_WIDTH) / 10);

    // Calculate the maximum number of characters that can fit
    const maxCharacters = Math.floor(MAX_TEXT_WIDTH / (fontSize * 0.6));

    // Truncate the text if necessary
    truncatedName =  user.username.slice(0, maxCharacters - 3) + '...';
  }

  return (
    <Pressable
      style={{ borderTopWidth: 1, borderColor: '#d4d2d2', height: 55, flexDirection: 'row', alignItems: 'center'}}
    >
      <Image source={require('../../../../../assets/images/GroupIcon.png')} style={{ marginHorizontal: 15 }} />
      <Text style={{ fontSize, maxWidth: MAX_TEXT_WIDTH }} numberOfLines={1} ellipsizeMode="tail">
        {truncatedName}
      </Text>
      <Strikes strikes={user.strikes}></Strikes>
    </Pressable> 
  );
};

export default MemberItem;
