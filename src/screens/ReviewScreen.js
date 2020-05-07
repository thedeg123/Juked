import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import context from "../context/context";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";
import LikeBox from "../components/LikeBox";
import ModalWrapper from "../components/ModalCards/ModalWrapper";
import ModalReviewContent from "../components/ModalCards/ModalReviewContent";

const ReviewScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const [review, setReview] = useState(navigation.getParam("review"));
  const user = navigation.getParam("user");
  const content = navigation.getParam("content");
  const [showModal, setShowModal] = useState(false);
  if (!review || !content || !user)
    console.error("ReviewScreen should be passed review, content, user");
  let remover = null;
  let userLikes = review.data
    ? review.data.likes.includes(firestore.fetchCurrentUID())
    : null;
  const date = review.data ? new Date(review.data.last_modified) : null;

  useEffect(() => {
    navigation.setParams({ setShowModal });
    const listener = navigation.addListener("didFocus", async () => {
      try {
        remover = await firestoreConcurrent
          .collection("reviews")
          .doc(review.id)
          .onSnapshot(doc => setReview({ id: doc.id, data: doc.data() }));
      } catch {
        console.log("caught error");
        remover ? remover() : null;
      }
    });
    return () => {
      remover ? remover() : null;
      listener.remove();
    };
  }, []);
  if (!review.data) {
    return <View></View>;
  }
  return (
    <ScrollView style={styles.containerStyle}>
      <View style={styles.headerStyle}>
        <View style={styles.headerTextContainerStyle}>
          <Text style={styles.headerText}>{content.name}</Text>
          <Text style={styles.subheaderText}>{content.artist_name}</Text>
        </View>
        <View style={styles.headerUserContainerStyle}>
          <UserPreview
            img={user.profile_url}
            username={user.handle}
            uid={review.data.author}
          ></UserPreview>
          <Text style={styles.dateText}>{`${date.toLocaleString("default", {
            month: "long"
          })} ${date.getDate()}, ${date.getFullYear()}`}</Text>
        </View>
      </View>
      <View style={styles.headerStyle}>
        <Text style={styles.titleText}>{review.data.title}</Text>
        <Text style={styles.ratingText}>{review.data.rating}</Text>
      </View>
      <Text style={styles.reviewTextStyle}>{review.data.text}</Text>
      <LikeBox
        onPress={() => {
          userLikes
            ? firestore.unLikeReview(review.id)
            : firestore.likeReview(review.id);
          userLikes = !userLikes;
        }}
        liked={userLikes}
        numLikes={review ? review.data.likes.length : 0}
      ></LikeBox>
      <ModalWrapper
        isVisible={showModal}
        onSwipeComplete={() => setShowModal(false)}
      >
        <ModalReviewContent
          onDelete={() => {
            firestore.deleteReview(review.id);
            setShowModal(false);
            return navigation.pop();
          }}
          onEdit={() => {
            setShowModal(false);
            return navigation.navigate("WriteReview", { review, content });
          }}
          onClose={() => setShowModal(false)}
        ></ModalReviewContent>
      </ModalWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    marginHorizontal: 10
  },

  headerStyle: {
    borderBottomColor: colors.shadow,
    borderBottomWidth: 1,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerTextContainerStyle: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 2
  },
  headerUserContainerStyle: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1
  },
  headerText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 30
  },
  titleText: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
    flex: 1
  },
  subheaderText: {
    color: colors.text,
    fontSize: 28
  },
  dateText: {
    color: colors.text,
    fontSize: 15,
    textAlign: "right"
  },
  ratingText: {
    color: colors.primary,
    fontSize: 80
  },
  reviewTextStyle: {
    color: colors.text,
    fontSize: 18
  }
});

ReviewScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  return {
    headerRight: () =>
      navigation.getParam("user").email === auth().currentUser.email ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TopButton text={"Edit"}></TopButton>
        </TouchableOpacity>
      ) : null
  };
};
export default ReviewScreen;
