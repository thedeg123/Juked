import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { requestAccessToken, requestAPI } from "../requestSpotifyAPI";
import config from "../api/musicConfig";

const ArtistScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");

  // get data from spotify
  const [artists, setArtists] = useState(null);
  const [albumsList, setAlbumsList] = useState(null);
  const [rating, setRating] = useState(null);
  const [avg_rating, setAvg_rating] = useState(null);

  const getSpotifyResult = async music_id => {
    const accessToken = await requestAccessToken(config.id, config.secret);
    const artists = await requestAPI(accessToken,"https://api.spotify.com/v1/artists/"+music_id);
    setArtists(artists.data);
    const albumsList = await requestAPI(accessToken, `https://api.spotify.com/v1/artists/${music_id}/albums`);
    setAlbumsList(albumsList.data);
  };

  const getDatabaseResult = async (uid, music_id) => {};

  // init and get all data needed via api
  useEffect(() => {
    getSpotifyResult(music_id);
    getDatabaseResult();
  }, []);

  // get data from database
  const rating;
  const avg_rating;
  

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
        data={albumsList}
        keyExtracter={({ item }) => item.name}
        renderItem={({ item }) => {
          return <ArtistPreview result={item} navigation={navigation}/>;
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
