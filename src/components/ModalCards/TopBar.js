//Provides margin on components
import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import colors from "../../constants/colors";
import { OpenButton, PlayButton } from "./SpotifyButtons";

const TopBar = ({ onClose, content, showSpotify }) => {
  return (
    <View style={styles.buttonWrapper}>
      <View>
        {showSpotify && content && content.preview_url && (
          <PlayButton content={content} />
        )}
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: colors.primary, fontSize: 18, margin: 10 }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      {showSpotify && content && content.url && (
        <View>
          <OpenButton link={content.url} />
        </View>
      )}
    </View>
  );
};

TopBar.defaultProps = {
  showSpotify: true
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
