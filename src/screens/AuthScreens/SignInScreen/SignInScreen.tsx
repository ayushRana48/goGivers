import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,Image,useWindowDimensions, Alert } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput"
import CustomButton from "../../../components/CustomButton/CustomButton"
import { Linking } from 'react-native'
import { API, Auth } from "aws-amplify";
import { useUserContext } from "../../../../UserContext";
import { useDontUseContext } from "../../../DontUseContext";

const SignInScreen = ({navigation}:any)=>{
    const [username,setUsername]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [loading,setLoading]= useState(false)
    const {setName} =useDontUseContext()

    useEffect(()=>{
        
      },[])

   

    const onSignInPressed=async ():Promise<void>=>{
        if(loading){
            return;
        }
        setLoading(true)
        try{
            
            const response = await Auth.signIn(username,password)
            setName(username);
            const url = `/goGivers/users/getUser?username=${username}`;
      
            API.get('goGivers', url, {
              response: true
            })
            .then(response => {
                setUsername("")
                setPassword("")
                if(response.data.user.stravaRefresh){
                    navigation.navigate('MainNav',{username});
                }
                else{
                    navigation.navigate('StravaConnect',{username});
                }
    
            })
            .catch(error => {
                console.log("FFFerroreee",error);
                Alert.alert('Oopseedaisy', error.message)
                setLoading(false);
            });
           
        }
        catch(e){
            if(e instanceof Error){
                Alert.alert('Oopseedaisy', e.message)
                setLoading(false);
            }

        }
    
    }

    const onForgotPassword=():void=>{
        // navigation.navigate('ForgotPassword');
        navigation.goBack();
    }
  
    const onPressNew=():void=>{
        navigation.navigate('SignUp');
    }

    return(
        <View style={styles.root}>
            <Image source={require("../../../../assets/images/logo.png")} style={styles.logo}></Image>
            <CustomInput value={username.toLowerCase()} setValue={setUsername} placeholder="Username" secureTextEntry={false}></CustomInput>
            <CustomInput value={password} setValue={setPassword} placeholder="Password" secureTextEntry ></CustomInput>
            <CustomButton onPress={onSignInPressed} text={loading? "Loading..." : "Sign in"} type="primary"></CustomButton>
            <CustomButton onPress={onForgotPassword} text={"Forgot Password"} type="tertiary"></CustomButton>
            <View style={styles.horizontalBar} />
            <CustomButton onPress={onPressNew} text={"Don't have an account? Register Here"} type="tertiary"></CustomButton>
    
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
        backgroundColor:'white'
    },
    logo:{
        width:'50%',
        height:'30%',
        marginVertical:0,
    },
    horizontalBar: {
        width: '100%',
        height: 1,
        backgroundColor: 'black', // You can change the color as needed
        marginVertical: 10,
    }
})
export default SignInScreen

