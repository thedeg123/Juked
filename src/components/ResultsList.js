import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";

const ResultsList = ({ searchType, search, navigation }) => {
  if (search === null) {
    return null;
  } else {
    switch (searchType) {
      case "track":
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
      case "album":
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
      case "artist":
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
      case "user":
        return (
          <View>
            <Text>User List</Text>
          </View>
        );
      default:
        return null;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default ResultsList;
