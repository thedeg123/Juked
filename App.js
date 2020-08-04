import React from "react";
import { Animated, StatusBar } from "react-native";
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
import StackHeader from "./src/components/StackHeader";
import HeaderBackButton from "./src/components/HeaderBackButton.js";
import { Provider } from "./src/context/context";
import { decode, encode } from "base-64";
import NotificationScreen from "./src/screens/NotificationScreen";
import WriteListScreen from "./src/screens/WriteListScreen";
import UserListScreen from "./src/screens/UserListScreen";
import ListenListScreen from "./src/screens/ListenListScreen";

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
const tabBarOptions = {
  activeTintColor: colors.primary, // active icon color
  inactiveTintColor: colors.shadow, // inactive icon color,
  style: {
    backgroundColor: colors.translucentWhite,
    position: "absolute",
    paddingBottom: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.lightShadow,
    borderWidth: 1,
    height: heights.tabBarHeight
  }
};

const defaultNavigationOptions = {
  header: ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor;
    const title =
      options.title || options.headerTitle || scene.descriptor.state.routeName;
    const progress = Animated.add(
      scene.progress.current,
      scene.progress.next || 0
    );
    const opacity = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0]
    });

    return (
      <Animated.View style={{ opacity }}>
        <StatusBar backgroundColor={colors.white} barStyle={"dark-content"} />
        <StackHeader
          title={title}
          previous={previous}
          center={options.headerComponent}
          leftButton={
            previous ? (
              <HeaderBackButton onPress={() => navigation.goBack()} />
            ) : (
              undefined
            )
          }
          rightButton={options.headerRight}
        />
      </Animated.View>
    );
  },
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

const mainStack = createBottomTabNavigator({
  homeFlow: {
    screen: homeStack,
    navigationOptions: {
      tabBarLabel: ({ tintColor }) => (
        <Foundation name="home" style={{ fontSize: 23 }} color={tintColor} />
      ),
      tabBarOptions
    }
  },
  searchFlow: {
    screen: searchStack,
    navigationOptions: {
      tabBarLabel: ({ tintColor }) => (
        <Octicons name="search" style={{ fontSize: 21 }} color={tintColor} />
      ),
      tabBarOptions
    }
  },
  notificationFlow: {
    screen: notificationStack,
    navigationOptions: {
      tabBarLabel: ({ tintColor }) => (
        <Ionicons
          name="ios-notifications"
          style={{ fontSize: 26, top: 4 }}
          color={tintColor}
        />
      ),
      tabBarOptions
    }
  },
  profileFlow: {
    screen: profileStack,
    navigationOptions: {
      tabBarLabel: ({ tintColor }) => (
        <Octicons name="person" style={{ fontSize: 22 }} color={tintColor} />
      ),
      tabBarOptions
    }
  }
});
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
      <App></App>
    </Provider>
  );
};
