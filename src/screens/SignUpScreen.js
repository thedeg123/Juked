import React, { useContext, useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import AuthForm from "../components/AuthForm";
import colors from "../constants/colors";
import context from "../context/context";
import TextLogo from "../components/TextLogo";
import Logo from "../components/Logo";
import Button from "../components/AuthButton";
import KeyboardAvoidingViewWrapper from "../components/KeyboardAvoidingViewWrapper";
const SignUpScreen = ({ navigation }) => {
  const { firestore } = useContext(context);

  const [keyboardIsActive, setKeyboardIsActive] = useState(false);

  useEffect(() => {
    const show =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const hide =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    const keyboardOpenListenter = Keyboard.addListener(show, () =>
      setKeyboardIsActive(true)
    );
    const keyboardCloseListenter = Keyboard.addListener(hide, () =>
      setKeyboardIsActive(false)
    );
    return () => {
      keyboardOpenListenter.remove();
      keyboardCloseListenter.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerStyle}>
        {!keyboardIsActive ? <TextLogo subtext={"Welcome to Juked!"} /> : null}
        {keyboardIsActive ? (
          <View
            style={{
              alignSelf: "center",
              flex: 1
            }}
          >
            <Logo inverse />
          </View>
        ) : null}

        <KeyboardAvoidingViewWrapper>
          <AuthForm
            confirmPassword={true}
            submitButtonAction={async (email, password, verifyPassword) =>
              await firestore
                .signup(email, password, verifyPassword)
                .then(err => {
                  if (err) {
                    Alert.alert("Couldn't create account", err);
                    return false;
                  }
                  return true;
                })
            }
            submitButtonTitle="Sign up"
          ></AuthForm>
        </KeyboardAvoidingViewWrapper>
        {!keyboardIsActive || Platform.OS != "android" ? (
          <Button
            onPress={() => {
              return navigation.navigate("SignIn");
            }}
            title="Already have an account? Sign in."
          ></Button>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.primary,
    justifyContent: "flex-end",
    flex: 1
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white
  }
});

export default SignUpScreen;
