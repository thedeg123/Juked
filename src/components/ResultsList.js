import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const ResultsList = ({ term, searchType, search }) => {
  if (searchType === "track") {
    return (
      <View>
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
