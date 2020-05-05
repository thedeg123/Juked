import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import images from "../constants/images";
import { withNavigation } from "react-navigation";

/**
 * UserPreview Component for ListScreen
 * @param {Object} User - a user profile object
 * @param {Object} navigation - navigation objected passed from screen
 */
const UserPreview = ({ navigation, user }) => {
  if (!user) {
    return <View></View>;
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.push("Profile", { uid: user.email })}
    >
      <View style={styles.containerStyle}>
        <Image
          style={styles.imageStyle}
          source={{ uri: user.profile_url || images.profileDefault }}
        />
        <Text style={styles.textStyle}>@{user.handle}</Text>
        <View style={styles.iconWrapper}>
          <Text style={styles.numberStyle}>
            {user.review_data ? user.review_data.reduce((a, b) => a + b) : 0}
          </Text>
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
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 85,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.secondary
  },
  numberStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
    width: 84,
    aspectRatio: 1,
    borderRadius: 5,
    borderColor: colors.secondary,
    borderWidth: 2,
    right: 2
  }
});

export default withNavigation(UserPreview);
