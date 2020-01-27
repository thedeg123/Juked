import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import ImagePreview from "../components/MakeProfileScreenComponents/ImagePreview";
const MakeProfileScreen = () => {
  const [imageURL, setImageUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.containerStyle}>
      <ImagePreview
        imageURL={imageURL}
        setImageUrl={setImageUrl}
      ></ImagePreview>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 20,
    marginTop: 80
  }
});

export default MakeProfileScreen;
