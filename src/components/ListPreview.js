import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import ListPreviewItem from "./ProfileScreen/ListPreviewItem";
import ProfileUserListItem from "./ProfileScreen/UserListPreviewItem.js";
import { withNavigation } from "react-navigation";

/**
 * ListPreview Component for ListScreen
 * @param {string} title - title of the list
 * @param {integer} num - number of songs in the list
 * @param {string} id - any identifier needed for this list
 * @param {Object} navigation - navigation objected passed from screen
 */
const ListPreview = ({
  navigation,
  title,
  data,
  onPress,
  marginBottom,
  user,
  showAddListButton,
  showListItems
}) => {
  return (
    <View style={{ ...styles.borderStyle, marginBottom: marginBottom || 0 }}>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          justifyContent: "space-between"
        }}
      >
        {title && <Text style={styles.reviewTitleStyle}>{title}</Text>}
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        {showAddListButton && (
          <View
            style={{
              paddingRight: 10,
              borderRightWidth: 0.5,
              height: 100,
              borderRightColor: colors.lightShadow
            }}
          >
            <TouchableOpacity
              style={styles.addListButton}
              onPress={() => navigation.navigate("WriteList")}
            >
              <Entypo name="add-to-list" size={36} color={colors.white} />
              <Text style={styles.addListText}>Add a List</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          contentContainerStyle={{ paddingRight: 10 }}
          style={{ paddingBottom: 5 }}
          renderItem={({ item }) =>
            showListItems ? (
              <ProfileUserListItem
                list={item}
                user={user}
              ></ProfileUserListItem>
            ) : (
              <ListPreviewItem
                content={item.data.content}
                review={item}
                user={user}
              ></ListPreviewItem>
            )
          }
          keyExtractor={item => item.id}
        ></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderStyle: {
    marginTop: 10
  },
  addListText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "300",
    marginTop: 5,
    marginLeft: 10,
    color: colors.text
  },
  addListButton: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: colors.secondary
  },
  reviewTitleStyle: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 26,
    color: colors.text,
    fontWeight: "bold"
  }
});

export default withNavigation(ListPreview);
