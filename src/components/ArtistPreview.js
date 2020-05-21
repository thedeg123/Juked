import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
/**
 * ListPreview Component for ListScreen
 * @param {string} result album object from spotify API
 * @param {Object} navigation - navigation objected passed from screen
 */
const ArtistPreview = ({ content, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => navigation.push("Album", { content_id: content.id })}
    >
      <Image style={styles.imageStyle} source={{ uri: content.image }} />
      <Text style={styles.textStyle} numberOfLines={1}>
        {content.name}
      </Text>
      <Text>{content.string_release_date}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: 5
  },
  spacingStyle: {
    flex: 1,
    justifyContent: "space-between"
  },
  imageStyle: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 3
  },
  textStyle: {
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 5
  },
  dateStyle: {
    fontSize: 12,
    color: colors.text,
    paddingHorizontal: 5
  }
});

export default ArtistPreview;
