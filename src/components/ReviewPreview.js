import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this artist, album or song
 * @param {integer} score - your score
 * @param {string} id - any identifier needed for this review
 * @param {onPressCallback} callback - callback jumping to detailed review(undefined yet), null if no detailed review
 */
const ReviewPreview = ({ title, score, id, callback }) => {
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.scoreStyle}>{score}</Text>
      {(() =>
        callback ? (
          <TouchableOpacity onPress={callback}>
            <Feather name="info" style={styles.iconStyle} />
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
