import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { auth } from "firebase";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../constants/colors";
import Container from "../components/Container";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("mainFlow");
      } else {
        navigation.navigate("loginFlow");
      }
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
