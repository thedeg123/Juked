import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import AuthForm from "../components/AuthForm";
import colors from "../constants/colors";
import context from "../context/context";
import Logo from "../components/Logo";
import Button from "../components/AuthButton";
const SignInScreen = ({ navigation }) => {
  const firebase = useContext(context);
  const [error, setError] = useState(null);
  return (
    <View style={styles.containerStyle}>
      <Logo subtext={"Welcome back!"}></Logo>
      <KeyboardAvoidingView behavior="position">
        {<Text style={styles.errorText}>{error ? error : null}</Text>}
        <AuthForm
          headerText="Welcome back!"
          submitButtonAction={(email, password) =>
            firebase
              .signin(email, password)
              .then(error => (error ? setError(error) : null))
          }
          submitButtonTitle="Sign in"
        ></AuthForm>
      </KeyboardAvoidingView>
      <Button
        title="Don't have an account? Sign up."
        onPress={() => {
          return navigation.navigate("SignUp");
        }}
      ></Button>
    </View>
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

export default SignInScreen;
