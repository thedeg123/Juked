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
            cid={content.id}
            type={review.type}
            album_cid={review.data.type === "track" ? content.album_id : null}
            width={100}
          ></ContentPic>
          <ContentTitle
            header={content.name}
            subheader={content.artist_name}
            date={new Date(review.data.last_modified)}
            review={Boolean(review.data.title)}
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
        {review.data.title ? (
          <ReviewTitle title={review.data.title}></ReviewTitle>
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
