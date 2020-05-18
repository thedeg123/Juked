import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground
} from "react-native";
import ArtistPreview from "../components/ArtistPreview";
import Container from "../components/Container";
import colors from "../constants/colors";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalButton from "../components/ModalCards/ModalButton";
import context from "../context/context";
import BarGraph from "../components/Graphs/BarGraph";
import ButtonList from "../components/ButtonList";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import TextRatings from "../components/TextRatings";

const ArtistScreen = ({ navigation }) => {
  const content_id = navigation.getParam("content_id");
  if (!content_id) console.error("ArtistScreen must be called with content_id");

  const [albums, setAlbums] = useState(null);
  const [artist, setArtist] = useState(null);

  // data from review database
  const [review, setReview] = useState("waiting");
  const [avg_rating, setAvg_rating] = useState(null);
  const { firestore, useMusic } = useContext(context);
  const email = firestore.fetchCurrentUID();
  const [contentData, setContentData] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const getReview = () => {
    firestore
      .getReviewsByAuthorContent(email, content_id)
      .then(review => setReview(review.exists ? review : null));
    firestore.getContentData(content_id).then(res => setContentData(res));
  };

  const init = () => {
    navigation.setParams({ setShowModal });
    // init and get all data needed via ap
    useMusic.findArtist(content_id).then(artist => setArtist(artist));
    useMusic.findAlbumsOfAnArtist(content_id).then(albums => setAlbums(albums));
    getReview();
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => getReview()); //any time we return to this screen we do another fetch
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

  // render header information component
  const headerComponent = (
    <View>
      <View>
        <ImageBackground
          source={{ uri: artist.image }}
          style={styles.imageBackgroundStyle}
          resizeMode="repeat"
        >
          <Text style={styles.title}>{artist.name}</Text>
        </ImageBackground>
      </View>
      <Text style={styles.sectionStyle}>Reviews</Text>
      <View style={{ marginHorizontal: 10 }}>
        <BarGraph data={contentData.rating_nums}></BarGraph>
      </View>
      <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
        <ButtonList
          user_num={contentData.number_ratings}
          list_num={5}
          review_num={contentData.number_reviews}
        ></ButtonList>
      </View>
      <TextRatings
        review={review}
        averageReview={contentData.avg}
      ></TextRatings>
      <Text style={styles.sectionStyle}>Albums</Text>
    </View>
  );

  // render main component
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        data={albums}
        keyExtracter={({ item }) => item.id}
        renderItem={({ item }) => (
          <ArtistPreview content={item} navigation={navigation} />
        )}
        columnWrapperStyle={styles.column}
        numColumns={2}
        ListHeaderComponent={headerComponent}
      />
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
    </View>
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
