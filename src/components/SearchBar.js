import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet
} from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { customSearchAnimation } from "../constants/heights";

const SearchBar = ({ term, onTermChange, onTermSubmit, keyboardIsActive }) => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const [cancel, setCancel] = useState(false);
  const inputRef = useRef(null);
  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundStyle}>
        <Octicons
          name="search"
          style={styles.iconStyle}
          color={keyboardIsActive ? colors.primary : colors.shadow}
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
          onFocus={() => {
            LayoutAnimation.configureNext(customSearchAnimation);
            setCancel(true);
          }}
          onSubmitEditing={() => {
            onTermSubmit(term);
            return setCancel(false);
          }}
        />
        {term !== "" ? (
          <AntDesign
            name="close"
            style={styles.iconStyle}
            color={colors.primary}
            onPress={() => {
              onTermSubmit("");
              inputRef.current.focus();
            }}
          />
        ) : null}
      </View>
      {cancel ? (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(customSearchAnimation);
            inputRef.current.blur();
            onTermSubmit("");
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
    backgroundColor: colors.searchBackground,
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
    marginLeft: 5,
    color: colors.primary,
    fontSize: 18,
    bottom: 5
  },
  inputStyle: {
    marginRight: 10,
    fontSize: 18,
    flex: 1
  },
  iconStyle: {
    padding: 10,
    fontSize: 16,
    alignSelf: "center"
  }
});

export default SearchBar;
