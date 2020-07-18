import React, { useEffect, useState, useContext } from "react";
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
import ReviewHeader from "../components/ReviewScreenComponents/ReviewHeader";
import ModalReviewCard from "../components/ModalCards/ModalReviewCard";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import UserListItem from "../components/UserList/UserListItem";
import CommentBar from "../components/ReviewScreenComponents/CommentBar";
import CommentsSection from "../components/ReviewScreenComponents/CommentsSection";
import { customCommentBarAnimation } from "../constants/heights";
import { getAbreveatedTimeDif } from "../helpers/simplifyContent";
import ModalListCard from "../components/ModalCards/ModalListCard";

const ListenListScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const user = navigation.getParam("user");
  const list = navigation.getParam("list");
  const [showModal, setShowModal] = useState(false);
  const [currentContent, setCurrentContent] = useState(false);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const headerComponent = (
    <View style={{ marginVertical: 10, flex: 1 }}>
      <Text style={styles.headerTextStyle}>{user.handle}'s Listenlist</Text>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={headerComponent}
        contentContainerStyle={{ paddingBottom: 85 }}
        keyExtractor={item => item.content.id + item.last_modified}
        data={list.items}
        renderItem={({ item }) => {
          return (
            <UserListItem
              index={getAbreveatedTimeDif(item.last_modified)}
              content={item.content}
              onLongPress={() => {
                setCurrentContent(item.content);
                return setShowModal(true);
              }}
            />
          );
        }}
      ></FlatList>
      <ModalListCard
        showModal={showModal}
        setShowModal={setShowModal}
        onDelete={() =>
          firestore.removeFromListenList(user.email, currentContent)
        }
        content={currentContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerTextStyle: {
    color: colors.text,
    padding: 10,
    fontWeight: "bold",
    fontSize: 40
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

ListenListScreen.navigationOptions = ({ navigation }) => {
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
export default ListenListScreen;
