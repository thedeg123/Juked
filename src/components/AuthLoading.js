import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../constants/colors";

const AuthLoading = () => {
  return (
    <View style={styles.containerStyle}>
      <ActivityIndicator size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "center",
    width: 300,
    borderRadius: 5,
    padding: 7,
    margin: 5,
    backgroundColor: colors.white
  },
  titleText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary
  }
});

export default AuthLoading;
