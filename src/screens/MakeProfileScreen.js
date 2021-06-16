import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Input } from "react-native-elements";
import ImagePreview from "../components/MakeProfileScreenComponents/ImagePreview";
import context from "../context/context";
import colors from "../constants/colors";
import TextLogo from "../components/TextLogo";
import Button from "../components/AuthButton";
import Logo from "../components/Logo";
import KeyboardAvoidingView from "../components/KeyboardAvoidingViewWrapper";

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
  const handleRef = useRef(null);
  const bioRef = useRef(null);

  const { firestore } = useContext(context);

  useEffect(() => {
    firestore.registerForPushNotifications();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerStyle}>
        {!active ? <TextLogo subtext="Let's make that profile," /> : null}
        {active ? (
          <View
            style={{
              alignSelf: "center",
              flex: 1
            }}
          >
            <Logo inverse />
          </View>
        ) : null}
        <KeyboardAvoidingView>
          <ImagePreview imageURL={imageURL}></ImagePreview>
          <Input
            onFocus={() => setActive(true)}
            label="Paste a URL for a profile pic,"
            value={imageURL}
            selectionColor={colors.white}
            inputContainerStyle={{
              borderColor: colors.veryVeryTranslucentWhite
            }}
            labelStyle={styles.textStyle}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            returnKeyType={"next"}
            onBlur={() => setActive(false)}
            onSubmitEditing={() => {
              return handleRef.current.focus();
            }}
            keyboardType="web-search"
            autoCorrect={false}
          ></Input>
          <Input
            ref={handleRef}
            label="Choose a handle,"
            onFocus={() => setActive(true)}
            inputContainerStyle={{
              borderColor: colors.veryVeryTranslucentWhite
            }}
            value={handle}
            selectionColor={colors.white}
            labelStyle={styles.textStyle}
            maxLength={15}
            returnKeyType={"done"}
            onChangeText={setHandle}
            onBlur={() => setActive(false)}
            onSubmitEditing={() => {
              return bioRef.current.focus();
            }}
            autoCapitalize="none"
            autoCorrect={false}
          ></Input>
          <Input
            ref={bioRef}
            label="Add a bio"
            value={bio}
            multiline
            maxLength={200}
            selectionColor={colors.white}
            inputContainerStyle={{
              borderColor: colors.veryVeryTranslucentWhite,
              marginBottom: 20
            }}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            blurOnSubmit
            onSubmitEditing={() => setActive(false)}
            returnKeyType={"done"}
            labelStyle={styles.textStyle}
            onChangeText={setBio}
          ></Input>
          <Button
            title="Get Jukin'!"
            onPress={() => {
              handle.length < 3 || handle.length > 15
                ? Alert.alert(
                    "Uh oh",
                    "Handles must be between 3 and 15 characters."
                  )
                : firestore
                    .getUserByHandle(handle)
                    .then(res =>
                      res
                        ? Alert.alert(
                            "That handle has already been taken.",
                            "Get creative!"
                          )
                        : firestore
                            .updateUser(handle, bio, imageURL)
                            .then(navigation.navigate("homeFlow"))
                    );
            }}
          ></Button>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
  textStyle: { fontSize: 20, color: colors.white },
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
