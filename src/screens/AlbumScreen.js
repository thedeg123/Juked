import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import AlbumPreview from "../components/AlbumPreview";
import colors from "../constants/colors";
import LoadingPage from "../components/Loading/LoadingPage";
import ModalButton from "../components/ModalCards/ModalButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";
import ModalContentCard from "../components/ModalCards/ModalContentCard";
import ModalTrackCard from "../components/ModalCards/ModalTrackCard";
import TextRatings from "../components/TextRatings";
import ArtistNames from "../components/ArtistNames";
import ReviewSection from "../components/ReviewSection";
import ReviewButton from "../components/ReviewButton";

// if redirect from an album: content_id(album spotify ID), highlighted("")
// if redirect from a song: content_id(album spotify ID), highlighted(song spotify ID)
const AlbumScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  const highlighted = navigation.getParam("highlighted");
  const { firestore, useMusic } = useContext(context);
  // data from spotify
  const [album, setAlbum] = useState(null);
  const [track, setTrack] = useState(null);

  // data from review database
  const [review, setReview] = useState("waiting");
  const [author, setAuthor] = useState("waiting");
  const [contentData, setContentData] = useState(null);

  const [reviews, setReviews] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");

  const [showHighlightedTrackCard, setShowHighlightedTrackCard] = useState(
    navigation.getParam("highlighted")
  );
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showContentCard, setShowContentCard] = useState(false);
  const [showTrackCard, setShowTrackCard] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [onUserListenList, setOnUserListenList] = useState(
    firestore.contentInlistenList(content_id)
  );

  // initialization

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
    navigation.setParams({ setShowModal: setShowContentCard });
    await firestore.fetchCurrentUserData().then(res => setAuthor(res));
    useMusic.findAlbum(content_id).then(async album => setAlbum(album));
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
      setShowHighlightedTrackCard(false);
      content_remover ? content_remover() : null;
      review_remover ? review_remover() : null;
    };
  }, []);

  useEffect(() => {
    navigation.setParams({ album });
  }, [album]);

  // wait until get data from all APIs
  if (!album || review === "waiting" || !contentData) return <LoadingPage />;
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
              borderWidth: 0.5,
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
        <ReviewButton
          onListenList={onUserListenList}
          onListenPress={() => {
            onUserListenList
              ? firestore.removeFromPersonalListenlist(album)
              : firestore.addToPersonalListenlist(album);
            setOnUserListenList(!onUserListenList);
          }}
          review={review}
          content={album}
        />
        <View style={{ marginHorizontal: 10 }}>
          <BarGraph
            data={contentData.rating_nums}
            setScrollEnabled={setScrollEnabled}
          />
          <TextRatings
            review={review}
            averageReview={contentData.avg}
          ></TextRatings>
        </View>
      </View>
      <ReviewSection
        content={album}
        review={review}
        author={author}
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
        scrollEnabled={scrollEnabled}
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
                showContentCard={() => {
                  setTrack(item);
                  return setShowContentCard(true);
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
      <ModalContentCard
        showModal={showContentCard}
        setShowModal={val => {
          setTrack(null);
          return setShowContentCard(val);
        }}
        content={track || album}
      ></ModalContentCard>
      <ModalTrackCard
        showModal={showTrackCard}
        setShowModal={setShowTrackCard}
        content={trackData}
        author={author}
        setShowHighlightedTrackCard={setShowHighlightedTrackCard}
      ></ModalTrackCard>
    </View>
  );
};

AlbumScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const album = navigation.getParam("album");
  return {
    title: album ? album.name : "Album",
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
