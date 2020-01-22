import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this artist, album or song
 * @param {integer} rating - your rating
 * @param {string} id - any identifier needed for this review
 * @param {Object} navigation - navigation objected passed from screen
 */
const ReviewPreview = ({ title, rating, id, navigation }) => {
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.scoreStyle}>{rating}</Text>
      {(() =>
        callback ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Review", { id })}
          >
            <Feather name="message-square" style={styles.iconStyle} />
          </TouchableOpacity>
        ) : null)()}
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 25,
    color: colors.text,
    flex: 1
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default ReviewPreview;
