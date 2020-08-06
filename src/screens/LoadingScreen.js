import React, { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { auth } from "firebase";
import LoadingPage from "../components/Loading/LoadingPage";
import context from "../context/context";

const LoadingScreen = ({ navigation }) => {
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

  //

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
        return response.handle.length
          ? navigation.navigate("homeFlow")
          : navigation.navigate("MakeProfile");
      });
    };
    routeState();
  }, []);

  return <LoadingPage />;
};

export default LoadingScreen;
