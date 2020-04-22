import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { auth } from "firebase";
import { withNavigation } from "react-navigation";
import context from "../context/context";
import colors from "../constants/colors";

const ReviewButton = ({ navigation, content_id, content_type }) => {
  if (!content_id || !content_type) {
    console.error("Required for Review button: content_id and content_type");
  }
  const [rid, setRid] = useState(null);
  const firestore = useContext(context);
  const email = firestore.fetchCurrentUID();
  useEffect(() => {
    const findReview = () =>
      firestore
        .getReviewsByAuthorContent(email, content_id)
        .then(res => (res.exists ? setRid(res.id) : null));
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
      <Feather
        style={styles.headerRightStyle}
        color={colors.secondary}
        name="message-square"
      ></Feather>
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
      <Feather
        style={styles.headerRightStyle}
        color={colors.secondary}
        name="plus"
      ></Feather>
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
