import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const LikeBox = ({ onPress, liked, numLikes }) => {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onPress}>
      <Ionicons
        style={styles.iconStyle}
        name={liked ? "md-heart" : "md-heart-empty"}
        color={liked ? colors.heat : colors.text}
      />
      <Text style={styles.textStyle}>{numLikes}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    borderWidth: 1,
    marginTop: 20,
    justifyContent: "space-between",
    width: 90
  },
  iconStyle: {
    alignSelf: "center",
    fontSize: 40,
    marginTop: 5
  },
  textStyle: {
    alignSelf: "center",
    fontSize: 30,
    color: colors.text
  }
});

export default LikeBox;
