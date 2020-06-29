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
const ListPreview = ({ title, data, onPress, marginBottom, user }) => {
  return (
    <View style={{ ...styles.borderStyle, marginBottom: marginBottom || 0 }}>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          justifyContent: "space-between"
        }}
      >
        <Text style={styles.reviewTitleStyle}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        contentContainerStyle={{ paddingRight: 10 }}
        style={{ paddingBottom: 5 }}
        renderItem={({ item }) => (
          <ProfileListItem
            content={item.data.content}
            review={item}
            user={user}
          ></ProfileListItem>
        )}
        keyExtractor={item => item.id}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  borderStyle: {
    marginTop: 10
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "300",
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
