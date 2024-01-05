import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// navigation
import { NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"

// screens
import HomeScreen from './Pages/HomeScreen'
import ChatScreen from './Pages/ChatScreen'

export type RootStackPramList = {
  HomeScreen: undefined;
  ChatScreen: undefined;
}
const Stack = createNativeStackNavigator<RootStackPramList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeScreen'>
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        
        />
        <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
