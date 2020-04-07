import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";
import { auth } from "firebase";
import ArtistPreview from "../components/ArtistPreview";
import Container from "../components/Container";
import colors from "../constants/colors";
import images from "../constants/images";
import LoadingIndicator from "../components/LoadingIndicator";
import ReviewButton from "../components/ReviewButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";

const ArtistScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  if (!content_id) console.error("ArtistScreen must be called with content_id");
  const email = auth().currentUser.email;

  // data from spotify
  const { findArtists, findAlbumsOfAnArtist } = useMusic();
  const [albums, setAlbums] = useState(null);
  const [artist, setArtist] = useState(null);

  // data from review database
  const [rating, setRating] = useState(null);
  const [avg_rating, setAvg_rating] = useState(null);
  const firestore = useContext(context);
  const [contentData, setContentData] = useState(null);

  const init = () => {
    // init and get all data needed via api
    firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(review => setRating(review.length ? review[0].data.rating : null));
    findArtists(content_id).then(artists => setArtist(artists[0]));
    findAlbumsOfAnArtist(content_id).then(result => {
      setAlbums(result.items);
    });
    firestore.getContentData(content_id).then(res => setContentData(res));
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => init()); //any time we return to this screen we do another fetch
    return () => listener.remove(); //prevents memory leaks if the indexScreen is ever closed
  }, []);

  if (!artist || !contentData)
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );

  // render header information component
  const headerComponent = (
    <View>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          style={{
            marginTop: 10,
            width: "50%",
            aspectRatio: artist.images[0]
              ? artist.images[0].width / artist.images[0].height
              : 1,
            borderRadius: 5
          }}
          source={{
            uri: artist.images[0] ? artist.images[0].url : images.artistDefault
          }}
        />
        <Text style={styles.title}>{artist.name}</Text>
      </View>
      <BarGraph data={contentData.review_nums}></BarGraph>
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        {rating ? (
          <Text style={styles.subtitle}>
            Your rating: <Text style={styles.rating}>{rating}</Text>
          </Text>
        ) : null}
        <Text style={styles.subtitle}>
          Average rating:{" "}
          <Text style={styles.rating}>
            {Math.round(contentData.avg * 10) / 10}
          </Text>
        </Text>
      </View>
    </View>
  );

  // render main component
  return (
    <FlatList
      data={albums}
      keyExtracter={({ item }) => item.name}
      renderItem={({ item }) => {
        return <ArtistPreview result={item} navigation={navigation} />;
      }}
      columnWrapperStyle={styles.column}
      numColumns={2}
      ListHeaderComponent={headerComponent}
      ListHeaderComponentStyle={{ marginHorizontal: 10 }}
    />
  );
};

//Allows customization of header
ArtistScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <ReviewButton
        content_id={navigation.getParam("content_id")}
        content_type="artist"
      ></ReviewButton>
    )
  };
};

const styles = StyleSheet.create({
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
