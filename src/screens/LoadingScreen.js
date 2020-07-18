import React, { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { auth } from "firebase";
import LoadingPage from "../components/Loading/LoadingPage";
import colors from "../constants/colors";
import Container from "../components/Container";
import context from "../context/context";

const LoadingScreen = ({ navigation }) => {
  let { firestore } = useContext(context);
  const awaitFunc = async (email, count) =>
    await setTimeout(
      () => console.log("waiting on:", email, "try number", count),
      500
    );
  useEffect(() => {
    const routeState = () => {
      return auth().onAuthStateChanged(async user => {
        if (user) {
          let response = null;
          let count = 0;
          //we  can get into a nasty situation where we navigate to this page before firestore has finished adding
          //the user to the database. Because of this if we cant find the user, we try,try,try again! But only 10 times.
          do {
            if (count === 10) {
              Alert.alert("Failed to signin", "Sorry, an unknown error occurred.")
              return navigation.navigate("loginFlow");
            }
            count++;
            response = await firestore.getUser(user.email);
            await awaitFunc(user.email, count)
          } while (!response);
          firestore._establisCachedListenList();
          return response.handle.length
            ? navigation.navigate("homeFlow")
            : navigation.navigate("MakeProfile");
        }
        return navigation.navigate("loginFlow");
      });
    };
    routeState()
  }, []);

  return <LoadingPage></LoadingPage>;
};

export default LoadingScreen;
