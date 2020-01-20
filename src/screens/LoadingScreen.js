import React, { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as firebase from "firebase";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      user ? navigation.navigate("mainFlow") : navigation.navigate("loginFlow");
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
