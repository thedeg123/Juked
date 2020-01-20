import React from "react";
import { View, StyleSheet, Button } from "react-native";

const SearchStyle = ({ searchType, setSearchType }) => {
  return (
    <View>
      <View style={styles.backgroundStyle}>
        <Button
          title="Songs"
          style={styles.buttonPressedStyle}
          color={searchType === "song" ? "red" : "#3480eb"}
          onPress={() => setSearchType("song")}
        />
        <Button
          title="Albums"
          style={styles.buttonNotPressedStyle}
          color={searchType === "album" ? "red" : "#3480eb"}
          onPress={() => setSearchType("album")}
        />
        <Button
          title="Artists"
          style={styles.buttonNotPressedStyle}
          color={searchType === "artist" ? "red" : "#3480eb"}
          onPress={() => setSearchType("artist")}
        />
        <Button
          title="Users"
          style={styles.buttonNotPressedStyle}
          color={searchType === "user" ? "red" : "#3480eb"}
          onPress={() => setSearchType("user")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    marginVertical: 10,
    justifyContent: "space-between",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#3480eb"
  },
  buttonPressedStyle: {},
  buttonNotPressedStyle: {}
});

export default SearchStyle;
