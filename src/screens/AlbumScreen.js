import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
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
  const { firestore, useMusic } = useContext(context);
  // data from spotify
  const [album, setAlbum] = useState(null);

  // data from review database
  const [track_reviews, setTrack_reviews] = useState(null);
  const [avg_ratings, setAvg_ratings] = useState(null);
  const [albumRating, setAlbumRating] = useState(null);
  const [albumData, setAlbumData] = useState(null);

  // initialization
  const init = async () => {
    //getting album rating
    await useMusic.findAlbum(content_id).then(async album => {
      setAlbum(album);
      return setTrack_reviews(
        await firestore
          .batchGetReviewsByAuthorContent(
            email,
            album.tracks.map(obj => obj.id)
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
    firestore.getReviewsByAuthorContent(email, content_id).then(res => {
      return setAlbumRating(res.exists ? res.data.rating : null);
    });
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
            aspectRatio: 1,
            borderRadius: 5
          }}
          source={{
            uri: album.image
          }}
        />
        <View style={{ alignItems: "center", width: "50%" }}>
          <Text style={styles.title}>{album.name}</Text>
          <Text style={styles.text}>{album.artist_name}</Text>
          <Text style={styles.text}>{album.string_release_date}</Text>
        </View>
      </View>
      <BarGraph data={albumData.rating_nums}></BarGraph>
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
      data={album.tracks}
      keyExtracter={({ item }) => item.track_number}
      renderItem={({ item, index }) => {
        return (
          <View>
            <AlbumPreview
              content={item}
              rating={
                track_reviews[item.id]
                  ? track_reviews[item.id].data.rating
                  : null
              }
              avg_rating={" "}
              rid={track_reviews[item.id] ? track_reviews[item.id].id : null}
              highlighted={highlighted == item.id}
            />
          </View>
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
