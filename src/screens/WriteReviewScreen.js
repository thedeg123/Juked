import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { Input } from "react-native-elements";
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
  let content_id = navigation.getParam("content_id");
  let content_type = navigation.getParam("content_type");
  const { firestore, useMusic } = useContext(context);
  const [content, setContent] = useState(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState([5]);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const listener = navigation.addListener("didFocus", async () => {
      navigation.setParams({ firestore: firestore });
      //if we have an rid, we populate the review with the content thats already there
      if (rid) {
        const response = await firestore.getReview(rid);
        if (!response)
          console.error(`Was given rid: ${rid} but found no review`);
        setRating([response.rating]);
        setText(response.text);
        setTitle(response.title === " " ? "" : response.title);
        content_id = response.content_id;
        content_type = response.type;
      }
      await useMusic
        .findOneContent(content_id, content_type)
        .then(content => setContent(content));
      navigation.setParams({ rating: [5], title: "", text: "" }); //setting default values for navigation
    });
    return () => listener.remove();
  }, []);

  if (!content) {
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  }
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Dimensions.get("window").height * 0.098}
        contentContainerStyle={{ margin: 10 }}
      >
        <View style={styles.headerStyle}>
          <View style={styles.headerTextContainerStyle}>
            <Text numberOfLines={2} style={styles.headerText}>
              {content.name}
            </Text>
            <Text style={styles.subheaderText}>{content.artist_name}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStyle}>{rating}</Text>
          <View style={styles.sliderStyle}>
            <MultiSlider
              values={rating}
              onValuesChange={setRating}
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
          blurOnSubmit
          placeholder={"Title"}
          onChangeText={setTitle}
          inputStyle={styles.titleText}
        ></Input>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          style={{
            ...styles.reviewTextStyle,
            height: Dimensions.get("window").height * 0.24
          }}
        ></TextInput>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            marginTop: 10,
            padding: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.primary,
            borderRadius: 5
          }}
          onPress={() => {
            rid
              ? firestore.updateReview(
                  rid,
                  content_id,
                  content_type,
                  text && !title ? " " : title,
                  rating[0],
                  text
                )
              : firestore.addReview(
                  content_id,
                  content_type,
                  text && !title ? " " : title,
                  rating[0],
                  text
                );
            return navigation.pop();
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: colors.white, fontSize: 18 }}
          >
            {rid ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderBottomColor: colors.shadow,
    borderWidth: 1,
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
    borderWidth: 1,
    color: colors.text,
    fontSize: 18
  }
});

export default WriteReviewScreen;
