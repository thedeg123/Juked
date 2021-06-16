import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../BaseButton";
import colors from "../../constants/colors";

const ModalBlockContent = ({ onClose, onBlock, isBlocked }) => {
  return (
    <View style={styles.content}>
      <Button title="Close" onPress={onClose}></Button>
      <Button
        title={isBlocked ? "unblock User" : "Block User"}
        onPress={onBlock}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    borderRadius: 5
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

export default ModalBlockContent;
