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
  const imageSource = { uri: hasOne ? hasOne.url : result.images[0].url };
  return (
    <View>
      <TouchableOpacity
        style={styles.overallStyle}
        onPress={() => navigation.navigate("Album", { content_id: result.id })}
      >
        <Image style={styles.imageStyle} source={imageSource} />
        <Text style={styles.textStyle} numberOfLines={1}>
          {result.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1
  },
  imageStyle: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 4
  },
  textStyle: {
    fontSize: 18,
    color: colors.text,
    flex: 1,
    paddingHorizontal: 5
  }
});

export default ArtistPreview;
