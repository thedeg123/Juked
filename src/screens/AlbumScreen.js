import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";

const AlbumScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  const { albums, findAlbums } = useMusic();

  // get basic knowledge from spotify
  useEffect(() => {
    findAlbums(music_id);
  });

  const headerComponent = (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: "50%",
            aspectRatio: images[0].width / images[0].height
          }}
          source={{
            uri: images[0].url
          }}
        />
        <View style={{ alignItems: "center", width: "50%" }}>
          <Text style={styles.title}>World's End Girlfriend</Text>
          <Text style={styles.text}>By Artist</Text>
          <Text style={styles.text}>1999</Text>
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
        data={l}
        keyExtracter={({ item }) => item.track_number}
        renderItem={({ item }) => {
          return (
            <AlbumPreview
              title={item.title}
              rating={4}
              avg_rating={5}
              rid={"23452"}
              highlighted={false}
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
    marginTop: 5
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default AlbumScreen;
