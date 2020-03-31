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
    bottom: 5
  },
  numberStyle: {
    fontSize: 50,
    color: colors.primary
  }
});

export default Rating;
