import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";
import Container from "../components/Container";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const { search, searchAPI, setSearch } = useMusic();
  const [Tab1, Tab2, Tab3, Tab4] = ["Songs", "Albums", "Artists", "Users"];

  const displayResults = () => {
    return (
      <ResultsList
        searchType={searchType}
        search={search}
        navigation={navigation}
      />
    );
  };

  return (
    <Container>
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
        options={[Tab1, Tab2, Tab3, Tab4]}
        searchType={searchType}
        setSearchType={setSearchType}
        onChangeButton={newType => {
          if (newType !== searchType) {
            setSearch(null);
            setSearchType(newType);
            if (term !== "") {
              searchAPI(term, newType);
            }
          }
        }}
      />
      <Text style={{ marginLeft: 10 }}>Searching for {searchType}:</Text>
      {displayResults()}
    </Container>
  );
};

const styles = StyleSheet.create({});

export default SearchScreen;
