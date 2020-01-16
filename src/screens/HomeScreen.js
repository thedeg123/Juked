import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.headerStyle}>HomeScreen</Text>
      <Button
        onPress={() => navigation.navigate("Review")}
        title="Go to Review"
      ></Button>
      <Button
        onPress={() => navigation.navigate("Album")}
        title="Go to Review"
      ></Button>
      <Button
        onPress={() => navigation.navigate("Artist")}
        title="Go to Review"
      ></Button>
      <Button
        onPress={() => navigation.navigate("Profile")}
        title="Go to Review"
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default HomeScreen;
