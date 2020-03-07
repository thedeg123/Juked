import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import useFirestore from "../hooks/useFirestore";
import useMusic from "../hooks/useMusic";
import Container from "../components/Container";
import LoadingIndicator from "../components/LoadingIndicator";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";

const ReviewScreen = ({ navigation }) => {
  const rid = navigation.getParam("rid");
  if (!rid)
    console.error(
      `ReviewScreen should be passed an rid but was instead passed: ${rid}`
    );

  const [review, setReview] = useState(null);
  const [user, setUser] = useState(null);
  const {
    tracks,
    albums,
    artists,
    findAlbums,
    findArtists,
    findTracks
  } = useMusic();
  const getResultByType = async (content_id, type) => {
    switch (type) {
      case "track":
        return findTracks(content_id);
      case "album":
        return findAlbums(content_id);
      case "artist":
        return findArtists(content_id);
      case "playlist":
      default:
        console.error(`No content type of: ${type}`);
        return;
    }
  };
  useEffect(() => {
    const listener = navigation.addListener("didFocus", async () => {
      const response = await useFirestore.getReviewById(rid);
      if (!response) console.error(`Counld not find review with rid: ${rid}`);
      const user_response = await useFirestore.getUser(response.author);
      if (!user_response)
        console.error(
          `Counld not find review author with id: ${response.author}`
        );
      getResultByType(response.content_id, response.type);
      setReview(response);
      setUser(user_response);
      navigation.setParams({
        user: user_response.email
      });
    });
    return () => listener.remove();
  }, []);

  if ((!tracks && !albums && !artists) || !user) {
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  }

  let content = tracks || albums || artists;
  const contentFilter = () => {
    switch (review.type) {
      case "track":
        return {
          title: content.tracks[0].name,
          subtitle: content.tracks[0].artists[0].name
        };
      case "album":
        return {
          title: content.albums[0].name,
          subtitle: content.albums[0].artists[0].name
        };
      case "artist":
        return {
          title: content.artists[0].name,
          subtitle: " "
        };
      default:
        return;
    }
  };
  content = contentFilter();
  const date = new Date(review.changed._seconds * 1000);
  return (
    <Container>
      <View style={styles.headerStyle}>
        <View style={styles.headerTextContainerStyle}>
          <Text numberOfLines={2} style={styles.headerText}>
            {content.title}
          </Text>
          <Text style={styles.subheaderText}>{content.subtitle}</Text>
        </View>
        <View style={styles.headerUserContainerStyle}>
          <UserPreview
            img={user.profile_url}
            username={user.handle}
            uid={review.author}
          ></UserPreview>
          <Text style={styles.dateText}>{`${date.toLocaleString("default", {
            month: "long"
          })} ${date.getDate()}, ${date.getFullYear()}`}</Text>
        </View>
      </View>
      <View style={styles.headerStyle}>
        <Text style={styles.titleText}>{review.title}</Text>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <ScrollView>
        <Text style={styles.reviewTextStyle}>{review.text}</Text>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
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
      navigation.getParam("user") === auth().currentUser.email ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("WriteReview", {
              rid: navigation.getParam("rid")
            })
          }
        >
          <TopButton text={"Edit"}></TopButton>
        </TouchableOpacity>
      ) : null
  };
};
export default ReviewScreen;
