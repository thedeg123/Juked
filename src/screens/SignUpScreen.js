import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";

const SignUpScreen = ({ navigation }) => {
  const { error, signup, remove_error } = useAuth();

  return (
    <View style={styles.containerStyle}>
      <AuthForm
        confirmPassword={true}
        headerText="Welcome to Juked!"
        submitButtonAction={(email, password, verifyPassword) =>
          signup(email, password, verifyPassword)
        }
        submitButtonTitle="Sign up"
      ></AuthForm>
      {error ? <Text>{error}</Text> : null}
      <Button
        onPress={() => {
          remove_error();
          return navigation.navigate("SignIn");
        }}
        title="Already have an account? Sign in."
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 20,
    justifyContent: "center",
    flex: 1,
    marginBottom: 200,
    marginTop: 80
  }
});

export default SignUpScreen;
