import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";

const SearchScreen = () => {
  const [term, setTerm] = useState("");

  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => console.log("To do")}
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
