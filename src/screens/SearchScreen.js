import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import SearchBar from "../components/SearchBar";

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
      <View style={styles.searchTypeStyle}>
        <Button title="Songs" style={styles.buttonStyle} />
        <Button title="Albums" style={styles.buttonStyle} />
        <Button title="Artists" style={styles.buttonStyle} />
        <Button title="Users" style={styles.buttonStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  searchTypeStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#3480eb",
    justifyContent: "space-between"
  },
  buttonStyle: {
    marginHorizontal: 20
  }
});

export default SearchScreen;
