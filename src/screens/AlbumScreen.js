import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";
import useFirestore from "../hooks/useFirestore";
import { auth } from "firebase";
import AlbumPreview from "../components/AlbumPreview";
import colors from "../constants/colors";
import Container from "../components/Container";

// if redirect from an album: music_id(album spotify ID), highlighted("")
// if redirect from a song: music_id(""), highlighted(song spotify ID)
const AlbumScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const highlighted = navigation.getParam("highlighted");
  const email = auth().currentUser.email;

  // data from spotify
  const { findAlbums, findAlbumsOfATrack } = useMusic();
  const [album, setAlbum] = useState();

  // data from review database
  const [ratings, setRatings] = useState(null);
  const [avg_ratings, setAvg_ratings] = useState(null);
  const [albumRating, setAlbumRating] = useState(null);
  const [albumAvg_rating, setAlbumAvg_rating] = useState(null);
  const getDatabaseResult = async (uid, album_id, track_ids) => {
    const albumReview = useFirestore.getReviewsByAuthorContent(uid, album_id);
    const trackReviews = track_ids.map(obj =>
      useFirestore.getReviewsByAuthorContent(uid, track_ids)
    );
    setAlbumRating(albumReview.rating);
    setRatings(trackReviews.rating);
    // haven't decided how to deal with avg ratings yet!
    setAvg_ratings(5);
    setAlbumAvg_rating(5);
  };

  // initialization
  const init = async () => {
    const album = music_id
      ? await findAlbums(music_id)
      : await findAlbumsOfATrack(music_id);
    setAlbum(album[0]);

    try {
      if (album) {
        const track_ids = album.tracks.items.map(obj => obj.id);
        getDatabaseResult(email, music_id, track_ids);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // suppose we have the states imported from useMusic
  if (!album) return <View></View>;
  const headerComponent = (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: "50%",
            aspectRatio: album.images[0].width / album.images[0].height
          }}
          source={{
            uri: album.images[0].url
          }}
        />
        <View style={{ alignItems: "center", width: "50%" }}>
          <Text style={styles.title}>{album.name}</Text>
          <Text style={styles.text}>
            {album.artists.map(artist => artist.name).join("; ")}
          </Text>
          <Text style={styles.text}>{`${album.release_date}`}</Text>
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

  // album preview props:
  /*
  title={item.name}
              rating={ratings[item.track_number-1].rating}
              avg_rating={avg_ratings[item.track_number-1]}
              rid={ratings[item.track_number-1].rid}
              highlighted={highlighted == item.id}
  */
  return (
    <Container style={styles.container}>
      <FlatList
        data={album.tracks.items}
        keyExtracter={({ item }) => item.track_number}
        renderItem={({ item }) => {
          //console.log(item);
          return (
            <AlbumPreview
              title={item.name}
              rating={0}
              avg_rating={5}
              rid={0}
              highlighted={true}
            />
          );
        }}
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
