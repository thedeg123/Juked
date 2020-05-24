import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { auth } from "firebase";
import AlbumPreview from "../components/AlbumPreview";
import colors from "../constants/colors";
import Container from "../components/Container";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalButton from "../components/ModalCards/ModalButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import ModalTrackCard from "../components/ModalCards/ModalTrackCard";
import TextRatings from "../components/TextRatings";
import ArtistNames from "../components/ArtistNames";
import ReviewSection from "../components/ReviewSection";

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
  const [review, setReview] = useState("waiting");
  const [albumData, setAlbumData] = useState(null);
  const [reviews, setReviews] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");

  const [showHighlightedTrackCard, setShowHighlightedTrackCard] = useState(
    navigation.getParam("highlighted")
  );
  const [showReviewCard, setShowReviewCard] = useState(false);
  const [showTrackCard, setShowTrackCard] = useState(false);
  const [trackData, setTrackData] = useState(null);

  let temp_rev = null;

  // initialization

  const getReview = async () => {
    temp_rev = await firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(review => (review.exists ? review : null));
    return setReview(temp_rev);
  };

  const getReviews = async () => {
    const reviews = await firestore.getMostPopularReviewsByType(content_id);
    const author_ids = temp_rev
      ? [...reviews.map(r => r.data.author), temp_rev.data.author]
      : reviews.map(r => r.data.author);
    const authors = await firestore.batchAuthorRequest(author_ids).then(res => {
      let ret = {};
      res.forEach(r => (ret[r.id] = r.data));
      return ret;
    });
    setAuthors(authors);
    return setReviews(reviews);
  };

  const init = async () => {
    navigation.setParams({ setShowModal: setShowReviewCard });
    //getting album rating
    firestore.getContentData(content_id).then(res => setAlbumData(res));
    useMusic.findAlbum(content_id).then(async album => setAlbum(album));
    await getReview();
    return getReviews();
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => getReview()); //any time we return to this screen we do another fetch
    return () => {
      listener.remove();
    };
  }, []);
  // wait until get data from all APIs
  if (
    !album ||
    review === "waiting" ||
    reviews === "waiting" ||
    authors === "waiting" ||
    !albumData
  )
    return (
      <Container style={styles.container}>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  const headerComponent = (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            marginHorizontal: 10
          }}
        >
          <Image
            style={{
              width: "50%",
              aspectRatio: 1,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.lightShadow
            }}
            source={{
              uri: album.image
            }}
          />
          <View style={{ alignItems: "center", width: "50%" }}>
            <Text style={styles.title}>{album.name}</Text>
            <ArtistNames
              horizontal={false}
              artists={album.artists}
              allowPress={true}
              textStyle={styles.text}
            ></ArtistNames>
            <Text style={styles.text}>{album.string_release_date}</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <BarGraph data={albumData.rating_nums}></BarGraph>
          <TextRatings
            review={review}
            averageReview={albumData.avg}
          ></TextRatings>
        </View>
      </View>
      <ReviewSection
        content={album}
        review={review}
        reviews={reviews}
        authors={authors}
      ></ReviewSection>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 85
        }}
        scrollIndicatorInsets={{ right: 1 }}
        data={album.tracks}
        keyExtracter={({ item }) => String(item.track_number)}
        renderItem={({ item }) => {
          return (
            <View>
              <AlbumPreview
                content={item}
                disabled={album.tracks.length === 1}
                showTrackCard={() => {
                  setTrackData(item);
                  return setShowTrackCard(true);
                }}
                highlighted={highlighted == item.id}
                showHighlightedTrackCard={showHighlightedTrackCard == item.id}
              />
            </View>
          );
        }}
        ListHeaderComponent={headerComponent}
        ListHeaderComponentStyle={{
          alignItems: "center"
        }}
      />
      <ModalReviewCard
        showModal={showReviewCard}
        setShowModal={v => setShowReviewCard(v)}
        setReview={v => setReview(v)}
        review={review}
        content={album}
        onDelete={() => {
          firestore.deleteReview(review.id);
          setShowReviewCard(false);
          return getReview();
        }}
      ></ModalReviewCard>
      <ModalTrackCard
        showModal={showTrackCard}
        setShowModal={setShowTrackCard}
        content={trackData}
        setShowHighlightedTrackCard={setShowHighlightedTrackCard}
      ></ModalTrackCard>
    </View>
  );
};

AlbumScreen.navigationOptions = ({ navigation }) => {
  setShowModal = navigation.getParam("setShowModal");
  return {
    headerRight: () => <ModalButton setShowModal={setShowModal}></ModalButton>
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
  text: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center"
  }
});

export default AlbumScreen;
