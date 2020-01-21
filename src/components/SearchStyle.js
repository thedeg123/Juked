import React from "react";
import { View, StyleSheet, Button } from "react-native";

const SearchStyle = ({ searchType, setSearchType }) => {
  return (
    <View>
      <View style={styles.backgroundStyle}>
        <Button
          title="Songs"
          style={styles.buttonStyle}
          color={searchType === "track" ? "red" : "#3480eb"}
          onPress={() => setSearchType("track")}
        />
        <Button
          title="Albums"
          style={styles.buttonStyle}
          color={searchType === "album" ? "red" : "#3480eb"}
          onPress={() => setSearchType("album")}
        />
        <Button
          title="Artists"
          style={styles.buttonStyle}
          color={searchType === "artist" ? "red" : "#3480eb"}
          onPress={() => setSearchType("artist")}
        />
        <Button
          title="Users"
          style={styles.buttonStyle}
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
  buttonStyle: {
    flex: 1,
    alignSelf: "center"
  }
});

export default SearchStyle;
