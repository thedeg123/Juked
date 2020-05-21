import React from "react";
import { StyleSheet, View } from "react-native";
import UserPreview from "./UserPreview";
import Rating from "./Rating";
import ReviewTitle from "./ReviewTitle";
import ContentPic from "./ContentPic";
import ContentTitle from "./ContentTitle";
import HomeScreenBorder from "./HomeScreenBorder";

const HomeScreenItem = ({ review, content, author }) => {
  return (
    <>
      <HomeScreenBorder content={content} review={review} author={author}>
        <View style={styles.contentStyle}>
          <ContentPic
            img={content.image}
            width={100}
            is_review={review.data.is_review}
          ></ContentPic>
          <ContentTitle
            header={content.name}
            subheader={content.artists}
            date={new Date(review.data.last_modified)}
            review={review.data.is_review}
            type={review.data.type}
          ></ContentTitle>
          <View style={styles.textStyle}>
            <UserPreview
              username={author.handle}
              img={author.profile_url}
              uid={review.data.author}
            ></UserPreview>
            <Rating number={review.data.rating}></Rating>
          </View>
        </View>
        {review.data.is_review ? (
          <ReviewTitle title={review.data.text}></ReviewTitle>
        ) : null}
      </HomeScreenBorder>
    </>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    padding: 5
  },
  contentStyle: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default HomeScreenItem;
