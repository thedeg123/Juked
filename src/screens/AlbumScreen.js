import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";
import { auth } from "firebase";
import AlbumPreview from "../components/AlbumPreview";
import colors from "../constants/colors";
import Container from "../components/Container";
import LoadingIndicator from "../components/LoadingIndicator";
import ReviewButton from "../components/ReviewButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";

// if redirect from an album: content_id(album spotify ID), highlighted("")
// if redirect from a song: content_id(album spotify ID), highlighted(song spotify ID)
const AlbumScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  const highlighted = navigation.getParam("highlighted");
  const email = auth().currentUser.email;
  let firestore = useContext(context);
  // data from spotify
  const { findAlbums } = useMusic();
  const [album, setAlbum] = useState(null);

  // data from review database
  const [track_reviews, setTrack_reviews] = useState(null);
  const [avg_ratings, setAvg_ratings] = useState(null);
  const [albumRating, setAlbumRating] = useState(null);
  const [albumData, setAlbumData] = useState(null);

  // initialization
  const init = async () => {
    //getting album rating
    findAlbums(content_id)
      .then(albums =>
        albums.length
          ? albums[0]
          : console.error(`Could not find album of content_id: ${content_id}`)
      )
      .then(async album => {
        setAlbum(album);
        return setTrack_reviews(
          await firestore
            .batchGetReviewsByAuthorContent(
              email,
              album.tracks.items.map(obj => obj.id)
            )
            .then(ret => {
              let track_reviews_by_content_id = {};
              ret.forEach(
                r => (track_reviews_by_content_id[r.data.content_id] = r)
              );
              return track_reviews_by_content_id;
            })
        );
      });
    firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(res => res.forEach(r => setAlbumRating(r.data.rating)));
    firestore.getContentData(content_id).then(res => setAlbumData(res));
    // TODO: set avg ratinngs and album ratings
    setAvg_ratings(5);
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => init()); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);

  // wait until get data from all APIs
  if (!album || !track_reviews || !avg_ratings || !albumData)
    return (
      <Container style={styles.container}>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  const date = new Date(album.release_date);
  const headerComponent = (
    <View style={styles.headerContainer}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Image
          style={{
            width: "50%",
            aspectRatio: album.images[0].width / album.images[0].height,
            borderRadius: 5
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
          <Text style={styles.text}>{`${date.toLocaleString("default", {
            month: "long"
          })} ${date.getDate()}, ${date.getFullYear()}`}</Text>
        </View>
      </View>
      <BarGraph data={albumData.review_nums}></BarGraph>
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        {albumRating ? (
          <Text style={styles.subtitle}>
            Your rating: <Text style={styles.rating}>{albumRating}</Text>
          </Text>
        ) : null}
        <Text style={styles.subtitle}>
          Average rating:{" "}
          <Text style={styles.rating}>
            {Math.round(albumData.avg * 10) / 10}
          </Text>
        </Text>
      </View>
    </View>
  );
  return (
    <FlatList
      style={{ paddingHorizontal: 10 }}
      data={album.tracks.items}
      keyExtracter={({ item }) => item.track_number}
      renderItem={({ item, index }) => {
        return (
          <AlbumPreview
            title={item.name}
            rating={" "}
            avg_rating={avg_ratings[index] || 5}
            content_id={item.id}
            rid={track_reviews[item.id]}
            highlighted={highlighted == item.id}
          />
        );
      }}
      ListHeaderComponent={headerComponent}
      ListHeaderComponentStyle={{ alignItems: "center" }}
    />
  );
};

AlbumScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <ReviewButton
        content_id={navigation.getParam("content_id")}
        content_type={"album"}
      ></ReviewButton>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: "column",
    flex: 1
  },
  headerContainer: {
    flex: 1,
    marginTop: 20
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
