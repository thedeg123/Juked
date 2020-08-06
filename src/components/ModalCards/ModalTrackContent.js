import React, { useEffect, useState, useContext } from "react";
import context from "../../context/context";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";
import BarGraph from "../Graphs/BarGraph";
import TextRatings from "../TextRatings";
import ReviewSection from "../ReviewSection";
import LoadingIndicator from "../Loading/LoadingIndicator";
import TopBar from "./TopBar";
import ReviewButton from "../ReviewButton";

const ModalTrackContent = ({ onClose, content, author, setScrollEnabled }) => {
  const { firestore } = useContext(context);
  const [contentData, setContentData] = useState(null);

  const [review, setReview] = useState("waiting");
  const [reviews, setReviews] = useState("waiting");

  const [authors, setAuthors] = useState("waiting");

  const [onUserListenList, setOnUserListenList] = useState(
    firestore.contentInlistenList(content.id)
  );

  const getReviews = async () => {
    const reviews = await firestore
      .getMostPopularReviewsByType(content.id)
      .then(res => res[0]);
    const authors = await firestore.batchAuthorRequest(
      reviews.map(r => r.data.author)
    );
    setAuthors(authors);
    return setReviews(reviews);
  };

  const init = async () => {
    firestore
      .getReviewsByAuthorContent(firestore.fetchCurrentUID(), content.id)
      .then(r => setReview(r.exists ? r : null));
    return await getReviews();
  };

  useEffect(() => {
    init();
    init();
    const [
      content_remover,
      review_remover
    ] = firestore.listenToContentandReview(
      content.id,
      setContentData,
      setReview
    );
    return () => {
      content_remover ? content_remover() : null;
      review_remover ? review_remover() : null;
    };
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
      <View
        style={[
          styles.content,
          {
            paddingBottom:
              (review && review.is_review) || (reviews && reviews.length)
                ? 0
                : 20
          }
        ]}
      >
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
            setScrollEnabled={setScrollEnabled}
          />
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

export default ModalTrackContent;
