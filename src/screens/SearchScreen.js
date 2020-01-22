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
          if (newSearchType !== searchType) {
            setSearchType(newSearchType);
            if (term !== "") {
              console.log(term + ": " + searchType);
              searchAPI(term, searchType);
            }
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
//The problem might be that it's somehow going into another return statement
// because it hasn't really updated the searchType, so even though it does
// fine with the first part, the ResultsList is getting messed up because it
// is somehow only getting partially rerendered?

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

export default SearchScreen;
