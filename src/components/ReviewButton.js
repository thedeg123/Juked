import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { auth } from "firebase";
import { withNavigation } from "react-navigation";
import useFirestore from "../hooks/useFirestore";

const ReviewButton = ({ navigation, content_id, content_type }) => {
  if (!content_id || !content_type) {
    console.error("Required for Review button: content_id and content_type");
  }
  const email = auth().currentUser.email;
  const [rid, setRid] = useState(null);
  const firestore = new useFirestore();
  useEffect(() => {
    const findReview = () =>
      firestore.getReviewsByAuthorContent(email, content_id).then(res => {
        res.forEach(r => setRid(r.id));
      });
    const listener = navigation.addListener("didFocus", () => findReview());
    return () => listener.remove();
  });
  return rid ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WriteReview", {
          rid
        })
      }
    >
      <Feather style={styles.headerRightStyle} name="message-square"></Feather>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WriteReview", {
          content_id,
          content_type
        })
      }
    >
      <Feather style={styles.headerRightStyle} name="plus"></Feather>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerRightStyle: {
    fontSize: 30,
    marginRight: 10
  }
});

export default withNavigation(ReviewButton);
