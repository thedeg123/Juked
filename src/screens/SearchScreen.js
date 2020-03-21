import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";
import Container from "../components/Container";
import useFirestore from "../hooks/useFirestore";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const { search, searchAPI, setSearch } = useMusic();
  const [Tab1, Tab2, Tab3, Tab4] = ["Songs", "Albums", "Artists", "Users"];
  const [user, setUser] = useState(null);

  const displayResults = () => {
    return (
      <ResultsList
        user={user}
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
            if (searchType === "user") {
              useFirestore.getUser(term).then(myUser => {
                setUser(myUser);
              });
            } else {
              searchAPI(term, searchType);
            }
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
              if (newType === "user") {
                useFirestore.getUser(term).then(myUser => {
                  setUser(myUser);
                });
              } else {
                searchAPI(term, newType);
              }
            }
          }
        }}
      />
      {displayResults()}
    </Container>
  );
};

const styles = StyleSheet.create({});

export default SearchScreen;
