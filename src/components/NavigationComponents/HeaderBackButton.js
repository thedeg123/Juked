import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const StackHeader = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons
        name="ios-arrow-back"
        color={colors.primary}
        style={styles.backText}
      ></Ionicons>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backText: {
    color: colors.primary,
    fontSize: 30
  },
  container: {
    paddingHorizontal: 20
  }
});

export default StackHeader;
