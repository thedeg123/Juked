import React, { useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { auth } from "firebase";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../constants/colors";
import Container from "../components/Container";
import context from "../context/context";

const LoadingScreen = ({ navigation }) => {
  let { firestore } = useContext(context);
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
              console.log(
                "Request failed after 10 tries, this user is likely not in the database."
              );
              return navigation.navigate("loginFlow");
            }
            count++;
            console.log("waiting on:", user.email, "try number", count);
            response = await firestore.getUser(user.email);
          } while (!response);
          return response.handle.length
            ? navigation.navigate("homeFlow")
            : navigation.navigate("MakeProfile");
        }
        return navigation.navigate("loginFlow");
      });
    };
    const listener = navigation.addListener("didFocus", () => routeState()); //any time we return to this screen we do another fetch
    return () => listener.remove(); //prevents memory leaks if the loadingScreen is ever closed
  }, []);

  return (
    <Container>
      <LoadingIndicator></LoadingIndicator>
    </Container>
  );
};

const styles = StyleSheet.create({
  style: {
    backgroundColor: colors.background
  }
});

export default LoadingScreen;
