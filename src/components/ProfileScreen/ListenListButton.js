import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import { withNavigation } from "react-navigation";
import { Entypo } from "@expo/vector-icons";

/**
 * ReviewButton Component for Artist/album/track componennts
 * @param {string} title - title of this artist, album or song
 * @param {integer} rating - your rating
 * @param {string} rid - unique review identifier assigned by database
 * @param {Object} navigation - navigation objected passed from screen
 */
const ListenListButton = ({
  navigation,
  listenList,
  type_of_interest,
  personal,
  user
}) => {
  const number =
    type_of_interest !== "all"
      ? listenList.items.filter(item => item.content.type === type_of_interest)
          .length
      : listenList.items.length;

  let name =
    type_of_interest === "all"
      ? "item"
      : type_of_interest === "track"
      ? "song"
      : type_of_interest

  name = name + (number != 1? "s": "");
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ListenList", {
          list: listenList,
          user
        })
      }
    >
      <Text
        style={{
          fontSize: 14,
          marginLeft: 10,
          color: colors.white,
          fontWeight: "bold",
          textAlign:"center"
        }}
      >
        {`${number} ${name} on \n${personal?"personal": "general"} ListenList`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 5,
    width:170,
    paddingVertical: 5,
    justifyContent: "center"
  }
});

export default withNavigation(ListenListButton);
