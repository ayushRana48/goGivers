import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,Image,useWindowDimensions, Alert } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput"
import CustomButton from "../../../components/CustomButton/CustomButton"
import { Linking } from 'react-native'
import { Auth } from "aws-amplify";
import { useUserContext } from "../../../../UserContext";

const SignInScreen = ({navigation}:any)=>{
    const { setUser } = useUserContext();
    const [username,setUsername]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [loading,setLoading]= useState(false)

   

    const onSignInPressed=async ():Promise<void>=>{
        console.log(username)
        if(loading){
            return;
        }
        setLoading(true)
        try{
            const response = await Auth.signIn(username,password)
            console.log(response)
            console.log("sfwf")
            setUser(username);
            navigation.navigate('MainNav',{username});
            setUsername("")
            setPassword("")
        }
        catch(e){
            if(e instanceof Error){
                Alert.alert('Oopseedaisy', e.message)
            }
        }
        setLoading(false)
    
    }

    const onForgotPassword=():void=>{
        // navigation.navigate('ForgotPassword');
        navigation.goBack();
    }
    const onPressGoogle=():void=>{
        console.log("goog")
    }
    const onPressApple=():void=>{
        console.log("apple")
    }
    const onPressNew=():void=>{
        navigation.navigate('SignUp');
    }

    return(
        <View style={styles.root}>
            <Image source={require("../../../../assets/images/logo.png")} style={styles.logo}></Image>
            <CustomInput value={username} setValue={setUsername} placeholder="Username" secureTextEntry={false}></CustomInput>
            <CustomInput value={password} setValue={setPassword} placeholder="Password" secureTextEntry></CustomInput>
            <CustomButton onPress={onSignInPressed} text={loading? "Loading..." : "Sign in"} type="primary"></CustomButton>
            <CustomButton onPress={onForgotPassword} text={"Forgot Password"} type="tertiary"></CustomButton>
            <View style={styles.horizontalBar} />
            <CustomButton onPress={onPressNew} text={"Don't have an account? Register Here"} type="tertiary"></CustomButton>
            <Text className="text-violet-700">dfdsgf</Text>
            <Text className="font-bold mt-20" >fse;odfksld</Text>
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
    },
    horizontalBar: {
        width: '100%',
        height: 1,
        backgroundColor: 'black', // You can change the color as needed
        marginVertical: 10,
    }
})
export default SignInScreen