import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const ReviewTitle = ({ title }) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "stretch",
    justifyContent: "center",
    marginLeft: 84,
    bottom: 100,
    height: 75
  },
  textStyle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: colors.primary
  }
});

ReviewTitle.defaultProps = {
  title: ""
};
export default ReviewTitle;
