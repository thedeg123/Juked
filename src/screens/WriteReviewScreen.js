import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Input } from "react-native-elements";
import useMusic from "../hooks/useMusic";
import Container from "../components/Container";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../constants/colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import TopButton from "../components/TopButton";
import context from "../context/context";

/**
 *
 * @param {string} content_id - the type of  content to be displayed, sent if this is first time were writing review
 * @param {string} content_type - the type of  contetn to be displayed, sent if this is first time were writing review
 * @param {string} rid - the review's unique id. Sent if were updating a review.
 */

const WriteReviewScreen = ({ navigation }) => {
  const rid = navigation.getParam("rid");
  const firestore = useContext(context);
  const [text, setText] = useState("");
  const onChangeText = value => {
    setText(value);
    navigation.setParams({
      text: value
    });
  };
  const [rating, setRating] = useState([5]);
  const onChangeRating = value => {
    setRating(value);
    navigation.setParams({
      rating: value
    });
  };
  const [title, setTitle] = useState("");
  const onChangeTitle = value => {
    setTitle(value);
    navigation.setParams({
      title: value
    });
  };
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
      navigation.setParams({ firestore: firestore });
      //if we have an rid, we populate the review with the content thats already there
      if (rid) {
        const response = await firestore.getReview(rid);
        if (!response)
          console.error(`Was given rid: ${rid} but found no review`);
        onChangeRating([response.rating]);
        onChangeText(response.text);
        onChangeTitle(response.title);
        navigation.setParams({
          content_id: response.content_id,
          content_type: response.type
        });
        getResultByType(response.content_id, response.type);
      } else {
        getResultByType(
          navigation.getParam("content_id"),
          navigation.getParam("content_type")
        );
        navigation.setParams({ rating: [5], title: "", text: "" }); //setting default values for navigation
      }
    });
    return () => listener.remove();
  }, []);

  if (!tracks && !albums && !artists) {
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  }

  let content = tracks || albums || artists;
  const contentFilter = () => {
    switch (navigation.getParam("content_type")) {
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
        console.error(
          `Expected a type of album, artist or track but was instead given: ${navigation.getParam(
            "content_type"
          )}`
        );
    }
  };
  content = contentFilter();
  return (
    <Container>
      <View style={styles.headerStyle}>
        <View style={styles.headerTextContainerStyle}>
          <Text numberOfLines={2} style={styles.headerText}>
            {content.title}
          </Text>
          <Text style={styles.subheaderText}>{content.subtitle}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingStyle}>{rating}</Text>
        <View style={styles.sliderStyle}>
          <MultiSlider
            values={rating}
            onValuesChange={values => onChangeRating(values)}
            snapped
            min={0}
            max={10}
            step={1}
            selectedStyle={{ backgroundColor: colors.secondary, height: 5 }}
            sliderLength={250}
          ></MultiSlider>
        </View>
      </View>
      <Input
        value={title}
        multiline
        blurOnSubmit
        numberOfLines={2}
        placeholder={"Title"}
        onChangeText={text => onChangeTitle(text)}
        inputStyle={styles.titleText}
      ></Input>
      <ScrollView>
        <Input
          value={text}
          placeholder={"Review"}
          multiline
          onChangeText={res => onChangeText(res)}
          style={styles.reviewTextStyle}
        ></Input>
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
  ratingContainer: {
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  ratingStyle: {
    color: colors.primary,
    fontSize: 80
  },
  sliderStyle: {
    marginTop: 20,
    marginRight: 10,
    alignSelf: "center"
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
  reviewTextStyle: {
    color: colors.text,
    fontSize: 18
  }
});

WriteReviewScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          if (navigation.getParam("rid")) {
            navigation
              .getParam("firestore")
              .updateReview(
                navigation.getParam("rid"),
                navigation.getParam("content_id"),
                navigation.getParam("content_type"),
                navigation.getParam("title"),
                navigation.getParam("rating")[0],
                navigation.getParam("text")
              );
          } else {
            navigation
              .getParam("firestore")
              .addReview(
                navigation.getParam("content_id"),
                navigation.getParam("content_type"),
                navigation.getParam("title"),
                navigation.getParam("rating")[0],
                navigation.getParam("text")
              );
          }
          navigation.pop();
        }}
      >
        <TopButton text={"Done"}></TopButton>
      </TouchableOpacity>
    )
  };
};

export default WriteReviewScreen;
