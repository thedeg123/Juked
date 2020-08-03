import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import AuthForm from "../components/AuthForm";
import colors from "../constants/colors";
import context from "../context/context";
import Logo from "../components/Logo";
import Button from "../components/AuthButton";
const SignUpScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerStyle}>
        <Logo subtext={"Welcome to Juked!"}></Logo>
        <KeyboardAvoidingView behavior="position">
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
        </KeyboardAvoidingView>
        <Button
          onPress={() => {
            return navigation.navigate("SignIn");
          }}
          title="Already have an account? Sign in."
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
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white
  }
});

export default SignUpScreen;
