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
    bottom: 95, //we get it centered by taking (180/2) - (72/2) = 54
    marginRight: 74 //margin right = the width of user image + padding of box
  },
  numberStyle: {
    fontSize: 80,
    color: colors.secondary
  }
});

export default Rating;
