import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";

// if redirect from an album: music_id(album spotify ID), highlighted("")
// if redirect from a song: music_id(""), highlighted(song spotify ID)
const AlbumScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  const highlighted = navigation.getParam("highlighted");
  const { albums, findAlbums } = useMusic();

  // get basic knowledge from spotify
  useEffect(() => {
    if (music_id) findAlbums(music_id);
    else {
      // if redirect from a song, save the album object to albums
      findAlbumsOfATrack(music_id);
    }
  });

  // suppose we have the states imported from useMusic
  // albums (spotify API documentation for more details)

  const headerComponent = (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: "50%",
            aspectRatio: albums.images[0].width / albums.images[0].height
          }}
          source={{
            uri: albums.images[0].url
          }}
        />
        <View style={{ alignItems: "center", width: "50%" }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>
            {albums.artists.reduce((acc, cur) => `${acc}; ${cur}`)}
          </Text>
          <Text style={styles.text}>{`${albums.release_date}`}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.subtitle}>
          Your rating: <Text style={styles.rating}>{albumRating}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Average rating: <Text style={styles.rating}>{albumAvg_rating}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={albums.tracks}
        keyExtracter={({ item }) => item.track_number}
        renderItem={({ item }) => {
          return (
            <AlbumPreview
              title={item.title}
              rating={ratings[item.track_number].rating}
              avg_rating={avg_ratings[item.track_number]}
              rid={ratings[item.track_number].rid}
              highlighted={highlighted == item.id}
            />
          );
        }}
        ListHeaderComponent={headerComponent}
        ListHeaderComponentStyle={{ alignItems: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    flex: 1
  },
  headerContainer: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
    marginHorizontal: 10
  },
  title: { fontSize: 25, color: colors.text, textAlign: "center" },
  subtitle: {
    fontSize: 20,
    color: colors.text,
    padding: 10,
    paddingBottom: 40
  },
  text: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center"
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default AlbumScreen;
