import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ReviewPreview from "./ReviewPreview";
import colors from "../constants/colors";
import context from "../context/context";
import { withNavigation } from "react-navigation";

const ReviewSection = ({
  navigation,
  content,
  review,
  author,
  reviews,
  authors,
  onPress
}) => {
  if (reviews === "waiting" || authors === "waiting") return null;
  if (!onPress) {
    onPress = () => {};
  }
  const { firestore } = useContext(context);
  const width = Dimensions.get("window").width;
  return (
    <View style={styles.containerStyle}>
      {review && review.data.is_review ? (
        <Text style={styles.headerTextStyle}>Your Review</Text>
      ) : null}
      {review && review.data.is_review ? (
        <ReviewPreview
          review={review}
          onPress={onPress}
          author={author}
          content={content}
        ></ReviewPreview>
      ) : null}
      {reviews && reviews.length ? (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.headerTextStyle}>Top Reviews</Text>
            <TouchableOpacity
              onPress={() => {
                onPress();
                return navigation.push("List", {
                  title: `${content.name} Reviews`,
                  fetchData: async (limit, startAfter) => {
                    const [
                      reviews,
                      start_next
                    ] = await firestore.getMostPopularReviewsByType(
                      content.id,
                      limit,
                      startAfter
                    );
                    const authors = await firestore
                      .batchAuthorRequest([
                        ...new Set(reviews.map(r => r.data.author))
                      ])
                      .then(res => {
                        let ret = {};
                        res.forEach(r => (ret[r.id] = r.data));
                        return ret;
                      });
                    return [
                      reviews.map(r => {
                        return { review: r, author: authors[r.data.author] };
                      }),
                      start_next
                    ];
                  },
                  renderItem: ({ item }) => {
                    return (
                      <ReviewPreview
                        review={item.review}
                        onPress={onPress}
                        author={item.author}
                        content={content}
                        style={{ marginTop: 15 }}
                      ></ReviewPreview>
                    );
                  },
                  keyExtractor: item => item.review.id
                });
              }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{ height: 80 }}
            horizontal
            keyExtractor={item => String(item.id)}
            data={reviews}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width} //your element width snapToAlignment=
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              if (!authors[item.data.author]) return null;
              return (
                <View
                  style={{
                    width: width
                  }}
                >
                  <ReviewPreview
                    review={item}
                    onPress={onPress}
                    author={authors[item.data.author]}
                    content={content}
                  ></ReviewPreview>
                </View>
              );
            }}
          ></FlatList>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            margin: 10,
            textAlign: "center"
          }}
        >
          This doesn't have any reviews yet, add a review to be the first!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 20,
    marginLeft: 10,
    marginVertical: 5,
    color: colors.text
  },
  seeAllText: {
    marginRight: 10,
    fontSize: 15,
    fontWeight: "300",
    marginTop: 5,
    marginLeft: 10,
    color: colors.text
  }
});

export default withNavigation(ReviewSection);
