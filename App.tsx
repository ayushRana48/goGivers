/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import config from './src/aws-exports'
import { Amplify, Auth } from 'aws-amplify';
import MainNav from './src/MainNav';
import { UserProvider } from './UserContext';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Nav from './src/Nav';
import { DontUseProvider } from './src/DontUseContext';
Amplify.configure(config)
const App = () => {


  return (
    <SafeAreaView style={styles.root}>
      <UserProvider>
        <DontUseProvider>
        <Nav></Nav>
        </DontUseProvider>
      </UserProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:'white'
  },
});

export default App;