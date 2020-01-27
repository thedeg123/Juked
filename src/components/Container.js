//Provides margin on components
import React from "react";
import { View, StyleSheet } from "react-native";

const Container = ({ children }) => {
  return <View style={styles.containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    margin: 10,
    marginBottom: 0
  }
});

export default Container;
