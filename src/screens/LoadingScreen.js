import React, { useEffect, useContext } from "react";
import { Alert, Platform } from "react-native";
import { auth } from "firebase";
import LoadingPage from "../components/Loading/LoadingPage";
import context from "../context/context";
import * as Notifications from "expo-notifications";

const LoadingScreen = ({ navigation }) => {
  if (Platform.OS === "android") console.disableYellowBox = true;
  let { firestore } = useContext(context);

  //we  can get into a nasty situation where we navigate to this page before firestore has finished adding
  //the user to the database. Because of this if we cant find the user, we try,try,try again! But only 10 times.

  const wait = time =>
    new Promise((resolve, reject) => setTimeout(() => resolve(true), time));

  const fetchUser = user =>
    new Promise(async (resolve, reject) => {
      let count = 0;
      let response;
      do {
        console.log("attempting login of", user, "try", count);
        response = await firestore.getUser(user, false);
        if (response) break;
        count += 1;
        await wait(500);
      } while (count < 20);
      resolve(response);
    });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });

  // triggered when user sees notification in app
  const _handleNotification = (response, user) => {
    //if the user is not logged in we return
    if (!user) return;
    Notifications.setBadgeCountAsync(0);
  };

  // triggered when user presses a notification
  const _handleNotificationResponse = ({ notification }, user) => {
    //if the user is not logged in we return
    if (!user) return;
    Notifications.setBadgeCountAsync(0);
    const { screen, data } = notification.request.content.data.body;
    return navigation.navigate(screen, data);
  };

  useEffect(() => {
    const routeState = () => {
      return auth().onAuthStateChanged(async user => {
        if (!user) return navigation.navigate("loginFlow");
        const response = await fetchUser(user.email);

        if (!response) {
          Alert.alert("Failed to signin", "Sorry, an unknown error occurred.");
          return navigation.navigate("loginFlow");
        }
        await firestore.establishCachedContent();

        if (!response.handle.length) return navigation.navigate("MakeProfile");

        Notifications.addNotificationReceivedListener(notification =>
          _handleNotification(notification, user)
        );

        Notifications.addNotificationResponseReceivedListener(notification =>
          _handleNotificationResponse(notification, user)
        );

        return navigation.navigate("homeFlow");
      });
    };
    routeState();
  }, []);

  return <LoadingPage />;
};

export default LoadingScreen;
