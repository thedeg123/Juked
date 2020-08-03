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
      style={styles.showBox}
      onPress={() => navigation.push("Profile", { uid: user.email })}
    >
      <View style={styles.containerStyle}>
        <View style={{ borderRightWidth: 0.5, borderColor: colors.shadow }}>
          <Image
            style={styles.imageStyle}
            source={{ uri: user.profile_url || images.profileDefault }}
          />
        </View>
        <Text style={styles.textStyle}>{user.handle}</Text>
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
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    backgroundColor: colors.object,
    borderWidth: 0.5,
    borderColor: colors.shadow
  },
  showBox: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    flex: 1
  },
  numberStyle: {
    color: colors.primary,
    fontWeight: "300",
    fontSize: 30
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 25,
    marginLeft: 10,
    color: colors.text,
    flex: 1
  },
  imageStyle: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    width: 63,
    aspectRatio: 1,
    borderColor: colors.shadow,
    right: 2
  }
});

export default withNavigation(UserPreview);
