import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import ModalFilterButton from "./ModalFilterButton";
import colors from "../../constants/colors";

const ModalSortContent = ({
  showAlbums,
  showArtists,
  showSongs,
  onPress,
  shouldDisable
}) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
      <ModalFilterButton
        disabled={shouldDisable && !showAlbums && !showArtists && showSongs}
        title={"Songs"}
        onPress={() => onPress("track", showSongs)}
        show={showSongs}
      />
      <ModalFilterButton
        disabled={shouldDisable && showAlbums && !showArtists && !showSongs}
        title={"Albums"}
        onPress={() => onPress("album", showAlbums)}
        show={showAlbums}
      />
      <ModalFilterButton
        disabled={shouldDisable && !showAlbums && showArtists && !showSongs}
        title={"Artists"}
        onPress={() => onPress("artist", showArtists)}
        show={showArtists}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    borderRadius: 5
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

ModalSortContent.defaultProps = {
  shouldDisable: false
};

export default ModalSortContent;
