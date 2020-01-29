import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * SearchPreview Component for ListScreen
 * @param {string} title - title of this song/album/artist
 * @param {string} type - "Song"/"Album"/"Artist"
 * @param {string} music_id - original id from spotify
 * @param {Object} navigation - navigation objected passed from screen
 */
const SearchPreview = ({ object, title, type, music_id, navigation }) => {
  const handleNavigate = () => {
    switch (type) {
      case "track":
        console.log("Pressed song " + music_id); // TODO: navigation undefined in lucidchart
        break;
      case "album":
        navigation.navigate("Album", {
          music_id: music_id,
          title: title
        });
        break;
      case "artist":
        navigation.navigate("Artist", {
          music_id: music_id,
          title: title
        });
        break;
      default:
        break;
    }
  };

  const getImage = () => {
    switch (type) {
      case "track":
        return object.album.images[0].url;
      case "album":
        return object.images[0].url;
      case "artist":
        return object.images[0].url;
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

export default SearchPreview;
