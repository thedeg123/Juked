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
  const [searchAndType, setSearchAndType] = useState([search, searchType]);

  const displayResults = () => {
    return (
      <ResultsList
        searchType={searchType}
        search={searchAndType[0]}
        navigation={navigation}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => {
          if (term !== "") {
            searchAPI(term, searchType).then(
              setSearchAndType([search, searchType])
            );
          }
        }}
      />
      <SearchStyle
        searchType={searchType}
        setSearchType={setSearchType}
        onChangeButton={newType => {
          if (newType !== searchType) {
            setSearchType(newType);
            if (term !== "") {
              searchAPI(term, newType).then(
                setSearchAndType([search, newType])
              );
            }
          }
        }}
      />
      <Text>Searching for {searchType}:</Text>
      {displayResults()}
    </View>
  );
};
//The problem is that the search isn't updating, even thought the searchType is.
// This means that when we try to load the results, we get errors

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
