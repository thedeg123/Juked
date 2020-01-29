import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * UserPreview Component for ListScreen
 * @param {string} handle - username of this user
 * @param {Object} profile_url - information regards of the image of user's avatar
 * @param {string} id - user's Id, if needed
 * @param {Object} navigation - navigation objected passed from screen
 */
const UserPreview = ({ handle, profile_url, uid, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile", { uid })}>
      <View style={styles.overallStyle}>
        <Text style={styles.textStyle}>{handle}</Text>
        <Image style={styles.imageStyle} source={{ uri: profile_url }} />
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  imageStyle: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.shadow
  }
});

export default UserPreview;
