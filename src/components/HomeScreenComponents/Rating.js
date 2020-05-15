import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import PropTypes from "prop-types";

const Rating = ({ number }) => {
  number = number === null ? " " : number;
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.numberStyle}>{number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "flex-end",
    bottom: 7
  },
  numberStyle: {
    fontSize: 40,

    fontWeight: "500",
    color: colors.primary
  }
});

export default Rating;
