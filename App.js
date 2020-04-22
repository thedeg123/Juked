import React from "react";
import { StyleSheet } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import firebase from "firebase";
import "firebase/firestore";
import firebaseConfig from "./src/api/firebaseConfig";
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
import MakeProfileScreen from "./src/screens/MakeProfileScreen";
import { Foundation, FontAwesome, Octicons } from "@expo/vector-icons";
import colors from "./src/constants/colors";
import WriteReviewScreen from "./src/screens/WriteReviewScreen";
import { Provider } from "./src/context/context";
import { Dimensions } from "react-native";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const exploreFlow = {
  Review: ReviewScreen,
  Album: AlbumScreen,
  Artist: ArtistScreen,
  Profile: ProfileScreen,
  List: ListScreen,
  WriteReview: WriteReviewScreen
};
const screen_height = Dimensions.get("window").height;
const tab_bar_height = screen_height * 0.098;
const headerStyle = {
  backgroundColor: colors.background,
  height: tab_bar_height,
  borderBottomWidth: 2
};
const headerTitleStyle = {
  fontSize: 18,
  fontWeight: "bold"
};

const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  loginFlow: createSwitchNavigator(
    {
      SignIn: SignInScreen,
      SignUp: SignUpScreen,
      MakeProfile: MakeProfileScreen
    },
    {
      defaultNavigationOptions: {
        headerStyle: { backgroundColor: colors.background },
        cardStyle: { backgroundColor: colors.background },
        headerShown: false
      }
    }
  ),
  mainFlow: createBottomTabNavigator(
    {
      homeFlow: {
        screen: createStackNavigator(
          {
            Home: HomeScreen,
            ...exploreFlow
          },
          {
            defaultNavigationOptions: {
              headerStyle,
              headerTitleStyle,
              cardStyle: { backgroundColor: colors.background }
            }
          }
        ),
        navigationOptions: {
          tabBarLabel: ({ tintColor }) => (
            <Foundation
              name="home"
              style={styles.iconStyle}
              color={tintColor}
            />
          ),
          tabBarOptions: {
            activeTintColor: colors.primary, // active icon color
            inactiveTintColor: colors.shadow, // inactive icon color,
            style: { backgroundColor: colors.object } //background color
          }
        }
      },
      searchFlow: {
        screen: createStackNavigator(
          {
            Search: SearchScreen,
            ...exploreFlow
          },
          {
            defaultNavigationOptions: {
              headerStyle,
              headerTitleStyle,
              cardStyle: { backgroundColor: colors.background }
            }
          }
        ),
        navigationOptions: {
          tabBarLabel: ({ tintColor }) => (
            <FontAwesome
              name="search"
              style={styles.iconStyle}
              color={tintColor}
            />
          ),
          tabBarOptions: {
            activeTintColor: colors.primary, // active icon color
            inactiveTintColor: colors.shadow, // inactive icon color
            style: { backgroundColor: colors.object } //background color
          }
        }
      },
      profileFlow: {
        screen: createStackNavigator(
          {
            Profile: ProfileScreen,
            Account: AccountScreen,
            ...exploreFlow
          },
          {
            defaultNavigationOptions: {
              headerStyle,
              headerTitleStyle,
              cardStyle: { backgroundColor: colors.background }
            }
          }
        ),
        navigationOptions: {
          tabBarLabel: ({ tintColor }) => (
            <Octicons
              name="person"
              style={styles.iconStyle}
              color={tintColor}
            />
          ),
          tabBarOptions: {
            activeTintColor: colors.primary, // active icon color
            inactiveTintColor: colors.shadow, // inactive icon color
            style: { backgroundColor: colors.object } //background color
          }
        }
      }
    },
    { lazy: false }
  )
});

const App = createAppContainer(switchNavigator);

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 35
  }
});

export default () => {
  return (
    <Provider>
      <App></App>
    </Provider>
  );
};
