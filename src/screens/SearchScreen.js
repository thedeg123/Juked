import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const { search, searchAPI } = useMusic();

  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => {
          if (term !== "") {
            searchAPI(term, searchType);
          }
        }}
      />
      <SearchStyle
        searchType={searchType}
        setSearchType={setSearchType}
        term={term}
        onChangeButton={newSearchType => {
          setSearchType(newSearchType);
          if (term !== "") {
            searchAPI(term, searchType);
          }
        }}
      />
      <Text>Searching for {searchType}:</Text>
      <ResultsList
        term={term}
        searchType={searchType}
        search={search}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
