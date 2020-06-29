import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Animated } from "react-native";
import colors from "../constants/colors";


const OptionBar = ({ options, searchType, containerStyle, onPress }) => {
  const buttonSwitch = (type, title) => {
    return (
      <TouchableOpacity
        key={type + title}
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
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.listStyle, containerStyle]}>
      {options.map(({ type, title }) => buttonSwitch(type, title))}
    </View>
  );
};

const buttonStyle = {
  paddingVertical: 2,
  marginHorizontal: 2,
  borderRadius: 5,
  flex: 1,
  backgroundColor: colors.primary
};

const textStyle = { textAlign: "center", color: colors.object, fontSize: 20 };

const styles = StyleSheet.create({
  listStyle: {
    alignSelf: "stretch",
    borderColor: colors.primary,
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
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 1,
    flex: 1
  },
  deactivatedButtonStyle: {
    ...buttonStyle,
    backgroundColor: colors.white
  }
});

export default OptionBar;
