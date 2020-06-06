//Provides margin on components
import React from "react";
import { StyleSheet, Button, View } from "react-native";
import colors from "../../constants/colors";
import SpotifyButton from "./SpotifyButton";

const TopBar = ({ onClose, link }) => {
  return (
    <View style={styles.buttonWrapper}>
      <Button onPress={onClose} title="Done" />
      <SpotifyButton link={link}></SpotifyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  rating: {
    justifyContent: "center",
    alignSelf: "center",
    color: colors.secondary
  },
  buttonWrapper: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  subtitle: {
    fontSize: 20,
    color: colors.text,
    marginVertical: 5,
    fontWeight: "400"
  }
});

export default TopBar;
