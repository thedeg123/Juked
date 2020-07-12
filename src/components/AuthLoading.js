import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";
import LoadingIndicator from "./Loading/LoadingIndicator";

const AuthLoading = () => {
  return (
    <View style={styles.containerStyle}>
      <LoadingIndicator color={colors.primary} size={20}></LoadingIndicator>
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
  }
});

export default AuthLoading;
