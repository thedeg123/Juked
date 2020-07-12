import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import LoadingIndicator from "./LoadingIndicator";

const LoadingPage = () => {
  return (
    <View style={styles.indicatorStyle}>
      <LoadingIndicator></LoadingIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorStyle: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "300",
    color: colors.shadow,
    textAlign: "center"
  }
});

export default LoadingPage;
