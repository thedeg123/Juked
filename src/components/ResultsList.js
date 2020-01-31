import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";
import UserPreview from "./UserPreview";

const ResultsList = ({ user, searchType, search }) => {
  if (search === null && searchType !== "user") {
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
                      type={searchType}
                      object={item}
                      cid={item.id}
                      album_cid={item.album.id}
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
                      type={searchType}
                      object={item}
                      cid={search ? `${item.id}` : null}
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
                      type={searchType}
                      object={item}
                      cid={search ? `${item.id}` : null}
                    />
                  </View>
                );
              }}
            />
          </View>
        );
      case "user":
        return user ? (
          <View>
            <UserPreview
              handle={user.handle ? `${user.handle}` : `${user.email}`}
              profile_url={user.profile_url}
              uid={user.email}
            />
          </View>
        ) : null;
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
