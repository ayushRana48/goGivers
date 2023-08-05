import React from "react";
import { View, Text, StyleSheet,Image,TextInput } from "react-native";


type CustomInputProps={
    value:string,
    setValue:(value:string)=>void,
    placeholder:string,
    secureTextEntry:boolean,
};

const CustomInput = (props:CustomInputProps)=>{
    return(
        <View style={styles.container}>
            <TextInput style={styles.input} value={props.value} onChangeText={props.setValue} placeholder={props.placeholder} secureTextEntry={props.secureTextEntry}></TextInput>
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        backgroundColor:'white',
        width:'100%',
        borderColor:'#cccccc',
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:10,
        marginVertical:10        
    },
    input:{
        height:30
    },
})

export default CustomInput