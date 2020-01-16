import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlbumScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>AlbumScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default AlbumScreen;
