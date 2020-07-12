import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import images from "../constants/images";
import { withNavigation } from "react-navigation";
import navigateContent from "../helpers/navigateContent";
import ArtistNames from "./ArtistNames";
import { AntDesign } from "@expo/vector-icons";

/**
 * SearchPreview Component for ListScreen
 * @param {string} title - title of this song/album/artist
 * @param {string} type - "Song"/"Album"/"Artist"
 * @param {string} music_id - original id from spotify
 */
const SearchPreview = ({
  navigation,
  object,
  addItem,
  onItemAdd,
  onItemRemove,
  itemKeys
}) => {
  const itemAdded = addItem && itemKeys && itemKeys.has(object.id);
  const date = object.string_release_date;

  const renderRightIcon = () => {
    if (addItem) {
      return itemAdded ? (
        <AntDesign name="checkcircle" style={styles.addItemIconStyle} />
      ) : (
        <AntDesign name="pluscircle" style={styles.addItemIconStyle} />
      );
    } else {
      return <EvilIcons name="chevron-right" style={styles.iconStyle} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => {
        if (addItem) {
          itemAdded ? onItemRemove(object) : onItemAdd(object);
        } else {
          navigateContent(
            navigation,
            object.cid,
            object.album_id,
            null,
            object,
            null
          );
        }
      }}
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
      <View style={styles.iconWrapper}>{renderRightIcon()}</View>
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
  addItemIconStyle: {
    fontSize: 20,
    color: colors.primary,
    paddingRight: 10,
    marginLeft: 5
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
    borderWidth: 0.5,
    borderColor: colors.lightShadow
  }
});

export default withNavigation(SearchPreview);
