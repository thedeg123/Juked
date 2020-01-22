import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
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
  rating,
  avg_rating,
  rid,
  navigation,
  highlighted
}) => {
  return (
    <View
      style={[
        styles.overallStyle,
        {
          // override the background color if this song is highlighted
          backgroundColor: highlighted
            ? colors.highlight
            : colors.backgroundColor
        }
      ]}
    >
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.scoreStyle}>{rating}</Text>
      <Text style={styles.avgScoreStyle}>/ {avg_rating}</Text>
      <Text style={styles.hint}>average</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Review", { title, rid })}
      >
        <Feather name="message-square" style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 25,
    color: colors.text,
    flex: 1
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  },
  avgScoreStyle: {
    fontSize: 30,
    color: colors.shadow
  },
  hint: {
    fontSize: 10,
    color: colors.shadow
  }
});

export default AlbumPreview;
