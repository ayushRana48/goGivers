import React, { useState } from "react";
import { View, Text, StyleSheet,Image,useWindowDimensions,Alert } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput"
import CustomButton from "../../../components/CustomButton/CustomButton"
import { Auth } from "aws-amplify";

const ResetScreen = ({navigation}:any)=>{
    const [username,setUsername]=useState<string>("");
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [code,setCode]=useState<string>("");
    const [loading,setLoading]=useState(false);

    const onSendPressed =async () => {
        if(loading){
            return;
          }
          try {
            const response = await Auth.forgotPassword(username)
            navigation.navigate("NewPassword", {username});
            Alert.alert('Code Sent to your Email')
          }
          catch (e) {
            if(e instanceof Error){
              Alert.alert('Oops', e.message)
            }
          }
          setLoading(false)  
    };
    
      const onSignInPress = () => {
        try{
          navigation.navigate("SignUp")
        }
        catch(error){
          console.log("ppp")
          console.log(error)
        }
      };


    return(
        <View style={styles.root}>
            <Text style={{fontSize:40}}>Reset Password</Text>
            <CustomInput value={username} setValue={setUsername} placeholder="Username" secureTextEntry={false}></CustomInput>
            <CustomButton onPress={onSendPressed} text={"Reset Password"} type="primary"></CustomButton>
            <CustomButton onPress={onSignInPress} text={"Back to Login"} type="tertiary"></CustomButton>
        </View>
    )
}


const styles = StyleSheet.create({
    root:{
        display:"flex",
        alignItems:"center",
        height:'100%',
        padding:40,
        paddingBottom:20,
    },
    logo:{
        width:'50%',
        height:'30%',
        marginVertical:0,
    }
})
export default ResetScreen