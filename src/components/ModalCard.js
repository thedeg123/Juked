import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import context from "../context/context";
import colors from "../constants/colors";

const ModalCard = ({ onEdit, onDelete, onClose }) => {
  return (
    <View style={styles.content}>
      <Button onPress={onEdit} title="Edit Review" />
      <Button onPress={onDelete} title="Delete Review" />
      <Button onPress={onClose} title="Close" />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: colors.heat
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

export default ModalCard;
