import * as React from 'react';
import { Text, View, StyleSheet,Pressable } from 'react-native';

type customButtonProps={
    onPress:any,
    text:string,
    type:"primary"|"tertiary",
    bgColor?:string,
    color?:string,
}

const customButton = (props: customButtonProps) => {
  return (
    <Pressable onPress={props.onPress} style={[styles.container,styles[`container_${props.type}`],props.bgColor && {backgroundColor:props.bgColor}]}>
      <Text style={[styles[`text_${props.type}`], props.color? {color:props.color}:{}]}>{props.text}</Text>
    </Pressable>
  );
};

export default customButton;

const styles = StyleSheet.create({
  container: {
    width:'100%',
    padding: 15,
    marginVertical:5,
    alignItems:'center',
    borderRadius:5,
  },

  container_primary:{
    backgroundColor:'#287DED',
  },
  container_tertiary:{

  },
  text_primary:{
    fontWeight:'bold',
    color:'white',
  },
  text_tertiary:{
    fontWeight:'bold',
    color:'#b0aeae',
  },

});
