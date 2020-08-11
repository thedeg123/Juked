import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import colors from "../../constants/colors";
import UserPreview from "../HomeScreenComponents/UserPreview";
import ContentPic from "../HomeScreenComponents/ContentPic";
import { withNavigation } from "react-navigation";
import { getAbreveatedTimeDif } from "../../helpers/simplifyContent";

const CommentItem = ({ navigation, fetchReview, item, user, currentUser }) => {
  return (
    <TouchableOpacity
      onPress={async () =>
        navigation.navigate("Review", {
          review: await fetchReview(),
          user: currentUser,
          content: item.data.content
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.topContainerStyle}>
        <View style={styles.containerStyle}>
          <View
            style={{ marginLeft: 10, flexDirection: "row", top: 7, flex: 1 }}
          >
            <UserPreview
              containerStyle={{ alignSelf: "center", marginRight: 10 }}
              img={user.profile_url}
              uid={item.data.author}
            ></UserPreview>
            <Text numberOfLines={3} style={[styles.textStyle, { flex: 1 }]}>
              <Text style={{ fontWeight: "bold" }}>
                {user.email == currentUser.email ? "You" : user.handle}{" "}
              </Text>
              commented on your review of
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {item.data.content.name}{" "}
              </Text>
            </Text>
            <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
              {getAbreveatedTimeDif(item.data.last_modified)}
            </Text>
          </View>
          <ContentPic
            borderRadius={{ borderRadius: 5 }}
            borderWidth={{ marginRight: 10 }}
            content={item.data.content}
            showPlay
          ></ContentPic>
        </View>
        <View
          style={{
            alignSelf: "center",
            backgroundColor: colors.secondary,
            paddingHorizontal: 15,
            marginHorizontal: 5,
            borderRadius: 5,
            paddingVertical: 5
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              textAlign: "center"
            }}
          >
            {item.data.text}
          </Text>
        </View>
      </View>
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
    marginVertical: 5,
    justifyContent: "space-between"
  },
  topContainerStyle: {
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightShadow
  }
});

export default withNavigation(CommentItem);
