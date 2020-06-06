import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { withNavigation } from "react-navigation";
/**
 * ListPreview Component for ListScreen
 * @param {string} result album object from spotify API
 * @param {Object} navigation - navigation objected passed from screen
 */
const ArtistPreview = ({ navigation, content }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
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
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 5
  },
  spacingStyle: {
    flex: 1,
    justifyContent: "space-between"
  },
  imageStyle: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.lightShadow,
    borderRadius: 5
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

export default withNavigation(ArtistPreview);
