import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const Rating = ({ number, size }) => {
  number = number || " ";
  return (
    <View style={styles.containerStyle}>
      <Text
        style={{
          fontWeight: "500",
          color: colors.veryTranslucentWhite,
          fontSize: size || 40
        }}
      >
        {number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "flex-end",
    bottom: 7
  }
});

export default Rating;
