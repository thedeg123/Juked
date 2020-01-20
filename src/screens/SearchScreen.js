import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";

const SearchScreen = () => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("song");

  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => console.log("To do")}
      />
      <SearchStyle searchType={searchType} setSearchType={setSearchType} />
      <Text>Searching for {searchType}:</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
