import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ArtistScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>ArtistScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ArtistScreen;
