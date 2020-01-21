import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ArtistScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.headerStyle}>{navigation.getParam("title")}</Text>
      <Text>music_id: {navigation.getParam("music_id")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ArtistScreen;
