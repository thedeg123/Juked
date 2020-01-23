import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { Context as AuthContext } from "../context/AuthContext";

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
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LoadingScreen;
