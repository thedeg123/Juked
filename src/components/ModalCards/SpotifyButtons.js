//Provides margin on components
import React, { useContext } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Image,
  View
} from "react-native";

import colors from "../../constants/colors";
import context from "../../context/context";
import { Entypo } from "@expo/vector-icons";

const Wrapper = ({ children, onPress }) => (
  <TouchableOpacity style={styles.wrapper} onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const Icon = () => (
  <Image
    style={{ width: 20, aspectRatio: 1, marginRight: 5 }}
    source={require("../../../assets/logos/spotify_logo.png")}
  />
);

const SpotifyText = ({ text }) => <Text style={styles.textStyle}>{text}</Text>;

export const OpenButton = ({ link }) => {
  return (
    <Wrapper onPress={() => Linking.openURL(link)}>
      <Icon />
      <View style={{ justifyContent: "center" }}>
        <SpotifyText text="Open in Spotify" />
      </View>
    </Wrapper>
  );
};

export const PlayButton = ({ content }) => {
  const { useMusic } = useContext(context);
  return (
    <Wrapper onPress={() => useMusic.playContent(content)}>
      <Entypo name="controller-play" size={20} color={colors.spotifyText} />
      <View style={{ justifyContent: "center" }}>
        <SpotifyText text="Play Preview" />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    marginHorizontal: 5,
    flexDirection: "row",
    backgroundColor: colors.spotifyBackground,
    padding: 5,
    borderRadius: 5,
    justifyContent: "center"
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.spotifyText
  }
});
