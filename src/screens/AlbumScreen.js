import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
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

  const [showReviewCard, setShowReviewCard] = useState(false);
  const [showTrackCard, setShowTrackCard] = useState(false);
  const [trackData, setTrackData] = useState(null);
  // initialization

  const updateReview = () => {
    firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(res => setReview(res.exists ? res : null));
    firestore.getContentData(content_id).then(res => setAlbumData(res));
  };
  const init = async () => {
    navigation.setParams({ setShowModal: setShowReviewCard });
    //getting album rating
    useMusic.findAlbum(content_id).then(async album => setAlbum(album));
    updateReview();
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => updateReview()); //any time we return to this screen we do another fetch
    return () => {
      listener.remove();
    };
  }, []);
  // wait until get data from all APIs
  if (!album || review === "waiting" || !albumData)
    return (
      <Container style={styles.container}>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  const headerComponent = (
    <View style={styles.headerContainer}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Image
          style={{
            width: "50%",
            aspectRatio: 1,
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: colors.shadow
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
      <TextRatings review={review} averageReview={albumData.avg}></TextRatings>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        style={{ paddingHorizontal: 10 }}
        data={album.tracks}
        keyExtracter={({ item }) => item.track_number}
        renderItem={({ item, index }) => {
          return (
            <View>
              <AlbumPreview
                content={item}
                showTrackCard={() => {
                  setTrackData(item);
                  return setShowTrackCard(true);
                }}
                highlighted={highlighted == item.id}
              />
            </View>
          );
        }}
        ListHeaderComponent={headerComponent}
        ListHeaderComponentStyle={{ alignItems: "center" }}
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
          return updateReview();
        }}
      ></ModalReviewCard>
      <ModalTrackCard
        showModal={showTrackCard}
        setShowModal={setShowTrackCard}
        content={trackData}
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
