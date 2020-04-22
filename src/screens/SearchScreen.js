import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import useMusic from "../hooks/useMusic";
import ResultsList from "../components/ResultsList";
import context from "../context/context";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const { search, searchAPI, setSearch } = useMusic();
  const [Tab1, Tab2, Tab3, Tab4] = ["Songs", "Albums", "Artists", "Users"];
  const [users, setUsers] = useState(null);
  let firestore = useContext(context);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainerStyle}>
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
      </View>
      <ResultsList
        users={users}
        searchType={searchType}
        search={search}
        navigation={navigation}
        query={term}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainerStyle: {
    margin: 10,
    marginBottom: 0
  }
});

export default SearchScreen;
