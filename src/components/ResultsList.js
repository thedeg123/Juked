import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";
import UserPreview from "./UserPreview";
import colors from "../constants/colors";

const ResultsList = ({ users, searchType, search }) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        borderTopWidth: 0.5,
        borderColor: colors.lightShadow
      }}
    >
      {searchType === "user" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 85 }}
          data={users}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          keyExtractor={user => user.handle + user.created}
          renderItem={({ item }) => <UserPreview user={item} />}
        />
      ) : !search && !users ? null : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 85 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          data={search}
          keyExtractor={searchItem => searchItem.id}
          renderItem={({ item }) => (
            <SearchPreview type={searchType} object={item} cid={item.id} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ResultsList;
