//Provides margin on components
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors, { blurRadius } from "../../constants/colors";
import ContentPic from "../HomeScreenComponents/ContentPic";
import navigateContent from "../../helpers/navigateContent";
import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

const ListPreviewItem = ({ navigation, content, review, user, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigateContent(
          navigation,
          content.id,
          content.album_id,
          review,
          content,
          user
        )
      }
      style={styles.wrapper}
    >
      <View style={review ? styles.shadow : null}>
        {review ? (
          <ImageBackground
            source={{ uri: content.image }}
            blurRadius={blurRadius}
            style={styles.imageBackgroundStyle}
          >
            <View style={styles.contentContainer}>
              <ContentPic
                style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                imageStyle={{
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0
                }}
                img={content.image}
                width={100}
              ></ContentPic>
              <View style={styles.rightContent}>
                <Text style={[styles.textStyle, textStyle]}>
                  {review.data.rating}
                </Text>
                {review.data.is_review && (
                  <Entypo name="text" style={styles.textStyle}></Entypo>
                )}
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View>
            <ContentPic img={content.image} width={100}></ContentPic>
          </View>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          {
            textAlign: "center",
            color: colors.darkShadow,
            fontWeight: "bold",
            fontSize: 18,
            width: review ? 150 : 100
          },
          textStyle
        ]}
      >
        {content.name}
      </Text>
    </TouchableOpacity>
  );
};

ListPreviewItem.defaultProps = {
  textStyle: {}
};

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 10
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 2 },
    shadowRadius: 2
  },
  contentContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: colors.darkener
  },
  rightContent: {
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
    alignContent: "center"
  },
  imageBackgroundStyle: {
    borderRadius: 5,
    width: 150,
    flex: 1,
    resizeMode: "cover",
    overflow: "hidden",
    alignSelf: "stretch",
    borderWidth: 0.5,
    borderColor: colors.lightShadow
  },
  textStyle: {
    color: colors.veryTranslucentWhite,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default withNavigation(ListPreviewItem);
