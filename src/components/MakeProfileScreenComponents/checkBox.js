import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import { Entypo } from "@expo/vector-icons";

const CheckBox = ({ onPress, active }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.borderStyle}>
      {active && <Entypo name="check" size={24} color={colors.primary} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  borderStyle: {
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
  imageStyle: {
    flex: 1,
    borderRadius: 5
  }
});

export default CheckBox;
