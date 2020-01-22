import React from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchPreview from "./SearchPreview";
// Switch statement

const ResultsList = ({ searchType, search, navigation }) => {
  if (searchType === "track") {
    return (
      <View>
        <SearchPreview
          title={search ? `${search.tracks.items[0].name}` : "none"}
          type={searchType}
          music_id={search ? `${search.tracks.items[0].id}` : "none"}
          navigation={navigation}
        />
        <Text>
          {search
            ? `${search.tracks.items[0].name}: ${search.tracks.items[0].id}`
            : "none"}
        </Text>
      </View>
    );
  } else if (searchType === "album") {
    return (
      <View>
        <SearchPreview
          title={search ? `${search.albums.items[0].name}` : "none"}
          type={searchType}
          music_id={search ? `${search.albums.items[0].id}` : "none"}
          navigation={navigation}
        />
        <Text>
          {search
            ? `${search.albums.items[0].name}: ${search.albums.items[0].id}`
            : "none"}
        </Text>
      </View>
    );
  } else if (searchType === "artist") {
    return (
      <View>
        <SearchPreview
          title={search ? `${search.artists.items[0].name}` : "none"}
          type={searchType}
          music_id={search ? `${search.artists.items[0].id}` : "none"}
          navigation={navigation}
        />
        <Text>
          {search
            ? `${search.artists.items[0].name}: ${search.artists.items[0].id}`
            : "none"}
        </Text>
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
