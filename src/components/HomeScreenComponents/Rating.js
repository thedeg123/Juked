import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const Rating = ({ number }) => {
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
    borderWidth: 1,
    marginRight: 64 //margin right = the width of user image
  },
  numberStyle: {
    fontSize: 80,
    color: colors.secondary
  }
});

export default Rating;
