import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import images from "../constants/images";
import { withNavigation } from "react-navigation";
import navigateContent from "../helpers/navigateContent";
import ArtistNames from "./ArtistNames";
/**
 * SearchPreview Component for ListScreen
 * @param {string} title - title of this song/album/artist
 * @param {string} type - "Song"/"Album"/"Artist"
 * @param {string} music_id - original id from spotify
 */
const SearchPreview = ({ navigation, object, type }) => {
  const date = object.string_release_date;
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() =>
        navigateContent(
          navigation,
          object.cid,
          object.album_id,
          null,
          object,
          null
        )
      }
    >
      <Image
        style={styles.imageStyle}
        source={{ uri: object.image || images.artistDefault }}
      />
      <View style={styles.textWrapperStyle}>
        <Text numberOfLines={1} style={styles.textStyle}>
          {object.name}
        </Text>
        {object.artists ? (
          <ArtistNames
            artists={object.artists}
            allowPress={false}
            textStyle={styles.subtextStyle}
          ></ArtistNames>
        ) : null}
        {date ? (
          <Text numberOfLines={1} style={styles.dateStyle}>
            {date}
          </Text>
        ) : null}
      </View>
      <View style={styles.iconWrapper}>
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 5,
    marginTop: 2,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 85,
    borderBottomWidth: 0,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  iconWrapper: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 1
  },
  textWrapperStyle: {
    marginVertical: 5,
    flex: 10,
    justifyContent: "space-evenly",
    justifyContent: "center"
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.text,
    justifyContent: "center"
  },
  subtextStyle: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "400",
    color: colors.text
  },
  dateStyle: {
    fontSize: 14,
    fontWeight: "300",

    color: colors.text
  },
  typeStyle: {
    fontSize: 20,
    color: colors.shadow
  },
  imageStyle: {
    width: 70,
    aspectRatio: 1,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.shadow
  }
});

export default withNavigation(SearchPreview);
