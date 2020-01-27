import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import useMusic from "../hooks/useMusic";
import useFirestore from "../hooks/useFirestore";
import { Context as AuthContext } from "../context/AuthContext";
import AlbumPreview from "../components/AlbumPreview";
import colors from "../constants/colors";

// if redirect from an album: music_id(album spotify ID), highlighted("")
// if redirect from a song: music_id(""), highlighted(song spotify ID)
const AlbumScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  const highlighted = navigation.getParam("highlighted");
  const { email } = useContext(AuthContext);

  // data from spotify
  const { albums, findAlbums, findAlbumsOfATrack } = useMusic();

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
  useEffect(() => {
    if (music_id) findAlbums(music_id);
    else {
      // if redirect from a song, save the album object to albums
      findAlbumsOfATrack(music_id);
    }
    const track_ids = albums.tracks.map(obj => obj.id);
    getDatabaseResult(email, music_id, track_ids);
  }, []);

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
