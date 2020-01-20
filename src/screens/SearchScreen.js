import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";

const SearchScreen = () => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("song");
  const {
    tracks,
    albums,
    artists,
    search,
    findAlbums,
    findArtists,
    findTracks,
    searchAPI
  } = useMusic();
  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => {
          searchAPI(term, searchType);
        }}
      />
      <SearchStyle searchType={searchType} setSearchType={setSearchType} />
      <Text>Searching for {searchType}:</Text>
      <Text>
        {search
          ? `${search.artists.items[0].name}: ${search.artists.items[0].id}`
          : "none"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
