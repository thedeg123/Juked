import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Keyboard
} from "react-native";
import context from "../context/context";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";
import LikeBox from "../components/ReviewScreenComponents/LikeBox";
import ReviewHeader from "../components/ReviewScreenComponents/ReviewHeader";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import UserListItem from "../components/UserPreview";
import CommentBar from "../components/ReviewScreenComponents/CommentBar";
import CommentsSection from "../components/ReviewScreenComponents/CommentsSection";

const ReviewScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const [review, setReview] = useState(navigation.getParam("review"));
  const user = navigation.getParam("user");
  const content = navigation.getParam("content");
  if (!review || !content || !user)
    console.error("ReviewScreen should be passed review, content, user");

  const [showModal, setShowModal] = useState(false);
  const [keyboardIsActive, setKeyboardIsActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState(null);

  let remover = null;
  let userLikes = review.data
    ? review.data.likes.includes(firestore.fetchCurrentUID())
    : null;

  const fetchComments = async () => {
    const comments = await firestore.getComments(review.id);
    const userComments = new Set(comments.map(com => com.data.author));
    const theUsers = {};
    await firestore
      .batchAuthorRequest(Array.from(userComments))
      .then(res => res.forEach(u => (theUsers[u.id] = u)));
    setCommentUsers(theUsers);
    return setComments(comments);
  };

  useEffect(() => {
    navigation.setParams({ setShowModal });
    fetchComments();
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
    const keyboardOpenListenter = Keyboard.addListener("keyboardWillShow", () =>
      setKeyboardIsActive(true)
    );
    const keyboardCloseListenter = Keyboard.addListener(
      "keyboardWillHide",
      () => setKeyboardIsActive(false)
    );
    return () => {
      remover ? remover() : null;
      keyboardOpenListenter.remove();
      keyboardCloseListenter.remove();
      listener.remove();
    };
  }, []);
  if (!review.data) {
    return <View></View>;
  }
  const headerComponent = (
    <View style={{ flex: 1 }}>
      <ReviewHeader
        date={review.data ? new Date(review.data.last_modified) : null}
        content={content}
        user={user}
        rating={review.data.rating}
        type={review.data.type}
      ></ReviewHeader>
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          {keyboardIsActive ? null : (
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
          )}
          <CommentBar
            keyboardIsActive={keyboardIsActive}
            submitComment={comment => {
              Keyboard.dismiss();
              firestore
                .addComment(review.id, comment)
                .then(() => fetchComments());
            }}
          ></CommentBar>
        </View>
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.reviewTextStyle}>{review.data.text}</Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "stretch",
          borderTopWidth: 1,
          borderTopColor: colors.veryTranslucentWhite
        }}
      >
        <Text
          style={{
            marginLeft: 10,
            marginVertical: 10,
            fontSize: 16,
            color: colors.translucentWhite
          }}
        >
          {comments.length} Comments
        </Text>
      </View>
    </View>
  );
  return (
    <ImageBackground
      style={{ flex: 1 }}
      blurRadius={70}
      source={{ uri: content.image }}
    >
      <View
        style={{
          backgroundColor: colors.darkener,
          flex: 1
        }}
      >
        <CommentsSection
          headerComponent={headerComponent}
          comments={comments}
          commentUsers={commentUsers}
          currentUser={firestore.fetchCurrentUID()}
          deleteComment={did =>
            firestore.deleteComment(did).then(fetchComments())
          }
        ></CommentsSection>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  reviewTextStyle: {
    color: colors.white,
    fontSize: 20
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
