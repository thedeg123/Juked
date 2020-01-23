//Provides margin on components
import React from "react";
import { View, StyleSheet } from "react-native";

const Container = ({ children }) => {
  return <View style={styles.containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 10,
    flex: 1
  }
});

export default Container;
