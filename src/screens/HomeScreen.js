import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useMusic from "../hooks/useMusic";

const HomeScreen = ({ navigation }) => {
  const [songs, err, searchAPI] = useMusic();
  console.log(songs, err);
  return (
    <View>
      <Text style={styles.headerStyle}>HomeScreen</Text>
      <Button
        onPress={() => {
          navigation.navigate("Artist");
        }}
        title="Go to Review"
      ></Button>
      <Button
        onPress={() => {
          navigation.navigate("Artist");
        }}
        title="Go to Artist"
      ></Button>
      <Button
        onPress={() => {
          navigation.navigate("Artist");
        }}
        title="Go to Artist"
      ></Button>

      <Button
        onPress={() => {
          navigation.navigate("Profile");
        }}
        title="Go to Profile"
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
