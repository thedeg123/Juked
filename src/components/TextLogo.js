import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

const TextLogo = ({ subtext }) => {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.text}>
        <Text style={styles.headerText}>Juked</Text>
        <Text style={styles.subHeaderText}>{subtext}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "flex-start",
    flex: 1,
    margin: 10,
    marginBottom: 0
  },
  headerText: {
    fontSize: 65,
    fontWeight: "bold",
    color: colors.white
  },
  subHeaderText: {
    fontSize: 36,
    color: colors.text
  }
});

export default TextLogo;
