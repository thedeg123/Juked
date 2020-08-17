import React from "react";
import { Platform, Dimensions } from "react-native";
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
import { Foundation, Octicons, Ionicons } from "@expo/vector-icons";
import colors from "./src/constants/colors";
import heights from "./src/constants/heights";
import WriteReviewScreen from "./src/screens/WriteReviewScreen";
import { Provider } from "./src/context/context";
import { decode, encode } from "base-64";
import NotificationScreen from "./src/screens/NotificationScreen";
import WriteListScreen from "./src/screens/WriteListScreen";
import UserListScreen from "./src/screens/UserListScreen";
import ListenListScreen from "./src/screens/ListenListScreen";
import AppHeader from "./src/components/NavigationComponents/AppHeader";
import tabBarComponent from "./src/components/NavigationComponents/TabBarComponent";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const exploreFlow = {
  Review: ReviewScreen,
  Album: AlbumScreen,
  Artist: ArtistScreen,
  Profile: ProfileScreen,
  List: ListScreen,
  WriteReview: WriteReviewScreen,
  WriteList: WriteListScreen,
  UserList: UserListScreen,
  ListenList: ListenListScreen
};

const defaultNavigationOptions = {
  header: AppHeader,
  cardStyle: { backgroundColor: colors.background }
};

const homeStack = createStackNavigator(
  {
    Home: HomeScreen,
    ...exploreFlow
  },
  {
    defaultNavigationOptions,
    headerMode: "screen",
    initialRouteName: "Home"
  }
);

const searchStack = createStackNavigator(
  {
    Search: SearchScreen,
    ...exploreFlow
  },
  { defaultNavigationOptions, headerMode: "screen", initialRouteName: "Search" }
);

const notificationStack = createStackNavigator(
  {
    Notifications: NotificationScreen,
    ...exploreFlow
  },
  {
    defaultNavigationOptions,
    headerMode: "screen",
    initialRouteName: "Notifications"
  }
);

const profileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Account: AccountScreen,
    ...exploreFlow
  },
  {
    defaultNavigationOptions,
    headerMode: "screen",
    initialRouteName: "Profile"
  }
);

const iosBottomAdjust =
  Platform.OS === "android"
    ? 0
    : Dimensions.get("window").height === 667 // iPhone 8 or SE2
    ? 0
    : Dimensions.get("window").height === 736 // iPhone 8 Plus
    ? 0
    : 10;

const mainStack = createBottomTabNavigator(
  {
    homeFlow: {
      screen: homeStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Foundation
            name="home"
            style={{ top: iosBottomAdjust, fontSize: 23 }}
            color={tintColor}
          />
        ),
        tabBarLabel: () => null
      }
    },
    searchFlow: {
      screen: searchStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Octicons
            name="search"
            style={{ top: iosBottomAdjust, fontSize: 21 }}
            color={tintColor}
          />
        ),
        tabBarLabel: () => null
      }
    },
    notificationFlow: {
      screen: notificationStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="ios-notifications"
            style={{ fontSize: 26, top: iosBottomAdjust }}
            color={tintColor}
          />
        ),
        tabBarLabel: () => null
      }
    },
    profileFlow: {
      screen: profileStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Octicons
            name="person"
            style={{ top: iosBottomAdjust, fontSize: 22 }}
            color={tintColor}
          />
        ),
        tabBarLabel: () => null
      }
    }
  },
  {
    tabBarComponent
  }
);

const loginSwitch = createSwitchNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    MakeProfile: MakeProfileScreen
  },
  {
    defaultNavigationOptions: {
      ...defaultNavigationOptions,
      headerShown: false
    }
  }
);
const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  loginFlow: loginSwitch,
  mainFlow: mainStack
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};
