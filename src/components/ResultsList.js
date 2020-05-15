import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";
import UserPreview from "./UserPreview";

const ResultsList = ({ users, searchType, search }) => {
  if (search === null && searchType !== "user") {
    return <View></View>;
  } else {
    switch (searchType) {
      case "track":
      case "album":
      case "artist":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 85 }}
              keyboardDismissMode="on-drag"
              data={search}
              keyExtractor={searchItem => searchItem.id}
              renderItem={({ item }) => (
                <SearchPreview type={searchType} object={item} cid={item.id} />
              )}
            />
          </View>
        );
      case "user":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 85 }}
              data={users}
              keyExtractor={user => user.handle + user.created}
              renderItem={({ item }) => <UserPreview user={item} />}
            />
          </View>
        );
      default:
        return null;
    }
  }
};

const styles = StyleSheet.create({});

export default ResultsList;
