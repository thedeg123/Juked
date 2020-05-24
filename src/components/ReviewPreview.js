import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import UserPreview from "./HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { withNavigation } from "react-navigation";

/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this artist, album or song
 * @param {integer} rating - your rating
 * @param {string} rid - unique review identifier assigned by database
 * @param {Object} navigation - navigation objected passed from screen
 */
const ReviewPreview = ({
  navigation,
  review,
  author,
  content,
  onPress,
  style
}) => {
  if (!author) return null;
  style = style || {};
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={async () => {
        onPress();
        return navigation.push("Review", {
          review,
          user: author,
          content
        });
      }}
    >
      <View
        style={{
          marginRight: 5
        }}
      >
        <UserPreview
          img={author.profile_url}
          username={author.handle}
          uid={author.id}
          size={25}
          color={colors.text}
          fontScaler={0.5}
        ></UserPreview>

        <Text
          style={{
            fontSize: 20,
            color: colors.primary,
            textAlign: "center"
          }}
        >
          {review.data.rating}
        </Text>
      </View>
      <Text numberOfLines={3} style={styles.textStyle}>
        {review.data.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 14,
    flex: 1,
    color: colors.text
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default withNavigation(ReviewPreview);
