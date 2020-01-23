import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";
// Switch statement

const ResultsList = ({ searchType, search, navigation }) => {
  if (search === null) {
    return null;
  } else if (searchType === "track") {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={search.tracks.items.slice(0, 20)}
          keyExtractor={searchItem => searchItem.id}
          renderItem={({ item }) => {
            return (
              <View>
                <SearchPreview
                  title={search ? `${item.name}` : "none"}
                  type={searchType}
                  music_id={search ? `${item.id}` : "none"}
                  navigation={navigation}
                />
              </View>
            );
          }}
        />
      </View>
    );
  } else if (searchType === "album") {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={search.albums.items.slice(0, 50)}
          keyExtractor={searchItem => searchItem.id}
          renderItem={({ item }) => {
            return (
              <View>
                <SearchPreview
                  title={search ? `${item.name}` : "none"}
                  type={searchType}
                  music_id={search ? `${item.id}` : "none"}
                  navigation={navigation}
                />
              </View>
            );
          }}
        />
      </View>
    );
  } else if (searchType === "artist") {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={search.artists.items.slice(0, 50)}
          keyExtractor={searchItem => searchItem.id}
          renderItem={({ item }) => {
            return (
              <View>
                <SearchPreview
                  title={search ? `${item.name}` : "none"}
                  type={searchType}
                  music_id={search ? `${item.id}` : "none"}
                  navigation={navigation}
                />
              </View>
            );
          }}
        />
      </View>
    );
  } else {
    // In this case, it is just the user
    return (
      <View>
        <Text>User List</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default ResultsList;
