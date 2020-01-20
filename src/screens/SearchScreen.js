import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";

const SearchScreen = () => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("song");
  const { search, searchAPI } = useMusic();

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
      <ResultsList term={term} searchType={searchType} search={search} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
