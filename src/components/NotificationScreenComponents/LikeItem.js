import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import colors from "../../constants/colors";
import UserPreview from "../HomeScreenComponents/UserPreview";
import ContentPic from "../HomeScreenComponents/ContentPic";
import { withNavigation } from "react-navigation";
import { getAbreveatedTimeDif } from "../../helpers/simplifyContent";

const LikeItem = ({ navigation, fetchReview, item, user, currentUser }) => {
  return (
    <TouchableOpacity
      onPress={async () =>
        navigation.navigate("Review", {
          review: await fetchReview(),
          user: currentUser,
          content: item.data.content
        })
      }
      style={styles.containerStyle}
      activeOpacity={0.8}
    >
      <View style={{ marginLeft: 10, flexDirection: "row", top: 7, flex: 1 }}>
        <UserPreview
          containerStyle={{ alignSelf: "center", marginRight: 5 }}
          img={user.profile_url}
          uid={item.data.author}
        ></UserPreview>
        <Text numberOfLines={2} style={[styles.textStyle, { flex: 1 }]}>
          {user.handle} liked your review of {item.data.content.name}
        </Text>
        <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
          {getAbreveatedTimeDif(item.data.last_modified)}
        </Text>
      </View>
      <ContentPic
        style={{ marginRight: 10 }}
        img={item.data.content.image}
        width={60}
      ></ContentPic>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: colors.text,
    alignSelf: "center",
    marginRight: 5,
    fontSize: 16,
    bottom: 5
  },
  containerStyle: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightShadow,
    justifyContent: "space-between"
  }
});

export default withNavigation(LikeItem);
