import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReviewScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>ReviewScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ReviewScreen;
