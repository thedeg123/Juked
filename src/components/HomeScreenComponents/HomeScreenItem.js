//Provides margin on components
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import UserPreview from "./UserPreview";
import Rating from "./Rating";
import ReviewTitle from "./ReviewTitle";
import ContentPic from "./ContentPic";
import ContentTitle from "./ContentTitle";

const HomeScreenItem = ({ review, content, type }) => {
  return (
    <>
      <TouchableOpacity style={styles.boxStyle}>
        <UserPreview username="Test"></UserPreview>
        <Rating number={10}></Rating>
        <ReviewTitle title="WWWWWWWWWWWWWWWWWWWWWWWW"></ReviewTitle>
        <ContentTitle
          header="An Album ljhjhlh lkjkjsf"
          subheader="An artist"
        ></ContentTitle>
        <ContentPic></ContentPic>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    alignSelf: "stretch",
    marginVertical: 10,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.primary,
    borderWidth: 2,
    height: 180,
    padding: 10
  },
  titleStyle: {}
});

export default HomeScreenItem;
