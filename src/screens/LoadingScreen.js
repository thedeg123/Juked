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
        return navigation.navigate("MakeProfile");
        const response = await useFirestore.getUser(user.email);
        return response.handle.length
          ? navigation.navigate("mainFlow")
          : navigation.navigate("MakeProfile"); //if the user quits the app before making the profile.
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
