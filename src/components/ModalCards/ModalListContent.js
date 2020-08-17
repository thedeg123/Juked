import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../BaseButton";
import colors from "../../constants/colors";
import TopBar from "./TopBar";

const ModalListContent = ({ onDelete, onClose, showDelete, content }) => {
  return (
    <View style={styles.content}>
      <TopBar onClose={onClose} content={content} showSpotify></TopBar>
      {showDelete && (
        <Button
          title={"Remove from ListenList"}
          onPress={() => {
            onDelete();
            onClose();
          }}
        />
      )}
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
