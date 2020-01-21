import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ArtistScreen = ({ music_id }) => {
  return (
    <View>
      <Text style={styles.headerStyle}>ArtistScreen</Text>
      <Text>{music_id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ArtistScreen;
