import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import CameraScreen from "./src/views/CamScreen";
import LoginScreen from "./src/views/LoginScreen";
import LoadingScreen from "./src/views/LoadingScreen";
import RegisterScreen from "./src/views/RegisterScreen";
import HomeScreen from "./src/views/HomeScreen";

const AppStack = createStackNavigator({
  Home: HomeScreen, // Pantalla principal del stack es el feed de posts
  Camera: CameraScreen, // Añadimos CameraScreen como parte del stack
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading', // Establece la pantalla de carga como la inicial
    }
  )
);


