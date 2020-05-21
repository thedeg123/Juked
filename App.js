import React from "react";
import { Animated } from "react-native";
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
import { Foundation, Octicons } from "@expo/vector-icons";
import colors from "./src/constants/colors";
import heights from "./src/constants/heights";
import WriteReviewScreen from "./src/screens/WriteReviewScreen";
import StackHeader from "./src/components/StackHeader";
import HeaderBackButton from "./src/components/HeaderBackButton.js";
import { Provider } from "./src/context/context";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const exploreFlow = {
  Review: ReviewScreen,
  Album: AlbumScreen,
  Artist: ArtistScreen,
  Profile: ProfileScreen,
  List: ListScreen,
  WriteReview: WriteReviewScreen
};
const tabBarOptions = {
  activeTintColor: colors.primary, // active icon color
  inactiveTintColor: colors.shadow, // inactive icon color,
  style: {
    backgroundColor: colors.translucentWhite,
    position: "absolute",
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
      options.headerTitle || options.title || scene.descriptor.state.routeName;
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
        {
          <StackHeader
            title={title}
            previous={previous}
            leftButton={
              previous ? (
                <HeaderBackButton onPress={() => navigation.goBack()} />
              ) : (
                undefined
              )
            }
            rightButton={options.headerRight}
          ></StackHeader>
        }
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

const mainStack = createBottomTabNavigator(
  {
    homeFlow: {
      screen: homeStack,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Foundation name="home" style={{ fontSize: 22 }} color={tintColor} />
        ),
        tabBarOptions
      }
    },
    searchFlow: {
      screen: searchStack,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Octicons
            name="search"
            style={{ fontSize: 22, top: 2 }}
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
  },
  { lazy: false }
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
      <App></App>
    </Provider>
  );
};
