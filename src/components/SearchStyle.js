import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../constants/colors";

const SearchStyle = ({ searchType, onPress }) => {
  const buttonSwitch = (type, text) => {
    return (
      <TouchableOpacity
        disabled={searchType === type}
        style={
          searchType === type
            ? styles.activatedButtonStyle
            : styles.deactivatedButtonStyle
        }
        onPress={() => onPress(type)}
      >
        <Text
          style={
            searchType === type
              ? styles.activatedTextStyle
              : styles.deactivatedTextStyle
          }
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.listStyle}>
      {buttonSwitch("track", "Songs")}
      {buttonSwitch("album", "Albums")}
      {buttonSwitch("artist", "Artists")}
      {buttonSwitch("user", "Users")}
    </View>
  );
};

const buttonStyle = {
  paddingVertical: 2,
  flex: 1,
  backgroundColor: colors.primary
};

const textStyle = { textAlign: "center", color: colors.object, fontSize: 20 };

const styles = StyleSheet.create({
  listStyle: {
    backgroundColor: colors.object,
    alignSelf: "stretch",
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: "row"
  },
  activatedTextStyle: {
    ...textStyle,
    color: colors.white
  },
  deactivatedTextStyle: {
    ...textStyle,
    color: colors.primary
  },
  activatedButtonStyle: {
    ...buttonStyle,
    backgroundColor: colors.primary
  },
  deactivatedButtonStyle: {
    ...buttonStyle,
    backgroundColor: "rgba(0,0,0,0)"
  }
});

export default SearchStyle;
