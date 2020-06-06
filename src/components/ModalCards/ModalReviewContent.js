import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import SpotifyButton from "./SpotifyButton";
import colors from "../../constants/colors";
import TopBar from "./TopBar";

const ModalReviewContent = ({ onCreate, onEdit, onDelete, onClose, link }) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <View style={styles.content}>
      {showDelete ? (
        <View>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              marginVertical: 10,
              textAlign: "center"
            }}
          >
            Are you sure you want to delete this review?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <Button
              onPress={() => setShowDelete(false)}
              title="Cancel"
            ></Button>
            <Button onPress={onDelete} title="Yes Delete" />
          </View>
        </View>
      ) : (
        <View>
          <TopBar onClose={onClose} link={link}></TopBar>
          {onEdit ? (
            <Button onPress={onEdit} title="Edit Review" />
          ) : (
            <Button onPress={onCreate} title="Add Review" />
          )}
          {onEdit ? (
            <Button onPress={() => setShowDelete(true)} title="Delete Review" />
          ) : null}
        </View>
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

export default ModalReviewContent;
