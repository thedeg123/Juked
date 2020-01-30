import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from "react-native";
import useMusic from "../hooks/useMusic";
import useFirestore from "../hooks/useFirestore";
import { auth } from "firebase";
import ArtistPreview from "../components/ArtistPreview";
import Container from "../components/Container";
import colors from "../constants/colors";
import images from "../constants/images";
import LoadingIndicator from "../components/LoadingIndicator";
import { Feather } from "@expo/vector-icons";

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

  useEffect(() => {
    const getData = () => {
      // init and get all data needed via api
      const getDatabaseResult = async (uid, content_id) => {
        const artistReview = useFirestore.getReviewsByAuthorContent(
          uid,
          content_id
        );
        if (!artistReview) setRating("-");
        else setRating(artistReview.rating);
        setAvg_rating(5);
      };

      findArtists(content_id).then(artists => setArtist(artists[0]));
      findAlbumsOfAnArtist(content_id).then(result => {
        setAlbums(result.items);
      });
      getDatabaseResult(email, content_id);
    };
    const listener = navigation.addListener("didFocus", () => getData()); //any time we return to this screen we do another fetch
    return () => listener.remove(); //prevents memory leaks if the indexScreen is ever closed
  }, []);

  if (!artist)
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );

  // render header information component
  const headerComponent = (
    <View style={{ alignItems: "center" }}>
      <Image
        style={{
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
      <View style={{ flexDirection: "row" }}>
        {rating ? (
          <Text style={styles.subtitle}>
            Your rating: <Text style={styles.rating}>{rating}</Text>
          </Text>
        ) : null}
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

//Allows customization of header
ArtistScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Review", {
            content_id: navigation.getParam("content_id"),
            content_type: "artist"
          })
        }
      >
        <Feather style={styles.headerRightStyle} name="plus"></Feather>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1
  },
  headerRightStyle: {
    fontSize: 30,
    marginRight: 10
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
