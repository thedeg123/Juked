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

const ProfileListItem = ({ navigation, content, review, width }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigateContent(navigation, content.id, content.album_id, review)
      }
      style={styles.shadowEdge}
    >
      <ImageBackground
        source={{ uri: content.image }}
        blurRadius={20}
        style={{ width, ...styles.imageBackgroundStyle }}
      >
        <View style={styles.contentContainer}>
          <ContentPic img={content.image} width={100}></ContentPic>
          <View style={styles.rightContent}>
            <Text style={styles.textStyle}>{review.data.rating}</Text>
            {review.data.title ? (
              <Entypo
                name="text"
                style={styles.textStyle}
                color={colors.primary}
              ></Entypo>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowEdge: {
    borderRadius: 5,
    marginLeft: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 2 },
    shadowRadius: 2,
    flex: 1
  },
  contentContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.12)"
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
    borderColor: colors.shadow,
    borderWidth: 1
  },
  textStyle: {
    color: colors.primary,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default withNavigation(ProfileListItem);
