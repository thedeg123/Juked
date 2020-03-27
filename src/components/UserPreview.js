import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import images from "../constants/images";
import { withNavigation } from "react-navigation";

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
      <View style={styles.containerStyle}>
        <Image
          style={styles.imageStyle}
          source={{ uri: profile_url || images.profileDefault }}
        />
        <Text style={styles.textStyle}>@{handle}</Text>
        <View style={styles.iconWrapper}>
          <EvilIcons name="chevron-right" style={styles.iconStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 5,
    marginVertical: 5,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 85,
    backgroundColor: colors.object,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconWrapper: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 1,
    left: 6
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 25,
    color: colors.text,
    flex: 1
  },
  imageStyle: {
    width: 70,
    aspectRatio: 1,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.shadow
  }
});

export default withNavigation(UserPreview);
