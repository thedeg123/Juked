import React from "react";
import { StyleSheet, ActivityIndicator, Text, View } from "react-native";

const LoadingIndicator = () => {
  return (
    <View style={styles.indicatorStyle}>
      <ActivityIndicator size="large" />
      <Text style={styles.textStyle}>Loading</Text>
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
    textAlign: "center"
  }
});

export default LoadingIndicator;
