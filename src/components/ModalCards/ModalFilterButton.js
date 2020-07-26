import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors"

const ModalFilterButton = ({show, onPress, title, disabled }) => <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={show ? styles.activatedBorder : styles.deactivatedBorder}
    >
      <Text style={show ? styles.activeText : styles.deactiveText}>
        {title}
      </Text>
    </TouchableOpacity>
  
  const buttonBorder = {
    borderRadius: 5,
    paddingVertical: 10,
    flex:1,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)"
  };

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    paddingHorizontal: 10
  },
  activeText: {
    fontWeight: "bold",
    color: colors.white
  },
  deactiveText: {
    fontWeight: "bold",
    color: colors.secondary
  },
  activatedBorder: {
    ...buttonBorder,
    backgroundColor: colors.secondary
  },
  deactivatedBorder: {
    ...buttonBorder,
    backgroundColor: colors.white,
  },
});

export default ModalFilterButton;
