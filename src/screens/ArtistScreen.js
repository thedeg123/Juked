import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView
} from "react-native";
import Container from "../components/Container";
import colors from "../constants/colors";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalButton from "../components/ModalCards/ModalButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import TextRatings from "../components/TextRatings";
import ReviewSection from "../components/ReviewSection";
import RecordRow from "../components/RecordRow";

const ArtistScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  if (!content_id) console.error("ArtistScreen must be called with content_id");

  const [albums, setAlbums] = useState({
    album: [],
    single: [],
    compilation: []
  });
  const [artist, setArtist] = useState(null);

  // data from review database
  const [review, setReview] = useState("waiting");
  const [reviews, setReviews] = useState("waiting");
  const [author, setAuthor] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");
  const { firestore, useMusic } = useContext(context);
  const email = firestore.fetchCurrentUID();
  const [contentData, setContentData] = useState(null);
  let temp_rev = null;
  const [showModal, setShowModal] = useState(false);

  const getReview = async () => {
    temp_rev = await firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(review => (review.exists ? review : null));
    if (temp_rev)
      firestore.getUser(temp_rev.data.author).then(res => setAuthor(res));
    return setReview(temp_rev);
  };

  const getReviews = async () => {
    const reviews = await firestore
      .getMostPopularReviewsByType(content_id)
      .then(res => res[0]);
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
    const newAlbums = {
      album: [],
      single: [],
      compilation: []
    };
    navigation.setParams({ setShowModal });
    // init and get all data needed via ap
    useMusic.findArtist(content_id).then(artist => setArtist(artist));
    firestore.getContentData(content_id).then(res => setContentData(res));
    useMusic
      .findAlbumsOfAnArtist(content_id)
      .then(res => res.forEach(a => newAlbums[a.album_type].push(a)));
    setAlbums(newAlbums);
    await getReview();
    return getReviews();
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", async () =>
      getReview()
    );
    return () => {
      listener.remove();
    };
  }, []);

  if (!artist || review === "waiting" || !contentData)
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 85 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <ImageBackground
        source={{ uri: artist.image }}
        style={styles.imageBackgroundStyle}
        resizeMode="repeat"
      >
        <Text style={styles.title}>{artist.name}</Text>
      </ImageBackground>
      <Text style={styles.sectionStyle}>Reviews</Text>
      <View style={{ marginHorizontal: 10 }}>
        <BarGraph data={contentData.rating_nums}></BarGraph>
      </View>
      <View style={{ marginHorizontal: 5, marginBottom: 10 }}></View>
      <TextRatings
        review={review}
        averageReview={contentData.avg}
      ></TextRatings>
      <ReviewSection
        content={artist}
        review={review}
        author={author}
        reviews={reviews}
        authors={authors}
      ></ReviewSection>
      {albums["album"].length ? (
        <RecordRow title="Albums" data={albums["album"]}></RecordRow>
      ) : null}
      {albums["single"].length ? (
        <RecordRow title="Singles" data={albums["single"]}></RecordRow>
      ) : null}
      {albums["compilation"].length ? (
        <RecordRow
          title="Compilations"
          data={albums["compilation"]}
        ></RecordRow>
      ) : null}
      <ModalReviewCard
        showModal={showModal}
        setShowModal={v => setShowModal(v)}
        setReview={v => setReview(v)}
        review={review}
        content={artist}
        onDelete={() => {
          firestore.deleteReview(review.id);
          setShowModal(false);
          return getReview();
        }}
      ></ModalReviewCard>
    </ScrollView>
  );
};

//Allows customization of header
ArtistScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  return {
    headerRight: () => <ModalButton setShowModal={setShowModal}></ModalButton>
  };
};

const styles = StyleSheet.create({
  column: { flexShrink: 1, width: "50%" },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: colors.primary
  },
  sectionStyle: {
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 30,
    color: colors.text,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    padding: 10
  },
  imageBackgroundStyle: {
    flex: 1,
    justifyContent: "flex-end",
    height: 250,
    resizeMode: "cover",
    overflow: "hidden",
    alignSelf: "stretch",
    borderColor: colors.shadow
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default ArtistScreen;
