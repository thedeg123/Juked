import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useMusic from "../hooks/useMusic";

const HomeScreen = ({ navigation }) => {
  const [state, findAlbums, findArtists, findTracks, searchAPI] = useMusic();
  useEffect(() => {
    findArtists("0OdUWJ0sBjDrqHygGUXeCF");
    console.log(state); //this doesnt print as it should. Is that becuase its printing before the promise is complete? I have no idea!
  }, []);
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
