import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Button
} from "react-native";
import ImagePreview from "../components/MakeProfileScreenComponents/ImagePreview";
import Handle from "../components/MakeProfileScreenComponents/Handle";
import useFirestore from "../hooks/useFirestore";
import { auth } from "firebase";
import Bio from "../components/MakeProfileScreenComponents/Bio";

const MakeProfileScreen = ({
  navigation,
  existingURL,
  existingHandle,
  existingBio
}) => {
  const [imageURL, setImageUrl] = useState(existingURL);
  const [user_handle, setHandle] = useState(existingHandle);
  const [bio, setBio] = useState(existingBio);
  const [error, setError] = useState("");
  return (
    <KeyboardAvoidingView behavior="position" style={styles.containerStyle}>
      <Text style={styles.headerStyle}>Tell us about yourself,</Text>
      <ImagePreview
        imageURL={imageURL}
        setImageUrl={setImageUrl}
      ></ImagePreview>
      <View style={styles.spacerStyle}></View>
      <Handle
        error={error}
        setError={setError}
        handle={user_handle}
        setHandle={setHandle}
      ></Handle>
      <View style={styles.spacerStyle}></View>
      <Bio bio={bio} setBio={setBio}></Bio>
      <View style={styles.spacerStyle}></View>
      <Button
        title="Get Jukin'!"
        onPress={() => {
          if (user_handle.length && !error.length) {
            useFirestore.updateUser(
              auth().currentUser.email,
              undefined,
              user_handle,
              bio,
              imageURL,
              undefined,
              undefined
            );
            navigation.navigate("homeFlow");
          }
        }}
      ></Button>
    </KeyboardAvoidingView>
  );
};

MakeProfileScreen.defaultProps = {
  existingURL: "",
  existingHandle: "",
  existingBio: ""
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 20,
    marginTop: 40
  },
  spacerStyle: {
    marginVertical: 20
  },
  headerStyle: {
    fontSize: 32,
    alignSelf: "center",
    marginBottom: 30
  }
});

export default MakeProfileScreen;
