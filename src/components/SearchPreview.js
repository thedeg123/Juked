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
const SearchPreview = ({ object, type, cid, album_cid, navigation }) => {
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

  const getReleaseDate = () => {
    switch (type) {
      case "track":
        return object.album.release_date;
      case "album":
        return object.release_date;
      default:
        return null;
    }
  };
  const date = getReleaseDate() ? new Date(getReleaseDate()) : null;
  const stringDate = date
    ? `${date.toLocaleString("default", {
        month: "long"
      })} ${date.getDate()}, ${date.getFullYear()}`
    : "";
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={handleNavigate}>
      <Image style={styles.imageStyle} source={{ uri: getImage() }} />
      <View style={styles.textWrapperStyle}>
        <Text numberOfLines={1} style={styles.textStyle}>
          {object.name}
        </Text>
        <Text numberOfLines={1} style={styles.subtextStyle}>
          {object.artists ? object.artists[0].name : null}
        </Text>
        <Text numberOfLines={1} style={styles.dateStyle}>
          {stringDate}
        </Text>
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
    marginVertical: 5,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 85,
    backgroundColor: colors.object,
    borderBottomWidth: 1,
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
    flex: 10
  },
  textStyle: {
    fontSize: 20,
    color: colors.text
  },
  subtextStyle: {
    fontSize: 18,
    color: colors.text
  },
  dateStyle: {
    fontSize: 12,
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
