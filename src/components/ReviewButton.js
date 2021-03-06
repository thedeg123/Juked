import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import UserPreview from "./HomeScreenComponents/UserPreview";
import colors from "../constants/colors";
import { withNavigation } from "react-navigation";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";

/**
 * ReviewButton Component for Artist/album/track componennts
 * @param {string} title - title of this artist, album or song
 * @param {integer} rating - your rating
 * @param {string} rid - unique review identifier assigned by database
 * @param {Object} navigation - navigation objected passed from screen
 */
const ReviewButton = ({
  navigation,
  review,
  content,
  onListenList,
  onPress,
  onListenPress
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 10
      }}
    >
      <TouchableOpacity style={styles.container} onPress={onListenPress}>
        {onListenList ? (
          <AntDesign
            name="checkcircle"
            size={24}
            style={{ marginVertical: 5 }}
            color={colors.white}
          />
        ) : (
          <Entypo name="add-to-list" size={28} color={colors.white} />
        )}
        <Text
          style={{
            fontSize: 14,
            marginLeft: 10,
            color: colors.white,
            fontWeight: "bold"
          }}
        >
          ListenList
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={async () => {
          onPress ? onPress() : null;
          return navigation.navigate("WriteReview", {
            review,
            content
          });
        }}
      >
        <MaterialIcons name="rate-review" size={28} color={colors.white} />
        <Text
          style={{
            fontSize: 14,
            marginLeft: 10,
            color: colors.white,
            fontWeight: "bold"
          }}
        >
          {review ? "Edit" : "Add"} Review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 140,
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center"
  }
});

export default withNavigation(ReviewButton);
