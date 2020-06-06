//Provides margin on components
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Image,
  View
} from "react-native";
import colors from "../../constants/colors";

const SpotifyButton = ({ link }) => {
  return (
    <TouchableOpacity
      style={{
        marginTop: 5,
        marginHorizontal: 5,
        flexDirection: "row",
        backgroundColor: colors.spotifyBackground,
        paddingHorizontal: 5,
        borderRadius: 5,
        justifyContent: "center"
      }}
      onPress={() => Linking.openURL(link)}
    >
      <Image
        style={{ width: 20, aspectRatio: 1, marginTop: 7, marginRight: 5 }}
        source={require("../../../assets/logos/spotify_logo.png")}
      ></Image>
      <View style={{ justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: colors.spotifyText
          }}
        >
          Open In Spotify
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rating: {
    justifyContent: "center",
    alignSelf: "center",
    color: colors.secondary
  },
  subtitle: {
    fontSize: 20,
    color: colors.text,
    marginVertical: 5,
    fontWeight: "400"
  }
});

export default SpotifyButton;
