//Provides margin on components
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import UserPreview from "./UserPreview";
import Rating from "./Rating";
import ReviewTitle from "./ReviewTitle";
import ContentPic from "./ContentPic";
import ContentTitle from "./ContentTitle";
import HomeScreenBorder from "./HomeScreenBorder";

const HomeScreenItem = ({ review, content, author }) => {
  console.log(content);
  return (
    <>
      <HomeScreenBorder navigate={review.text.length ? review.rid : null}>
        <UserPreview
          username={author.handle}
          img={author.profile_url}
          uid={review.author}
        ></UserPreview>
        <Rating number={review.rating}></Rating>
        <ReviewTitle title={review.title}></ReviewTitle>
        <ContentTitle
          header={content.name}
          subheader={content.artist_name || ""}
        ></ContentTitle>
        <ContentPic
          img={content.image}
          cid={content.id}
          type={review.type}
          album_cid={review.type === "track" ? content.album_id : null}
        ></ContentPic>
      </HomeScreenBorder>
    </>
  );
};

const styles = StyleSheet.create({});

export default HomeScreenItem;
