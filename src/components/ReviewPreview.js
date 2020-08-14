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
      style={{ ...styles.container, ...style }}
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
          flexDirection: "row",
          alignSelf: "stretch",
          justifyContent: "space-between"
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: colors.primary
          }}
        >
          {review.data.rating}/10
        </Text>
        <UserPreview
          img={author.profile_url}
          uid={author.id || author.email}
          horizontal
          username={author.handle}
          size={30}
          color={colors.text}
          fontScaler={0.5}
        ></UserPreview>
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
    paddingBottom: 5,
    borderColor: colors.lightShadow
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 16,
    color: colors.text
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default withNavigation(ReviewPreview);
