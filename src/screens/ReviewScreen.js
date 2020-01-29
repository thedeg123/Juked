import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReviewScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  const content_type = navigation.getParam("content_type");
  console.log(`We will write a review for ${content_type}:`, content_id);
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
