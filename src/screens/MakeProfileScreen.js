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
import { auth } from "firebase";
import Bio from "../components/MakeProfileScreenComponents/Bio";
import firebase from "firebase";
import "firebase/firestore";

const MakeProfileScreen = ({
  navigation,
  existingURL,
  existingHandle,
  existingBio
}) => {
  const [imageURL, setImageUrl] = useState(existingURL);
  const [handle, setHandle] = useState(existingHandle);
  const [bio, setBio] = useState(existingBio);
  const [error, setError] = useState("");
  let db = firebase.firestore();
  return (
    <KeyboardAvoidingView behavior="position" style={styles.containerStyle}>
      <Text style={styles.headerStyle}>Tell us about yourself,</Text>
      <ImagePreview
        imageURL={imageURL}
        setImageUrl={setImageUrl}
      ></ImagePreview>
      <View style={styles.spacerStyle}></View>
      <Handle error={error} handle={handle} setHandle={setHandle}></Handle>
      <View style={styles.spacerStyle}></View>
      <Bio bio={bio} setBio={setBio}></Bio>
      <View style={styles.spacerStyle}></View>
      <Button
        title="Get Jukin'!"
        onPress={() => {
          handle.length < 3 || handle.length > 10
            ? setError("Handles must be between 3 and 10 characters.")
            : firebase
                .firestore()
                .collection("users")
                .where("handle", "==", handle)
                .limit(1)
                .get()
                .then(doc => {
                  let res = [];
                  doc.forEach(d => res.push(d.data()));
                  if (res.length) {
                    setError(
                      "That handle has already been taken! Give it another shot!"
                    );
                    return false;
                  } else {
                    setError("");
                    return true;
                  }
                })
                .then(valid_handle => {
                  valid_handle
                    ? db
                        .collection("users")
                        .doc(auth().currentUser.email)
                        .update({
                          handle,
                          bio,
                          imageURL
                        })
                        .then(() => navigation.navigate("homeScreen"))
                    : null;
                });
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
