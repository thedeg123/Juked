import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { auth } from "firebase";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../constants/colors";
import Container from "../components/Container";
import useFirestore from "../hooks/useFirestore";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        let response = null;
        //we  can get into a nasty situation where we navigate to this page before firestore has finished adding
        //the user to the database. Because of this if we cant find the user, we try,try,try again!
        do {
          console.log("waiting on:", user.email);
          response = await useFirestore.getUser(user.email);
        } while (!response);
        return response.handle.length
          ? navigation.navigate("mainFlow")
          : navigation.navigate("MakeProfile");
      }
      return navigation.navigate("loginFlow");
    });
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
