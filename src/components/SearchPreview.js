import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import images from "../constants/images";
import { withNavigation } from "react-navigation";
/**
 * SearchPreview Component for ListScreen
 * @param {string} title - title of this song/album/artist
 * @param {string} type - "Song"/"Album"/"Artist"
 * @param {string} music_id - original id from spotify
 */
const SearchPreview = ({ object, title, type, cid, album_cid, navigation }) => {
  const handleNavigate = () => {
    switch (type) {
      case "album":
        return navigation.navigate("Album", {
          content_id: cid,
          highlighted: ""
        });
      case "artist":
        return navigation.navigate("Artist", { content_id: cid });
      case "track":
        return navigation.navigate("Album", {
          content_id: album_cid,
          highlighted: cid
        });
      default:
        return;
    }
  };

  const getImage = () => {
    switch (type) {
      case "track":
        return object.album.images[0]
          ? object.album.images[0].url
          : images.artistDefault;
      case "album":
      case "artist":
        return object.images[0] ? object.images[0].url : images.artistDefault;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.overallStyle}>
        <Text style={styles.textStyle}>{title}</Text>
        <Image style={styles.imageStyle} source={{ uri: getImage() }} />
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  typeStyle: {
    fontSize: 20,
    color: colors.shadow
  },
  imageStyle: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.shadow
  }
});

export default withNavigation(SearchPreview);
