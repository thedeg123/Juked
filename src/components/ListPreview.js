import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import ProfileListItem from "./ProfileScreen/ListPreviewItem";
/**
 * ListPreview Component for ListScreen
 * @param {string} title - title of the list
 * @param {integer} num - number of songs in the list
 * @param {string} id - any identifier needed for this list
 * @param {Object} navigation - navigation objected passed from screen
 */
const ListPreview = ({ title, content, data, onPress, marginBottom }) => {
  return (
    <View
      style={{ ...styles.borderStyle, marginBottom: marginBottom || 0 }}
      onPress={onPress}
    >
      <Text style={styles.reviewTitleStyle}>{title}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        style={{ paddingBottom: 4 }}
        renderItem={({ item }) =>
          content[item.data.content_id] ? (
            <ProfileListItem
              content={content[item.data.content_id]}
              review={item}
            ></ProfileListItem>
          ) : null
        }
        keyExtractor={item => item.id}
      ></FlatList>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  borderStyle: {
    marginTop: 10
  },
  seeAllText: {
    fontSize: 15,
    marginTop: 5,
    marginLeft: 10,
    color: colors.text
  },
  reviewTitleStyle: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 26,
    color: colors.text,
    fontWeight: "bold"
  }
});

export default ListPreview;
