import React, { useEffect, useState, useContext } from "react";
import context from "../../context/context";
import { StyleSheet, Button, Text, View } from "react-native";
import { withNavigation } from "react-navigation";
import colors from "../../constants/colors";
import BarGraph from "../Graphs/BarGraph";
import TextRatings from "../TextRatings";
import ReviewSection from "../ReviewSection";
import LoadingIndicator from "../Loading/LoadingIndicator";
import TopBar from "./TopBar";
import ReviewButton from "../ReviewButton";

const ModalTrackContent = ({ navigation, onClose, content, onLoad }) => {
  const { firestore } = useContext(context);
  const [contentData, setContentData] = useState(null);
  const [review, setReview] = useState("waiting");
  const [author, setAuthor] = useState("waiting");
  const [reviews, setReviews] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");
  const [onUserListenList, setOnUserListenList] = useState(
    firestore.contentInlistenList(content.id)
  );
  let temp_rev = null;
  const getReview = async () => {
    temp_rev = await firestore
      .getReviewsByAuthorContent(firestore.fetchCurrentUID(), content.id)
      .then(review => (review.exists ? review : null));
    if (temp_rev)
      firestore.getUser(temp_rev.data.author).then(res => setAuthor(res));
    return setReview(temp_rev);
  };

  const getReviews = async () => {
    const reviews = await firestore
      .getMostPopularReviewsByType(content.id)
      .then(res => res[0]);
    const author_ids = temp_rev
      ? [...reviews.map(r => r.data.author), temp_rev.data.author]
      : reviews.map(r => r.data.author);
    const authors = await firestore.batchAuthorRequest(author_ids);
    setAuthors(authors);
    return setReviews(reviews);
  };

  const init = async () => {
    firestore.getContentData(content.id).then(v => setContentData(v));
    firestore
      .getReviewsByAuthorContent(firestore.fetchCurrentUID(), content.id)
      .then(r => setReview(r.exists ? r : null));
    await getReview();
    return await getReviews();
  };

  useEffect(() => {
    init().then(onLoad);
  }, []);
  if (review === "waiting" || reviews === "waiting" || authors === "waiting") {
    return (
      <View style={{ alignSelf: "stretch" }}>
        <Text style={styles.contentTitle}>{content.name}</Text>
        <View style={{ padding: 60, backgroundColor: colors.translucentWhite }}>
          <LoadingIndicator></LoadingIndicator>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.contentTitle}>{content.name}</Text>
      <View style={styles.content}>
        <TopBar onClose={onClose} link={content.url}></TopBar>
        <View style={{ alignSelf: "stretch" }}>
          <ReviewButton
            review={review}
            onPress={onClose}
            content={content}
            onListenList={onUserListenList}
            onListenPress={() => {
              onUserListenList
                ? firestore.removeFromPersonalListenlist(content)
                : firestore.addToPersonalListenlist(content);
              setOnUserListenList(!onUserListenList);
            }}
          />
          <BarGraph
            data={contentData ? contentData.rating_nums : null}
          ></BarGraph>
          <TextRatings
            review={review}
            averageReview={contentData ? contentData.avg : 0}
          ></TextRatings>
          <ReviewSection
            review={review}
            reviews={reviews}
            author={author}
            authors={authors}
            content={content}
            onPress={onClose}
          ></ReviewSection>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 5,
    borderColor: colors.heat
  },
  card: {
    alignItems: "center",
    alignSelf: "stretch"
  },
  contentTitle: {
    fontSize: 25,
    textAlign: "center",
    marginHorizontal: 10,
    color: colors.translucentWhite,
    fontWeight: "bold",
    marginBottom: 10
  }
});

export default withNavigation(ModalTrackContent);
