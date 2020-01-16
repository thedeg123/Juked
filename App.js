import React from "react";
import { View } from "react-native";
import {
  createAppNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import AccountScreen from "./src/screens/AccountScreen";
import AlbumScreen from "./src/screens/AlbumScreen";
import ArtistScreen from "./src/screens/ArtistScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ListScreen from "./src/screens/ListScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ReviewScreen from "./src/screens/ReviewScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";

import { TabNavigator, StackNavigator } from "react-navigation";

const exploreFlow = {
  Review: ReviewScreen,
  Album: AlbumScreen,
  Artist: ArtistScreen,
  Profile: ProfileScreen
};

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator(
    {
      SignIn: SignInScreen,
      SignUp: SignUpScreen
    },
    {
      defaultNavigationOptions: {
        cardStyle: { backgroundColor: "white" },
        headerShown: false
      }
    }
  ),
  mainFlow: createBottomTabNavigator({
    homeFlow: createStackNavigator({
      Home: HomeScreen,
      ...exploreFlow
    }),
    searchFlow: createStackNavigator({
      Search: SearchScreen,
      ...exploreFlow
    }),
    profileFlow: createStackNavigator({
      Profile: ProfileScreen,
      Account: AccountScreen,
      List: ListScreen
    })
  })
});

const App = createAppContainer(switchNavigator);

export default () => {
  return <App></App>;
};
