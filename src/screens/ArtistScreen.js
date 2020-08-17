import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView
} from "react-native";
import colors from "../constants/colors";
import { paddingBottom } from "../constants/heights";
import LoadingPage from "../components/Loading/LoadingPage";
import ModalButton from "../components/ModalCards/ModalButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";
import ModalContentCard from "../components/ModalCards/ModalContentCard";
import TextRatings from "../components/TextRatings";
import ReviewSection from "../components/ReviewSection";
import RecordRow from "../components/RecordRow";
import ReviewButton from "../components/ReviewButton";

const ArtistScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  if (!content_id) console.warn("ArtistScreen must be called with content_id");

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
  const [contentData, setContentData] = useState(null);
  const [onUserListenList, setOnUserListenList] = useState(
    firestore.contentInlistenList(content_id)
  );
  const [showModal, setShowModal] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const getReviews = async () => {
    const reviews = await firestore
      .getMostPopularReviewsByType(content_id)
      .then(res => res[0]);
    const author_ids = reviews.map(r => r.data.author);
    const authors = await firestore.batchAuthorRequest(author_ids);
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
    firestore.fetchCurrentUserData().then(res => setAuthor(res));

    useMusic.findArtist(content_id).then(artist => setArtist(artist));
    useMusic.findAlbumsOfAnArtist(content_id).then(res => {
      res.forEach(a => newAlbums[a.album_type].push(a));
      setAlbums(newAlbums);
    });
    return getReviews();
  };

  useEffect(() => {
    init();
    const [
      content_remover,
      review_remover
    ] = firestore.listenToContentandReview(
      content_id,
      setContentData,
      setReview
    );
    return () => {
      content_remover ? content_remover() : null;
      review_remover ? review_remover() : null;
    };
  }, []);

  useEffect(() => {
    navigation.setParams({ artist });
  }, [artist]);

  if (!artist || review === "waiting" || !contentData)
    return <LoadingPage></LoadingPage>;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom }}
      scrollIndicatorInsets={{ right: 1 }}
      scrollEnabled={scrollEnabled}
    >
      <ImageBackground
        source={{ uri: artist.image }}
        style={styles.imageBackgroundStyle}
        resizeMode="repeat"
      >
        <View style={styles.child}>
          <Text style={styles.title}>{artist.name}</Text>
        </View>
      </ImageBackground>
      <ReviewButton
        onListenList={onUserListenList}
        onListenPress={() => {
          onUserListenList
            ? firestore.removeFromPersonalListenlist(artist)
            : firestore.addToPersonalListenlist(artist);
          setOnUserListenList(!onUserListenList);
        }}
        review={review}
        content={artist}
      />
      <Text style={styles.sectionStyle}>Reviews</Text>
      <View style={{ marginHorizontal: 10 }}>
        <BarGraph
          data={contentData.rating_nums}
          setScrollEnabled={setScrollEnabled}
        />
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
      <ModalContentCard
        showModal={showModal}
        setShowModal={setShowModal}
        content={artist}
      ></ModalContentCard>
    </ScrollView>
  );
};

//Allows customization of header
ArtistScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const artist = navigation.getParam("artist");
  return {
    title: artist ? artist.name : "Artist",
    headerRight: () => <ModalButton setShowModal={setShowModal}></ModalButton>
  };
};

const styles = StyleSheet.create({
  column: { flexShrink: 1, width: "50%" },
  child: {
    flex: 1,
    backgroundColor: colors.darkener,
    justifyContent: "flex-end"
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: colors.translucentWhite
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
    height: 250,
    resizeMode: "cover",
    overflow: "hidden",
    alignSelf: "stretch"
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default ArtistScreen;
