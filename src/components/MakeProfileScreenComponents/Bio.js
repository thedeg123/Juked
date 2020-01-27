import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Bio = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>Bio</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 10
  }
});

export default Bio;
