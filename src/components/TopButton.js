//Provides margin on components
import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

const TopButton = ({ text }) => {
  return <Text style={styles.buttonStyle}>{text}</Text>;
};

const styles = StyleSheet.create({
  buttonStyle: {
    fontSize: 20,
    color: colors.primary,
    marginRight: 10
  }
});

export default TopButton;
