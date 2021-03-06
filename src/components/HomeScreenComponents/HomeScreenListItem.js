import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import UserPreview from "./UserPreview";
import HomeScreenBorder from "./HomeScreenBorder";
import colors from "../../constants/colors";
import ListPreviewItem from "../ProfileScreen/ListPreviewItem";
import { getStringDate } from "../../helpers/simplifyContent";

const HomeScreenListItem = ({ list, author }) => {
  const previewItems = list.data.items.slice(0, 5);
  const date = new Date(list.data.last_modified);
  return (
    <HomeScreenBorder review={list} height={185} author={author}>
      <View style={styles.TopStyle}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.listTitleStyle}>
            {list.data.title}
          </Text>
          <Text numberOfLines={1} style={styles.dateStyle}>
            {"Created"}: {getStringDate(date)}
          </Text>
        </View>
        <UserPreview
          username={author.handle}
          img={author.profile_url}
          uid={author.email}
          horizontal
          size={25}
          fontScaler={0.6}
          containerStyle={{ alignSelf: "flex-start" }}
        ></UserPreview>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={previewItems}
        contentContainerStyle={{
          alignItems: "flex-end",
          paddingRight: 10,
          marginBottom: 5
        }}
        renderItem={({ item }) => (
          <ListPreviewItem
            textStyle={{ color: colors.translucentWhite, fontSize: 12 }}
            content={item}
          ></ListPreviewItem>
        )}
        keyExtractor={item => item.id}
      ></FlatList>
    </HomeScreenBorder>
  );
};

const styles = StyleSheet.create({
  TopStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginHorizontal: 5
  },
  dateStyle: {
    fontSize: 14,
    color: colors.white
  },
  listTitleStyle: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.translucentWhite
  }
});

export default HomeScreenListItem;
