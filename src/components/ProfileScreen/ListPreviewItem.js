//Provides margin on components
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import ContentPic from "../HomeScreenComponents/ContentPic";
import navigateContent from "../../helpers/navigateContent";
import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

const ProfileListItem = ({ navigation, content, review, width, user }) => {
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
      <View style={styles.shadow}>
        <ImageBackground
          source={{ uri: content.image }}
          blurRadius={20}
          style={{ width, ...styles.imageBackgroundStyle }}
        >
          <View style={styles.contentContainer}>
            <ContentPic img={content.image} is_review width={100}></ContentPic>
            <View style={styles.rightContent}>
              <Text style={styles.textStyle}>{review.data.rating}</Text>
              {review.data.is_review ? (
                <Entypo name="text" style={styles.textStyle}></Entypo>
              ) : null}
            </View>
          </View>
          <View style={{ paddingLeft: 5, backgroundColor: colors.darkener }}>
            <Text
              numberOfLines={1}
              style={{
                color: colors.white,
                fontWeight: "bold",
                fontSize: 15
              }}
            >
              {content.name}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
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

export default withNavigation(ProfileListItem);
