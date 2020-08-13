import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import context from "../context/context";
import colors, { blurRadius } from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";
import { toDisplayType } from "../helpers/simplifyContent";
import LikeBox from "../components/ReviewScreenComponents/LikeBox";
import ReviewHeader from "../components/ReviewScreenComponents/ReviewHeader";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import UserListItem from "../components/UserPreview";
import CommentBar from "../components/ReviewScreenComponents/CommentBar";
import CommentsSection from "../components/ReviewScreenComponents/CommentsSection";
import { customCommentBarAnimation } from "../constants/heights";
import LoadingPage from "../components/Loading/LoadingPage";

const ReviewScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const [review, setReview] = useState(navigation.getParam("review"));
  const [user, setUser] = useState(navigation.getParam("user"));
  const content = navigation.getParam("content");

  if (!content)
    console.warn("ReviewScreen should be passed review, content, user");

  const [showModal, setShowModal] = useState(false);
  const [keyboardIsActive, setKeyboardIsActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [userLikes, setUserLikes] = useState(null);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    if (comments)
      firestore
        .batchAuthorRequest(comments.map(comment => comment.data.author))
        .then(users => setCommentUsers(users));
  }, [comments]);

  /**
   * @description - We will always be passed a user and review, so this funciton will just return, except in the case of
   * a notification press where we navigate here first
   */

  const getReviewandUser = async () => {
    let review = navigation.getParam("review");
    let user = navigation.getParam("user");

    if (user || review) return review;

    const rid = navigation.getParam("rid");
    const uid = navigation.getParam("uid");

    if (!(rid && uid))
      console.warn("Page should be supplied rid and uid or review and user");
    user = await firestore.getUser(uid);
    review = await firestore.getReview(rid);
    setUser(user);
    setReview(review);
    return review;
  };

  useEffect(() => {
    let comment_remover, remover, keyboardOpenListenter, keyboardCloseListenter;

    getReviewandUser().then(review => {
      firestore.userLikesReview(review.id).then(res => setUserLikes(res));
      navigation.setParams({
        setShowModal,
        reviewType: toDisplayType(review.data.type)
      });

      comment_remover = firestore.getComments(review.id, setComments);
      remover = firestoreConcurrent
        .collection("reviews")
        .doc(review.id)
        .onSnapshot(doc => setReview({ id: doc.id, data: doc.data() }));

      keyboardOpenListenter = Keyboard.addListener("keyboardWillShow", () => {
        LayoutAnimation.configureNext(customCommentBarAnimation);
        setKeyboardIsActive(true);
      });
      keyboardCloseListenter = Keyboard.addListener("keyboardWillHide", () => {
        LayoutAnimation.configureNext(customCommentBarAnimation);
        setKeyboardIsActive(false);
      });
    });
    return () => {
      remover ? remover() : null;
      comment_remover ? comment_remover() : null;
      keyboardOpenListenter ? keyboardOpenListenter.remove() : null;
      keyboardCloseListenter ? keyboardCloseListenter.remove() : null;
    };
  }, []);

  if (!review || !user) return <LoadingPage />;
  if (!review.data) return <View></View>;

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
                  : firestore.likeReview(
                      review.id,
                      review.data.author,
                      content
                    );
                setUserLikes(!userLikes);
              }}
              onPress={() =>
                navigation.push("List", {
                  notPaginated: true,
                  title: "Likes",
                  fetchData: async () => {
                    const likes = await firestore.getLikes(review.id);
                    const users = await firestore.batchAuthorRequest(
                      likes.map(like => like.data.author),
                      false,
                      false
                    );
                    return [users];
                  },
                  renderItem: ({ item }) => <UserListItem user={item.data} />,
                  keyExtractor: item => item.id
                })
              }
              liked={userLikes}
              numLikes={review ? review.data.num_likes : 0}
            ></LikeBox>
          )}
          <CommentBar
            keyboardIsActive={keyboardIsActive}
            submitComment={comment => {
              Keyboard.dismiss();
              firestore.addComment(
                review.id,
                review.data.author,
                comment,
                content
              );
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
          {comments.length} Comment{comments.length === 1 ? "" : "s"}
        </Text>
      </View>
    </View>
  );
  return (
    <ImageBackground
      style={{ flex: 1 }}
      blurRadius={blurRadius}
      source={{ uri: content.image }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          backgroundColor: colors.darkener,
          paddingBottom: 85,
          flex: 1
        }}
      >
        <CommentsSection
          headerComponent={headerComponent}
          comments={comments}
          commentUsers={commentUsers}
          currentUser={firestore.fetchCurrentUID()}
          deleteComment={did => firestore.deleteComment(did)}
        ></CommentsSection>
      </KeyboardAvoidingView>
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
  const reviewType = navigation.getParam("reviewType");
  const user = navigation.getParam("user");
  return {
    title: reviewType ? `${reviewType} Review` : "Review",
    headerRight: () =>
      user && user.email === auth().currentUser.email ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TopButton text={"Edit"} />
        </TouchableOpacity>
      ) : null
  };
};
export default ReviewScreen;
