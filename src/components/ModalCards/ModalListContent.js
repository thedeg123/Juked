import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import colors from "../../constants/colors";
import TopBar from "./TopBar";

const ModalListContent = ({ onDelete, onClose, link }) => {
  return (
    <View style={styles.content}>
      <TopBar onClose={onClose} link={link} showSpotify></TopBar>
      <Button
        title={"Remove from ListenList"}
        onPress={() => {
          onDelete();
          onClose();
        }}
      />
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

export default ModalListContent;
