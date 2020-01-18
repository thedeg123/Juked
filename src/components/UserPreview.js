import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * UserPreview Component for ListScreen
 * @param {string} username - username of this user
 * @param {Object} avatar - information regards of the image of user's avatar
 * @param {string} id - user's Id, if needed
 * @param {onPressCallback} callback - the callback jumping to this user's ProfileScreen(undefined yet)
 */
const UserPreview = ({ username, avatar, id, callback }) => {
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{username}</Text>
      <Image style={styles.imageStyle} source={avatar} />
      <TouchableOpacity onPress={callback}>
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  imageStyle: {
    width: 30,
    height: 30
  }
});

export default UserPreview;
