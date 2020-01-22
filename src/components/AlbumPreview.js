import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this song
 * @param {integer} rating - your rating
 * @param {integer} avg_rating - average rating from users
 * @param {string} uid - any identifier needed for this song's review, if available
 * @param {Object} navigation - navigation objected passed from screen
 */
const ReviewPreview = ({ title, rating, avg_rating, id, navigation }) => {
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.scoreStyle}>{rating}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Review", { uid })}>
        <Feather name="message-square" style={styles.iconStyle} />
      </TouchableOpacity>
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
