import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import colors from "../../constants/colors";
import UserPreview from "../HomeScreenComponents/UserPreview";
import ContentPic from "../HomeScreenComponents/ContentPic";
import { withNavigation } from "react-navigation";
import { getAbreveatedTimeDif } from "../../helpers/simplifyContent";

const FollowItem = ({ navigation, item, user }) => {
  return (
    <TouchableOpacity
      onPress={async () =>
        navigation.navigate("Profile", {
          uid: user.email
        })
      }
      style={styles.containerStyle}
      activeOpacity={0.8}
    >
      <View
        style={{ marginHorizontal: 10, flexDirection: "row", top: 7, flex: 1 }}
      >
        <UserPreview
          containerStyle={{ alignSelf: "center", marginRight: 5 }}
          img={user.profile_url}
          uid={item.data.author}
        ></UserPreview>
        <Text numberOfLines={2} style={[styles.textStyle, { flex: 1 }]}>
          {user.handle} followed you!
        </Text>
        <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
          {getAbreveatedTimeDif(item.data.last_modified)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: colors.text,
    alignSelf: "center",
    marginRight: 5,
    fontSize: 16
  },
  containerStyle: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightShadow
  }
});

export default withNavigation(FollowItem);
