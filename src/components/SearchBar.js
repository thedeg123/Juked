import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
  const [cancel, setCancel] = useState(false);
  const inputRef = useRef(null);
  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundStyle}>
        <FontAwesome
          name="search"
          style={styles.iconStyle}
          color={colors.primary}
        />
        <TextInput
          ref={inputRef}
          style={styles.inputStyle}
          placeholder="Search"
          placeholderTextColor={colors.shadow}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType={"search"}
          value={term}
          onChangeText={onTermChange}
          onEndEditing={onTermSubmit}
          onFocus={() => setCancel(true)}
          onSubmitEditing={() => setCancel(false)}
        />
        {term !== "" ? (
          <AntDesign
            name="close"
            style={styles.iconStyle}
            onPress={() => onTermChange("")}
          />
        ) : null}
      </View>
      {cancel ? (
        <TouchableOpacity
          onPress={() => {
            inputRef.current.blur();
            return setCancel(false);
          }}
        >
          <Text style={styles.cancelStyle}>Cancel</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#ccc",
    height: 40,
    flex: 1,
    flexDirection: "row"
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  cancelStyle: {
    color: colors.primary,
    fontSize: 18,
    bottom: 5
  },
  inputStyle: {
    marginHorizontal: 10,
    fontSize: 18,
    flex: 1
  },
  iconStyle: {
    color: colors.primary,
    marginHorizontal: 10,
    fontSize: 25,
    alignSelf: "center"
  }
});

export default SearchBar;
