import React, { useState } from "react";
import { StyleSheet, Button, Text, View } from "react-native";

import colors from "../../constants/colors";

const ModalReviewContent = ({ onCreate, onEdit, onDelete, onClose }) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <View style={styles.content}>
      {showDelete ? (
        <View>
          <Text style={{ color: colors.text }}>
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
          {onEdit ? (
            <Button onPress={onEdit} title="Edit Review" />
          ) : (
            <Button onPress={onCreate} title="Add Review" />
          )}
          {onEdit ? (
            <Button onPress={() => setShowDelete(true)} title="Delete Review" />
          ) : null}
          <Button onPress={onClose} title="Done" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 50,
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

export default ModalReviewContent;
