import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../constants/colors";
import navigateContent from "../../helpers/navigateContent";
import { withNavigation } from "react-navigation";
import UserPreview from "../HomeScreenComponents/UserPreview";

const ReviewHeader = ({ navigation, date, content, user, rating, type }) => {
  return (
    <View style={styles.child}>
      <View style={styles.headerTextContainerStyle}>
        <TouchableOpacity
          onPress={() =>
            navigateContent(
              navigation,
              content.id,
              content.album_name,
              null,
              content
            )
          }
        >
          <Text
            style={{
              ...styles.headerText,
              fontSize: type === "artist" ? 50 : 30
            }}
          >
            {content.name}
          </Text>
          <Text style={styles.subheaderText}>{content.album_name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigateContent(navigation, null, null, null, {
              type: "artist",
              id: content.artist_id
            })
          }
        >
          <Text style={styles.subheaderText}>{content.artist_name}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          Reviewed on{" "}
          {`${date.toLocaleString("default", {
            month: "long"
          })} ${date.getDate()}, ${date.getFullYear()}`}
        </Text>
      </View>
      <View style={styles.headerUserContainerStyle}>
        <UserPreview
          img={user.profile_url}
          username={user.handle}
          uid={user.email}
          size={60}
        ></UserPreview>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  child: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1
  },
  ratingText: {
    color: colors.primary,
    alignSelf: "flex-end",
    fontSize: 100
  },
  headerTextContainerStyle: {
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 2
  },
  headerUserContainerStyle: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  headerText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 30,
    color: colors.white
  },
  subheaderText: {
    color: colors.text,
    fontSize: 26,
    color: colors.white
  },
  dateText: {
    color: colors.text,
    fontSize: 15,
    color: colors.white
  }
});

export default withNavigation(ReviewHeader);