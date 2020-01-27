import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { Context as AuthContext } from "../context/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../constants/colors";
import Container from "../components/Container";

const LoadingScreen = ({ navigation }) => {
  const { setuid } = useContext(AuthContext);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setuid(user.email);
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
