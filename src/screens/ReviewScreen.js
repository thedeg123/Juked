import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import context from "../context/context";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";
import LikeBox from "../components/ReviewScreenComponents/LikeBox";
import ScrollViewPadding from "../components/ScrollViewPadding";
import ReviewHeader from "../components/ReviewScreenComponents/ReviewHeader";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import UserListItem from "../components/UserPreview";

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
  useEffect(() => {
    navigation.setParams({ setShowModal });
    const listener = navigation.addListener("didFocus", async () => {
      try {
        remover = await firestoreConcurrent
          .collection("reviews")
          .doc(review.id)
          .onSnapshot(doc => setReview({ id: doc.id, data: doc.data() }));
      } catch {
        remover ? remover() : null;
        console.error("error from ReviewScreen");
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
    <ImageBackground
      style={{ flex: 1 }}
      blurRadius={70}
      source={{ uri: content.image }}
    >
      <View
        style={{
          backgroundColor: colors.darkener,
          paddingHorizontal: 10,
          flex: 1
        }}
      >
        <ScrollView style={styles.containerStyle}>
          <ReviewHeader
            date={review.data ? new Date(review.data.last_modified) : null}
            content={content}
            user={user}
            rating={review.data.rating}
            type={review.data.type}
          ></ReviewHeader>
          <View style={{ marginHorizontal: 5, marginTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <LikeBox
                onLike={() => {
                  userLikes
                    ? firestore.unLikeReview(review.id)
                    : firestore.likeReview(review.id);
                  userLikes = !userLikes;
                }}
                onPress={() =>
                  navigation.push("List", {
                    title: "Likes",
                    fetchData: () =>
                      firestore.batchAuthorRequest(review.data.likes),
                    renderItem: ({ item }) => <UserListItem user={item.data} />,
                    keyExtractor: item => item.id
                  })
                }
                liked={userLikes}
                numLikes={review ? review.data.likes.length : 0}
              ></LikeBox>
              <TextInput
                style={{
                  borderWidth: 1,
                  flex: 1,
                  alignSelf: "center",
                  height: 50,
                  marginLeft: 5,
                  borderRadius: 10
                }}
                placeholder={"Comments go here"}
              ></TextInput>
            </View>
            <Text style={styles.reviewTextStyle}>{review.data.text}</Text>
          </View>
          <ModalReviewCard
            showModal={showModal}
            setShowModal={setShowModal}
            review={review}
            content={content}
            onDelete={() => {
              firestore.deleteReview(review.id);
              setShowModal(false);
              return navigation.pop();
            }}
          ></ModalReviewCard>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  reviewTextStyle: {
    color: colors.white,
    fontSize: 24
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
