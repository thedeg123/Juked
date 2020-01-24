import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * ListPreview Component for ListScreen
 * @param {string} title - title of the list
 * @param {integer} num - number of songs in the list
 * @param {string} id - any identifier needed for this list
 * @param {Object} navigation - navigation objected passed from screen
 */
const ListPreview = ({ title, num, id, navigation }) => {
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.numStyle}>{num}</Text>
      <TouchableOpacity onPress={() => console.log("user pressed the song")}>
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  numStyle: {
    fontSize: 20,
    color: colors.primary
  }
});

export default ListPreview;
