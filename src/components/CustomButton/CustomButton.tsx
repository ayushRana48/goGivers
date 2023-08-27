import * as React from 'react';
import { Text, View, StyleSheet, Pressable, TextStyle } from 'react-native';

type customButtonProps = {
  onPress: any,
  text: string,
  type?: "primary" | "tertiary",
  bgColor?: string,
  color?: string,
  width?: string,
  height?: string,
  fontSize?: string,
}

const customButton = (props: customButtonProps) => {
  // Construct the styles for the container
  const containerStyle = [
    styles.container,
    props.type && styles[`container_${props.type}`],
    props.bgColor && { backgroundColor: props.bgColor },
    props.width && { width: props.width },
    props.height && { height: props.height }
  ];

  // Construct the styles for the text
  const textStyle: TextStyle[] = [
    props.type && styles[`text_${props.type}`],
    props.color ? { color: props.color } : null, // Use null for falsy value
    props.fontSize ? { fontSize: props.fontSize } : null,
    {fontWeight: 'bold'}
  ].filter(Boolean) as TextStyle[]; // Filter out null values and cast to TextStyle[]
  

  return (
    <Pressable onPress={props.onPress} style={containerStyle}>
      <Text style={textStyle}>{props.text}</Text>
    </Pressable>
  );
};

export default customButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    fontWeight: 'bold',
    color: 'white',
  },

  container_primary: {
    backgroundColor: '#287DED',
  },
  container_tertiary: {
    // Add any tertiary container styles here
  },
  text_primary: {
    color: 'white',
    fontWeight: 'bold',

  },
  text_tertiary: {
    fontWeight: 'bold',
    color: '#b0aeae',
  },
});
