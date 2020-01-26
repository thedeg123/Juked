import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import useMusic from "../hooks/useMusic";
import useFirestore from "../hooks/useFirestore";
import { Context as AuthContext } from "../context/AuthContext";

const ArtistScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const { email } = useContext(AuthContext);

  // data from spotify
  const { albums, artists, findArtists, findAlbumsOfAnArtist } = useMusic();

  // data from review database
  const [rating, setRating] = useState(null);
  const [avg_rating, setAvg_rating] = useState(null);
  const getDatabaseResult = async (uid, music_id) => {
    const artistReview = useFirestore.getReviewsByAuthorContent(uid, music_id);
    setRating(artistReview.rating);
    setAvg_rating(5);
  };

  // init and get all data needed via api
  useEffect(() => {
    findArtists(music_id);
    findAlbumsOfAnArtist(music_id);
    getDatabaseResult(email, music_id);
  }, []);

  // render header information component
  const headerComponent = (
    <View style={{ alignItems: "center" }}>
      <Image
        style={{
          width: "50%",
          aspectRatio: artists.images[0].width / artists.images[0].height
        }}
        source={{
          uri: artists.images[0].url
        }}
      />
      <Text style={styles.title}>{artists.name}</Text>
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
    <View style={styles.container}>
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
    </View>
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
