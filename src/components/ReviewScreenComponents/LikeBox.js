import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const LikeBox = ({ onLike, liked, numLikes, onPress }) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          return onLike();
        }}
      >
        <Ionicons
          style={styles.iconStyle}
          name={liked ? "md-heart" : "md-heart-empty"}
          color={liked ? colors.heat : colors.veryTranslucentWhite}
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
    justifyContent: "space-between"
  },
  iconStyle: {
    alignSelf: "center",
    fontSize: 40
  },
  textStyle: {
    alignSelf: "center",
    fontSize: 18,
    marginHorizontal: 5,
    color: colors.white
  }
});

export default LikeBox;
