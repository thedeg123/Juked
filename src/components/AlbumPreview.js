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
  title,
  content_id,
  rating,
  avg_rating,
  rid,
  navigation,
  highlighted
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WriteReview", {
          content_id,
          rid,
          content_type: "track"
        })
      }
      style={[
        styles.overallStyle,
        {
          backgroundColor: highlighted ? colors.highlight : colors.background // override the background color if this song is highlighted
        }
      ]}
    >
      <Text style={styles.textStyle} numberOfLines={1}>
        {title}
      </Text>
      {rating ? <Text style={styles.scoreStyle}>{rating}</Text> : null}
      {avg_rating ? (
        <Text style={styles.avgScoreStyle}>{avg_rating}</Text>
      ) : null}
      {rid ? <Feather name="message-square" style={styles.iconStyle} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 5,
    borderRadius: 2,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
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
