//Provides margin on components
import React from "react";
import { View, StyleSheet } from "react-native";

const Container = ({ children }) => {
  return <View style={styles.containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10
  }
});

export default Container;
