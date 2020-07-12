import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const ReviewTitle = ({ title }) => {
  return (
    <View style={styles.containerStyle}>
      <Text numberOfLines={1} style={styles.textStyle}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "stretch",
    marginLeft: 5,
    paddingVertical: 2,
    bottom: 23
  },
  textStyle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.translucentWhite
  }
});
export default ReviewTitle;
