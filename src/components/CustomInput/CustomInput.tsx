import React from "react";
import { View, Text, StyleSheet, Image, TextInput, ViewStyle, DimensionValue } from "react-native";

type CustomInputProps = {
  value: string,
  setValue: (value: string) => void,
  placeholder: string,
  secureTextEntry: boolean,
  width?: DimensionValue | undefined,
  hideBorder?: 'left' | 'right' | undefined
  numeric?:boolean
  decimal?:boolean
};

const CustomInput = (props: CustomInputProps) => {
  const borderStyle = () => {
    if (props.hideBorder === 'left') {
      return { borderLeftWidth: 0 };
    } else if (props.hideBorder === 'right') {
      return { borderRightWidth: 0 };
    } else {
      return {};
    }
  };

  const onChangeText = (text: string) => {
    if (props.numeric) {
      // Remove non-numeric characters from input
      let numericText;
      if(props.decimal){
        numericText = text.replace(/[^0-9.]/g, "");
      }
      else{
        numericText = text.replace(/[^0-9]/g, "");
      }
      
      
      props.setValue(numericText);
    } else {
      props.setValue(text);
    }
  };

  return (
    <View style={[styles.container, borderStyle(), props.width ? { width: props.width } : undefined]}>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={onChangeText}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.numeric ? "numeric" : "default"}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    height: 30
  },
});

export default CustomInput;
