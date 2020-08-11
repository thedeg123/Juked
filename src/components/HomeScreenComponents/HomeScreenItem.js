import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import UserPreview from "./UserPreview";
import ReviewTitle from "./ReviewTitle";
import ContentPic from "./ContentPic";
import ContentTitle from "./ContentTitle";
import HomeScreenBorder from "./HomeScreenBorder";
import colors from "../../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const HomeScreenItem = ({ review, content, author, onPlay }) => {
  const Rating = ({ val }) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        marginRight: 5
      }}
    >
      <Text
        style={{
          fontWeight: "500",
          color: colors.veryTranslucentWhite,
          fontSize: 55
        }}
      >
        {val}
      </Text>
    </View>
  );

  const ActionRow = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: onPlay ? "space-between" : "flex-end",
        margin: 5
      }}
    >
      {onPlay && (
        <TouchableOpacity onPress={onPlay} style={{ paddingRight: 15 }}>
          <AntDesign
            name="play"
            size={25}
            color={colors.semiTranslucentWhite}
          />
        </TouchableOpacity>
      )}

      <UserPreview
        size={25}
        fontScaler={0.6}
        username={author.handle}
        img={author.profile_url}
        uid={review.data.author}
        horizontal
      />
    </View>
  );

  return (
    <HomeScreenBorder content={content} review={review} author={author}>
      <View style={styles.contentStyle}>
        <ContentPic
          content={content}
          width={100}
          borderRadius={{
            borderBottomRightRadius: review.data.is_review ? 5 : 0
          }}
          borderWidth={{
            borderRightWidth: 1,
            borderBottomWidth: review.data.is_review ? 1 : 0
          }}
        />
        <View style={{ flex: 1 }}>
          <ActionRow />
          <View style={{ flex: 1, bottom: 3, flexDirection: "row" }}>
            <ContentTitle
              header={content.name}
              subheader={content.artists}
              type={review.data.type}
            />
            <Rating val={review.data.rating} />
          </View>
        </View>
      </View>
      {review.data.is_review ? (
        <ReviewTitle title={review.data.text}></ReviewTitle>
      ) : null}
    </HomeScreenBorder>
  );
};

const styles = StyleSheet.create({
  imageReviewStyle: {
    borderBottomRightRadius: 5,
    borderColor: colors.veryTranslucentWhite
  },
  contentStyle: {
    flexDirection: "row"
  }
});

export default HomeScreenItem;
