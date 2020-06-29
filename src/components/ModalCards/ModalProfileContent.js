import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import SpotifyButton from "./SpotifyButton";
import colors from "../../constants/colors";
import TopBar from "./TopBar";
import { withNavigation } from "react-navigation";

const ModalProfileContent = ({ navigation, onClose, onSignOut, onEdit }) => {
  return (
    <View style={styles.content}>
      <Button title="Close" onPress={onClose}></Button>
      <Button title="Edit Profile" onPress={onEdit}></Button>
      <Button title="Sign out" onPress={onSignOut}></Button>
      <Button title="Donate" onPress={() => {}}></Button>
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

export default withNavigation(ModalProfileContent);