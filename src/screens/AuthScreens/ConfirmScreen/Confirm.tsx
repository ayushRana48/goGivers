import React, { useState } from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions, Alert } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput"
import CustomButton from "../../../components/CustomButton/CustomButton"
import { useNavigation, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import { Auth,API } from "aws-amplify";
import { useUserContext } from "../../../../UserContext";
import { useDontUseContext } from "../../../DontUseContext";

const ConfirmScreen = ({navigation}:any) => {
  const route = useRoute()
  //@ts-ignore
  const [username, setUsername] = useState<string>(route.params?.username);
  //@ts-ignore
  const [email, setEmail] = useState<string>(route.params?.email);
  const [confirmation, setConfirmation] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const {setName} = useDontUseContext()

  const onConfirmPressed = async () => {
    if (loading) {
      return;
    }
    setLoading(true)
    try {
      const response = await Auth.confirmSignUp(username, confirmation)

      await API.post('goGivers', '/goGivers/users/newUser', {
        body:{
          "username":username,
          "email":email
        },
        response:true
      })
      .then((response) => {
        setName(username);
      })
      .catch((e) => {
        console.log("not working", e);
      });

      navigation.navigate("StravaConnect",{username})
    }
    catch (e) {
      if(e instanceof Error){
        Alert.alert('Oops', e.message)
      }
    }
    setLoading(false)
  };

  const onSignInPress = () => {
    navigation.navigate("SignIn")

  };

  const onResendPress = async () => {
    if(loading2){
      return;
    }
    try {
      const response = await Auth.resendSignUp(username)
      Alert.alert('New Code Sent to your Email')
    }
    catch (e) {
      if(e instanceof Error){
        Alert.alert('Oops', e.message)
      }
    }
    setLoading2(false)  
  };



  return (
    <View style={styles.root}>
      <Text style={{ fontSize: 40 }}>Confirm Email</Text>
      <CustomInput value={username} setValue={setUsername} placeholder="Username" secureTextEntry={false}></CustomInput>
      <CustomInput value={confirmation} setValue={setConfirmation} placeholder="Enter Confirmation Code" secureTextEntry={false}></CustomInput>
      <CustomButton onPress={onConfirmPressed} text={"Submit"} type="primary"></CustomButton>
      <CustomButton text="Resend code" onPress={onResendPress} type="tertiary" />
      <CustomButton onPress={onSignInPress} text={"Back to Login"} type="tertiary"></CustomButton>
    </View>
  )
}


const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
    height: '100%',
    padding: 40,
    paddingBottom: 20,
  },
  logo: {
    width: '50%',
    height: '30%',
    marginVertical: 0,
  }
})
export default ConfirmScreen