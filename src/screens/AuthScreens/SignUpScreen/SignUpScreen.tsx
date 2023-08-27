import React, { useState } from "react";
import { View, Text, StyleSheet,Image,useWindowDimensions,Alert } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput"
import CustomButton from "../../../components/CustomButton/CustomButton"
import {useNavigation, NavigationContainerRef, NavigationProp} from '@react-navigation/native';
import {Auth,API} from 'aws-amplify'

const SignUpScreen = ({navigation}:any)=>{
    const [username,setUsername]=useState<string>("");
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [repeatPassword,setRepeatPassword]=useState<string>("");
    const [loading,setLoading]= useState(false)

    const onSignInPress = () => {
        navigation.navigate('SignIn');
    };

    const onSignUpPress=async ():Promise<void>=>{
        if(loading){
            return;
        }
        setLoading(true)
        try{
            const response = await Auth.signUp({username,password,attributes:{email,preferred_username:username}})
            console.log(response)
            navigation.navigate('ConfirmEmail', {username,email});
        }
        catch(e){
            if(e instanceof Error){
                Alert.alert('Oops', e.message)
            }
        }
        setLoading(false)
        // 
    }

    return(
        <View style={styles.root}>
            <Text style={{fontSize:60}}>Sign Up</Text>
            <CustomInput value={username} setValue={setUsername} placeholder="Username" secureTextEntry={false}></CustomInput>
            <CustomInput value={email} setValue={setEmail} placeholder="Email" secureTextEntry={false}></CustomInput>
            <CustomInput value={password} setValue={setPassword} placeholder="Password" secureTextEntry></CustomInput>
            <CustomInput value={repeatPassword} setValue={setRepeatPassword} placeholder="Repeat Password" secureTextEntry></CustomInput>
            <CustomButton onPress={onSignUpPress} text={loading?"Loading":"Register"} type="primary"></CustomButton>
            <CustomButton onPress={onSignInPress} text={"Already have an account? Login Here"} type="tertiary"></CustomButton>

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
export default SignUpScreen