import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  LayoutAnimation,
  UIManager,
  FlatList,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import context from "../context/context";
import colors, { blurRadius } from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";
import LikeBox from "../components/ReviewScreenComponents/LikeBox";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import UserListItem from "../components/UserList/UserListItem";
import CommentBar from "../components/ReviewScreenComponents/CommentBar";
import CommentsSection from "../components/ReviewScreenComponents/CommentsSection";
import { customCommentBarAnimation } from "../constants/heights";

const UserListScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const [list, setList] = useState(navigation.getParam("list"));
  const user = navigation.getParam("user");
  const flatListRef = useRef();

  if (!list || !user)
    console.error("ReviewScreen should be passed review, content, user");

  const [showModal, setShowModal] = useState(false);
  const [keyboardIsActive, setKeyboardIsActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [userLikes, setUserLikes] = useState(null);
  const content = list.data && list.data.items[0];
  let remover = null;

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

  useEffect(() => {
    navigation.setParams({ setShowModal, title: list.data.title });
    const comment_remover = firestore.getComments(list.id, setComments);

    remover = firestoreConcurrent
      .collection("reviews")
      .doc(list.id)
      .onSnapshot(doc => setList({ id: doc.id, data: doc.data() }));

    const keyboardOpenListenter = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        LayoutAnimation.configureNext(customCommentBarAnimation);
        setKeyboardIsActive(true);
      }
    );
    const keyboardCloseListenter = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        LayoutAnimation.configureNext(customCommentBarAnimation);
        setKeyboardIsActive(false);
      }
    );
    return () => {
      remover ? remover() : null;
      comment_remover ? comment_remover() : null;
      keyboardOpenListenter.remove();
      keyboardCloseListenter.remove();
    };
  }, []);
  if (!list || !list.data) {
    return <View></View>;
  }
  const headerComponent = (
    <View style={{ flex: 1 }}>
      {/* ListHeader goes here */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.textWrapperStyle}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.textTitleStyle}>{list.data.title}</Text>
            <UserPreview
              containerStyle={{ alignSelf: "flex-start" }}
              img={user.profile_url}
              username={user.handle}
              uid={user.email}
            ></UserPreview>
          </View>
          {list.data.description ? (
            <Text style={styles.textDescriptionStyle}>
              {list.data.description}
            </Text>
          ) : null}
        </View>

        <FlatList
          ref={flatListRef}
          data={list.data.items}
          renderItem={({ item, index }) => (
            <UserListItem
              content={item}
              index={index}
              containerStyle={{
                shadowOffset: { width: 0, height: 0 }
              }}
              indexStyle={{
                fontWeight: "bold",
                color: colors.translucentWhite
              }}
              onPress={() => {}}
            ></UserListItem>
          )}
          keyExtractor={item => item.id}
        ></FlatList>
        <View style={styles.interactionBox}>
          {keyboardIsActive ? null : (
            <LikeBox
              onLike={() => {
                userLikes
                  ? firestore.unLikeReview(list.id)
                  : firestore.likeReview(list.id, list.data.author, content);
                setUserLikes(!userLikes);
              }}
              onPress={() =>
                navigation.push("List", {
                  notPaginated: true,
                  title: "Likes",
                  fetchData: async () => {
                    const likes = await firestore.getLikes(list.id);
                    const users = await firestore.batchAuthorRequest(
                      likes.map(like => like.author),
                      false,
                      false
                    );
                    return [users];
                  },
                  renderItem: ({ item }) => <UserPreview user={item.data} />,
                  keyExtractor: item => item.id
                })
              }
              liked={userLikes}
              numLikes={list ? list.data.num_likes : 0}
            ></LikeBox>
          )}
          <CommentBar
            keyboardIsActive={keyboardIsActive}
            submitComment={comment => {
              Keyboard.dismiss();
              firestore.addComment(list.id, list.data.author, comment, content);
            }}
          ></CommentBar>
        </View>
      </View>
      <View style={styles.commentContainerStyle}>
        <Text style={styles.commentTextStyle}>
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
        review={list}
        content={content}
        content_type={"List"}
        onDelete={() => {
          firestore.deleteReview(list.id);
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
  },
  interactionBox: {
    marginHorizontal: 10,
    flexDirection: "row",
    marginVertical: 10
  },
  commentTextStyle: {
    marginLeft: 10,
    marginVertical: 10,
    fontSize: 16,
    color: colors.translucentWhite
  },
  textTitleStyle: {
    flex: 1,
    fontSize: 40,
    bottom: 10,
    color: colors.translucentWhite
  },
  textDescriptionStyle: {
    fontSize: 20,
    textAlign: "center",
    color: colors.translucentWhite
  },
  textWrapperStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryTranslucentWhite
  },
  commentContainerStyle: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: colors.veryTranslucentWhite
  }
});

UserListScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const title = navigation.getParam("title");

  return {
    title,
    headerRight: () =>
      navigation.getParam("user").email === auth().currentUser.email ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TopButton text={"Edit"}></TopButton>
        </TouchableOpacity>
      ) : null
  };
};
export default UserListScreen;
