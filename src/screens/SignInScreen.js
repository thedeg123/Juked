import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Platform,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import AuthForm from "../components/AuthForm";
import Button from "../components/BaseButton";
import colors from "../constants/colors";
import context from "../context/context";
import TextLogo from "../components/TextLogo";
import Logo from "../components/Logo";
import CustomButton from "../components/AuthButton";
import { Input } from "react-native-elements";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import KeyboardAvoidingViewWrapper from "../components/KeyboardAvoidingViewWrapper";

const SignInScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const [email, setEmail] = useState(null);
  const [showForgotPasswordView, setShowForgotPasswordView] = useState(false);

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
        {!keyboardIsActive ? (
          <TextLogo
            subtext={
              showForgotPasswordView
                ? "To reset your password, enter your account email"
                : "Welcome back!"
            }
          />
        ) : null}
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
          {!showForgotPasswordView ? (
            <View>
              <AuthForm
                submitButtonAction={async (email, password) =>
                  await firestore.signin(email, password).then(error => {
                    if (error) {
                      Alert.alert("Couldn't sign in", error);
                      return false;
                    }
                    return true;
                  })
                }
                submitButtonTitle="Sign in"
              ></AuthForm>
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Input
                label="Email"
                inputContainerStyle={{
                  borderColor: colors.veryVeryTranslucentWhite
                }}
                leftIcon={<Ionicons name="ios-mail" style={styles.iconStyle} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={Keyboard.dismiss}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    <AntDesign name="down" style={{ fontSize: 20 }} />
                  </TouchableOpacity>
                }
                value={email}
                onChangeText={text => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType={"send"}
                selectionColor={colors.white}
                labelStyle={{ color: colors.white }}
                autoCorrect={false}
                onSubmitEditing={() => {
                  firestore
                    .resetEmail(email)
                    .then(res =>
                      res
                        ? Alert.alert("Couldn't send email", res)
                        : Alert.alert("Success", "Password reset email sent!")
                    );
                }}
              ></Input>
            </View>
          )}
        </KeyboardAvoidingViewWrapper>
        <CustomButton
          title="Don't have an account? Sign up."
          onPress={() => {
            return navigation.navigate("SignUp");
          }}
        ></CustomButton>
        <Button
          color={colors.white}
          title={
            showForgotPasswordView
              ? "Nevermind, I remembered"
              : "Forgot Password?"
          }
          onPress={() => setShowForgotPasswordView(!showForgotPasswordView)}
        ></Button>
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
  iconStyle: {
    fontSize: 25,
    right: 10,
    alignSelf: "flex-start"
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white
  }
});

export default SignInScreen;
