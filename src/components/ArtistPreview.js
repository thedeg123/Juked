import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
/**
 * ListPreview Component for ListScreen
 * @param {string} result album object from spotify API
 * @param {Object} navigation - navigation objected passed from screen
 */
const ArtistPreview = ({ result, navigation }) => {
  // check if there is a picture with height 300px
  const hasOne = result.images.find(i => i.height == 300);
  let date = new Date(result.release_date); //casting date to a date object
  const imageSource = { uri: hasOne ? hasOne.url : result.images[0].url };
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => navigation.navigate("Album", { content_id: result.id })}
    >
      <Image style={styles.imageStyle} source={imageSource} />
      <Text style={styles.textStyle} numberOfLines={1}>
        {result.name}
      </Text>
      <Text style={styles.dateStyle}>{`${date.toLocaleString("default", {
        month: "long"
      })} ${date.getDate()}, ${date.getFullYear()}`}</Text>
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
