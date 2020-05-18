import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
const LikeBox = ({ onLike, liked, numLikes, onPress }) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={onLike}>
        <Ionicons
          style={styles.iconStyle}
          name={liked ? "md-heart" : "md-heart-empty"}
          color={liked ? colors.heat : colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity disabled={!numLikes} onPress={onPress}>
        <Text style={styles.textStyle}>
          {numLikes} {numLikes === 1 ? "like" : "likes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 90
  },
  iconStyle: {
    alignSelf: "center",
    fontSize: 40
  },
  textStyle: {
    alignSelf: "center",
    fontSize: 20,
    marginLeft: 5,
    color: colors.white
  }
});

export default LikeBox;
