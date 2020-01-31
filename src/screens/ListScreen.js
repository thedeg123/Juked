import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import useFirestore from "../hooks/useFirestore";
import SearchPreview from "../components/SearchPreview";
import UserPreview from "../components/UserPreview";

const ListScreen = ({ navigation }) => {
  const type = navigation.getParam("type");
  const user = navigation.getParam("user");
  //user.followers and user.following
  const reviews = navigation.getParam("reviews");
  if (reviews) {
    const tracks = reviews
      .filter(function(item) {
        return item.review.type === "track";
      })
      .map(function({ item }) {
        return item;
      });

    const albums = reviews
      .filter(function(item) {
        return item.review.type === "album";
      })
      .map(function({ item }) {
        return item;
      });

    const artists = reviews
      .filter(function(item) {
        console.log(item);
        return item.type === "album";
      })
      .map(function({ item }) {
        return item;
      });

    //console.log(artists);
  }

  // reviews.map(review => {
  //   if (review.review.type === type) {
  //     num++;
  //   }
  // });

  switch (type) {
    case "following":
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={user.following}
            keyExtractor={item => item}
            renderItem={({ person }) => {
              return (
                <View>
                  <UserPreview
                    handle={person}
                    //profile_url={person.profile_url}
                    uid={person}
                  />
                </View>
              );
            }}
          />
        </View>
      );
    case "followers":
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={user.followers}
            keyExtractor={item => item}
            renderItem={({ person }) => {
              return (
                <View>
                  <UserPreview
                    handle={person}
                    //profile_url={person.profile_url}
                    uid={person}
                  />
                </View>
              );
            }}
          />
        </View>
      );
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
                    type={type}
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
                    type={type}
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
                    type={type}
                    object={item}
                    cid={search ? `${item.id}` : null}
                  />
                </View>
              );
            }}
          />
        </View>
      );
    case "list":
      return (
        <View>
          <Text>This is a list</Text>
        </View>
      );
    default:
      return (
        <View>
          <Text>Nothing</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ListScreen;
