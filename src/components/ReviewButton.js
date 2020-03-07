import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { auth } from "firebase";
import useFirestore from "../hooks/useFirestore";
import { withNavigation } from "react-navigation";

const ReviewButton = ({ navigation, content_id, content_type }) => {
  if (!content_id || !content_type) {
    console.error("Required for Review button: content_id and content_type");
  }
  const email = auth().currentUser.email;
  const [rid, setRid] = useState(null);
  useEffect(() => {
    useFirestore.getReviewsByAuthorContent(email, content_id).then(review => {
      return setRid(review.query[0] ? review.query[0].id : null);
    });
  });
  return rid ? (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("WriteReview", {
          rid
        })
      }
    >
      <Feather style={styles.headerRightStyle} name="edit"></Feather>
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
