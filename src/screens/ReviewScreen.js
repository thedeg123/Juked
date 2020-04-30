import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import UserPreview from "../components/HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import firebase from "firebase";
import "firebase/firestore";

const ReviewScreen = ({ navigation }) => {
  const firestore = firebase.firestore();
  const [review, setReview] = useState(navigation.getParam("review"));
  const user = navigation.getParam("user");
  const content = navigation.getParam("content");
  let remover = null;
  if (!review || !content || !user)
    console.error("ReviewScreen should be passed review, content, user");
  const date = new Date(review.data.last_modified);
  useEffect(() => {
    const listener = navigation.addListener("didFocus", async () => {
      remover = await firestore
        .collection("reviews")
        .doc(review.id)
        .onSnapshot(doc => setReview({ id: doc.id, data: doc.data() }));
    });
    return () => {
      remover ? remover() : null;
      listener.remove();
    };
  }, []);
  return (
    <View style={styles.containerStyle}>
      <View style={styles.headerStyle}>
        <View style={styles.headerTextContainerStyle}>
          <Text numberOfLines={2} style={styles.headerText}>
            {content.name}
          </Text>
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
      <ScrollView>
        <Text style={styles.reviewTextStyle}>{review.data.text}</Text>
      </ScrollView>
    </View>
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
  return {
    headerRight: () =>
      navigation.getParam("user").email === auth().currentUser.email ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("WriteReview", {
              rid: navigation.getParam("review").id
            })
          }
        >
          <TopButton text={"Edit"}></TopButton>
        </TouchableOpacity>
      ) : null
  };
};
export default ReviewScreen;
