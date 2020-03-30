import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import { Input } from "react-native-elements";
import ImagePreview from "../components/MakeProfileScreenComponents/ImagePreview";
import context from "../context/context";
import colors from "../constants/colors";
import Logo from "../components/Logo";
import Button from "../components/AuthButton";

const MakeProfileScreen = ({
  navigation,
  existingURL,
  existingHandle,
  existingBio
}) => {
  const [imageURL, setImageUrl] = useState(existingURL);
  const [handle, setHandle] = useState(existingHandle);
  const [bio, setBio] = useState(existingBio);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  let firestore = useContext(context);
  return (
    <View style={styles.containerStyle}>
      {!active ? <Logo subtext="Let's make that bio,"></Logo> : null}
      {active ? <Text style={styles.smallLogoStyle}>Juked</Text> : null}
      <KeyboardAvoidingView behavior="padding">
        <ImagePreview imageURL={imageURL}></ImagePreview>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Input
          onFocus={() => setActive(true)}
          label="Paste a URL for a profile pic,"
          value={imageURL}
          labelStyle={{ color: colors.white }}
          onChangeText={setImageUrl}
          autoCapitalize="none"
          onEndEditing={() => setActive(false)}
          keyboardType="web-search"
          autoCorrect={false}
        ></Input>
        <Input
          label="Choose a handle,"
          onFocus={() => setActive(true)}
          value={"@" + handle}
          labelStyle={{ color: colors.white }}
          returnKeyType={"done"}
          onChangeText={text => setHandle(text.substring(1, 11))}
          onEndEditing={() => setActive(false)}
          autoCapitalize="none"
          autoCorrect={false}
        ></Input>
        <Input
          label="Anything else to add?"
          value={bio}
          multiline
          maxLength={200}
          onFocus={() => setActive(true)}
          blurOnSubmit
          onEndEditing={() => setActive(false)}
          returnKeyType={"done"}
          labelStyle={{ color: colors.white }}
          onChangeText={setBio}
        ></Input>
        <Button
          title="Get Jukin'!"
          onPress={() => {
            handle.length < 3 || handle.length > 10
              ? setError("Handles must be between 3 and 10 characters.")
              : firestore
                  .getUserByHandle(handle)
                  .then(res =>
                    res
                      ? setError("That handle has already been taken!")
                      : firestore
                          .updateUser(handle, bio, imageURL)
                          .then(navigation.navigate("homeFlow"))
                  );
          }}
        ></Button>
      </KeyboardAvoidingView>
    </View>
  );
};

MakeProfileScreen.defaultProps = {
  existingURL: "",
  existingHandle: "",
  existingBio: ""
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.primary,
    justifyContent: "space-between",
    flex: 1
  },
  smallLogoStyle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white
  },
  headerStyle: {
    fontSize: 32,
    alignSelf: "center",
    marginBottom: 30
  }
});

export default MakeProfileScreen;
