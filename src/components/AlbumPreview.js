import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
import { withNavigation } from "react-navigation";
/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this song
 * @param {integer} rating - your rating
 * @param {integer} avg_rating - average rating from users
 * @param {string} rid - any identifier for this song provided by spotify
 * @param {Object} navigation - navigation objected passed from screen
 * @param {boolean} highlighted - this song will be highlighted or not
 */
const AlbumPreview = ({
  navigation,
  content,
  review,
  avg_rating,
  highlighted
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.track_numberStyle}>{content.track_number}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WriteReview", {
            content: content,
            review
          })
        }
        style={{
          ...styles.containerStyle,
          backgroundColor: highlighted ? colors.highlight : colors.background
        }}
      >
        <Text style={styles.textStyle} numberOfLines={1}>
          {content.name}
        </Text>
        {review ? (
          <Text style={styles.scoreStyle}>{review.data.rating}</Text>
        ) : null}
        {review ? <Text style={styles.avgScoreStyle}>{avg_rating}</Text> : null}
        {review ? (
          <Feather name="message-square" style={styles.iconStyle} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 5,
    borderRadius: 2,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  track_numberStyle: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.shadow,
    fontWeight: "bold",
    marginRight: 5
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  },
  avgScoreStyle: {
    marginLeft: 5,
    fontSize: 30,
    color: colors.shadow
  },
  hint: {
    fontSize: 10,
    color: colors.shadow
  }
});

export default withNavigation(AlbumPreview);
