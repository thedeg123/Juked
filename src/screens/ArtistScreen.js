import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";
import useFirestore from "../hooks/useFirestore";
import { auth } from "firebase";
import ArtistPreview from "../components/ArtistPreview";
import colors from "../constants/colors";
import Container from "../components/Container";

const ArtistScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const email = auth().currentUser.email;

  // data from spotify
  const { findArtists, findAlbumsOfAnArtist } = useMusic();
  const [albums, setAlbums] = useState(null);
  const [artist, setArtist] = useState(null);

  // data from review database
  const [rating, setRating] = useState(null);
  const [avg_rating, setAvg_rating] = useState(null);

  useEffect(() => {
    // init and get all data needed via api
    const getDatabaseResult = async (uid, music_id) => {
      const artistReview = useFirestore.getReviewsByAuthorContent(
        uid,
        music_id
      );
      setRating(artistReview.rating);
      setAvg_rating(5);
    };

    findArtists(music_id).then(artists => setArtist(artists[0]));
    findAlbumsOfAnArtist(music_id).then(result => {
      setAlbums(result.items);
    });
    //getDatabaseResult(email, music_id);
  }, []);

  if (!artist) return <View></View>;

  // render header information component
  const headerComponent = (
    <View style={{ alignItems: "center" }}>
      <Image
        style={{
          width: "50%",
          aspectRatio: artist.images[0].width / artist.images[0].height
        }}
        source={{
          uri: artist.images[0].url
        }}
      />
      <Text style={styles.title}>{artist.name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.subtitle}>
          Your rating: <Text style={styles.rating}>{rating}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Average rating: <Text style={styles.rating}>{avg_rating}</Text>
        </Text>
      </View>
    </View>
  );

  // render main component
  return (
    <Container style={styles.container}>
      <FlatList
        data={albums}
        keyExtracter={({ item }) => item.name}
        renderItem={({ item }) => {
          return <ArtistPreview result={item} navigation={navigation} />;
        }}
        columnWrapperStyle={styles.column}
        numColumns={2}
        ListHeaderComponent={headerComponent}
        ListHeaderComponentStyle={{ alignItems: "center" }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    flex: 1
  },
  column: { flexShrink: 1, width: "50%" },
  title: { fontSize: 30, color: colors.text },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    padding: 10,
    paddingBottom: 40
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default ArtistScreen;
