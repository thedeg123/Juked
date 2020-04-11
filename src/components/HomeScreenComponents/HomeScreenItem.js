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
      <HomeScreenBorder content={content} review={review}>
        <View style={styles.contentStyle}>
          <ContentPic
            img={content.image}
            cid={content.id}
            type={review.type}
            album_cid={review.review.type === "track" ? content.album_id : null}
            width={120}
          ></ContentPic>
          <ContentTitle
            header={content.name}
            subheader={content.artist_name || ""}
            date={new Date(review.review.last_modified)}
            review={Boolean(review.review.title)}
          ></ContentTitle>
          <View style={styles.textStyle}>
            <UserPreview
              username={author.handle}
              img={author.profile_url}
              uid={review.review.author}
            ></UserPreview>
            <Rating number={review.review.rating}></Rating>
          </View>
        </View>
        {review.review.title ? (
          <ReviewTitle title={review.review.title}></ReviewTitle>
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
