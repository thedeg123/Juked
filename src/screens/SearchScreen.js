import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";
import Container from "../components/Container";
import context from "../context/context";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const { search, searchAPI, setSearch } = useMusic();
  const [Tab1, Tab2, Tab3, Tab4] = ["Songs", "Albums", "Artists", "Users"];
  const [users, setUsers] = useState(null);
  let firestore = useContext(context);

  const displayResults = () => {
    return (
      <ResultsList
        users={users}
        searchType={searchType}
        search={search}
        navigation={navigation}
        query={term}
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
              firestore.searchUser(term).then(myUsers => {
                setUsers(myUsers);
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
                firestore.searchUser(term).then(myUsers => {
                  setUsers(myUsers);
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
