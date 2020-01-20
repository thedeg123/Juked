import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
  return (
    <View style={styles.backgroundStyle}>
      <FontAwesome name="search" style={styles.iconStyle} />
      <TextInput
        style={styles.inputStyle}
        placeholder="Search"
        value={term}
        onChangeText={onTermChange}
        onEndEditing={onTermSubmit}
      />
      <AntDesign
        name="close"
        style={styles.iconStyle}
        onPress={() => onTermChange("")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    height: 45,
    flexDirection: "row"
  },
  inputStyle: {
    marginHorizontal: 10,
    fontSize: 18,
    flex: 1
  },
  iconStyle: {
    marginHorizontal: 10,
    fontSize: 25,
    alignSelf: "center"
  }
});

export default SearchBar;
