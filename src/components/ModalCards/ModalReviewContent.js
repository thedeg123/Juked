import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import colors from "../../constants/colors";
import TopBar from "./TopBar";

const ModalReviewContent = ({ onCreate, onEdit, onDelete, onClose, link, content_type }) => {
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
            {`Are you sure you want to delete this ${content_type}?`}
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
          <TopBar onClose={onClose} link={link} showSpotify={content_type !== "List"}></TopBar>
          {onEdit ? (
            <Button onPress={onEdit} title={`Edit ${content_type}`} />
          ) : (
            <Button onPress={onCreate} title={`Add ${content_type}`} />
          )}
          {onEdit ? (
            <Button onPress={() => setShowDelete(true)} title={`Delete ${content_type}`} />
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
