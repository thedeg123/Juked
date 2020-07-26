import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import colors, { blurRadius } from "../constants/colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import context from "../context/context";
import ArtistNames from "../components/ArtistNames";

/**
 *
 * @param {string} content_id - the type of  content to be displayed, sent if this is first time were writing review
 * @param {string} content_type - the type of  contetn to be displayed, sent if this is first time were writing review
 * @param {string} rid - the review's unique id. Sent if were updating a review.
 */

const WriteReviewScreen = ({ navigation }) => {
  const review = navigation.getParam("review");
  const content = navigation.getParam("content");
  const { firestore } = useContext(context);
  const [text, setText] = useState("");
  const [rating, setRating] = useState([5]);
  useEffect(() => {
    if (review) {
      setText(review.data.text);
      setRating([review.data.rating]);
    }
  }, []);
  if (!content) {
    return console.error("Should be passed content but was passed:", content);
  }
  return (
    <ImageBackground
      style={{ flex: 1 }}
      blurRadius={blurRadius}
      source={{ uri: content.image }}
    >
      <View
        style={{
          backgroundColor: colors.darkener,
          flex: 1
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{ flex: 1, justifyContent: "flex-end", marginBottom: 80 }}
          >
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={Dimensions.get("window").height * 0.098}
              contentContainerStyle={{ margin: 10 }}
            >
              <View style={styles.headerStyle}>
                <View style={styles.headerTextContainerStyle}>
                  <Text style={styles.headerText}>{content.name}</Text>
                  <ArtistNames
                    artists={content.artists}
                    allowPress={false}
                    textStyle={styles.subheaderText}
                  ></ArtistNames>
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
                    unselectedStyle={{
                      backgroundColor: colors.veryTranslucentWhite
                    }}
                    selectedStyle={{
                      backgroundColor: colors.secondary,
                      height: 5
                    }}
                    sliderLength={250}
                  ></MultiSlider>
                </View>
              </View>
              <TextInput
                placeholder="Enter a review"
                placeholderTextColor={colors.veryTranslucentWhite}
                value={text}
                numberOfLines={
                  Platform.OS === "ios"
                    ? null
                    : Dimensions.get("window").height * 0.005
                }
                maxHeight={
                  Platform.OS === "ios"
                    ? Dimensions.get("window").height * 0.2
                    : null
                }
                onChangeText={setText}
                multiline
                style={{
                  ...styles.reviewTextStyle
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
                  review
                    ? firestore.updateReview(
                        review.id,
                        review.data.content_id,
                        review.data.type,
                        rating[0],
                        text
                      )
                    : firestore.addReview(
                        content.id,
                        content.type,
                        content,
                        rating[0],
                        text
                      );
                  return navigation.pop();
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.white,
                    fontSize: 18
                  }}
                >
                  {review ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
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
    color: colors.white,
    fontWeight: "bold",
    fontSize: 30
  },
  ratingContainer: {
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  ratingStyle: {
    color: colors.veryTranslucentWhite,
    fontSize: 80
  },
  sliderStyle: {
    marginTop: 20,
    marginRight: 10,
    alignSelf: "center"
  },
  subheaderText: {
    marginTop: 5,
    color: colors.white,
    fontSize: 22
  },
  dateText: {
    color: colors.text,
    fontSize: 15,
    textAlign: "right"
  },
  reviewTextStyle: {
    color: colors.white,
    padding: 10,
    borderRadius: 5,
    borderColor: colors.veryTranslucentWhite,
    borderWidth: 3,
    fontSize: 20
  }
});

WriteReviewScreen.navigationOptions = () => {
  return {
    headerTitle: "My Review"
  };
};

export default WriteReviewScreen;
