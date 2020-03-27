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
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={search.tracks.items.slice(0, 20)}
              keyExtractor={searchItem => searchItem.id}
              renderItem={({ item }) => (
                <SearchPreview
                  type={searchType}
                  object={item}
                  cid={item.id}
                  album_cid={item.album.id}
                />
              )}
            />
          </View>
        );
      case "album":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={search.albums.items.slice(0, 50)}
              keyExtractor={searchItem => searchItem.id}
              renderItem={({ item }) => (
                <SearchPreview
                  type={searchType}
                  object={item}
                  cid={search ? `${item.id}` : null}
                />
              )}
            />
          </View>
        );
      case "artist":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={search.artists.items.slice(0, 50)}
              keyExtractor={searchItem => searchItem.id}
              renderItem={({ item }) => (
                <SearchPreview
                  type={searchType}
                  object={item}
                  cid={search ? `${item.id}` : null}
                />
              )}
            />
          </View>
        );
      case "user":
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={users}
              keyExtractor={user => user.handle + user.created}
              renderItem={({ item }) => (
                <UserPreview
                  handle={item.handle ? `${item.handle}` : `${item.email}`}
                  profile_url={item.profile_url}
                  uid={item.email}
                />
              )}
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
