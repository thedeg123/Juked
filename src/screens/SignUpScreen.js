import React from "react";
import { Text, StyleSheet, Button, KeyboardAvoidingView } from "react-native";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import colors from "../constants/colors";

const SignUpScreen = ({ navigation }) => {
  const { error, signup, remove_error } = useAuth();

  return (
    <KeyboardAvoidingView behavior="position" style={styles.containerStyle}>
      <AuthForm
        confirmPassword={true}
        headerText="Welcome to Juked!"
        submitButtonAction={async (email, password, verifyPassword) =>
          await signup(email, password, verifyPassword)
        }
        submitButtonTitle="Sign up"
      ></AuthForm>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        onPress={() => {
          remove_error();
          return navigation.navigate("SignIn");
        }}
        title="Already have an account? Sign in."
      ></Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 20,
    justifyContent: "center",
    flex: 1,
    marginBottom: 200,
    marginTop: 80
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: colors.errorText
  }
});

export default SignUpScreen;
