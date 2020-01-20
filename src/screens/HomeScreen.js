import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useMusic from "../hooks/useMusic";

//Starting tab navigator icon thing
const HomeScreen = ({ navigation }) => {
  //a few examples of useMusic in action!
  //information on returned objects can be found at: https://developer.spotify.com/documentation/web-api/reference/
  const {
    tracks,
    albums,
    artists,
    search,
    findAlbums,
    findArtists,
    findTracks,
    searchAPI
  } = useMusic();
  return (
    <View>
      <Text style={styles.headerStyle}>HomeScreen</Text>
      <Text>{artists ? `${artists.name}: ${artists.id}` : "none"}</Text>
      <Button
        onPress={() => {
          findArtists("0OdUWJ0sBjDrqHygGUXeCF");
          if (artists) console.log(Object.keys(artists));
        }}
        title="Find Artist ID"
      ></Button>
      <Text>{tracks ? `${tracks.name}: ${tracks.id}` : "none"}</Text>
      <Button
        onPress={() => {
          findTracks("11dFghVXANMlKmJXsNCbNl");
        }}
        title="Find Track ID"
      ></Button>
      <Text>{albums ? `${albums.name}: ${albums.id}` : "none"}</Text>
      <Button
        onPress={() => {
          findAlbums("0sNOF9WDwhWunNAHPD3Baj");
        }}
        title="Find Album ID"
      ></Button>
      <Text>
        {search
          ? `${search.artists.items[0].name}: ${search.artists.items[0].id}`
          : "none"}
      </Text>
      <Button
        onPress={() => {
          searchAPI("Bob Dylan", "artist");
        }}
        title='Search for "Bob Dylan" in artist'
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
