import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
  return (
    <View style={styles.backgroundStyle}>
      <FontAwesome
        name="search"
        style={styles.iconStyle}
        color={colors.primary}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Search"
        placeholderTextColor={colors.shadow}
        value={term}
        keyboardType="web-search"
        onChangeText={onTermChange}
        onEndEditing={onTermSubmit}
      />
      {term !== "" ? (
        <AntDesign
          name="close"
          style={styles.iconStyle}
          color={colors.primary}
          onPress={() => onTermChange("")}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    marginVertical: 10,
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
