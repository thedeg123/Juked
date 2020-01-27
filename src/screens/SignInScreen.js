import React, { useContext } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import useAuth from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";

const SignInScreen = ({ navigation }) => {
  const { error, signin, remove_error } = useAuth();

  return (
    <View style={styles.containerStyle}>
      <AuthForm
        headerText="Welcome back!"
        submitButtonAction={(email, password) => signin(email, password)}
        submitButtonTitle="Sign in"
      ></AuthForm>
      {error ? <Text>{error}</Text> : null}
      <Button
        onPress={() => {
          remove_error();
          return navigation.navigate("SignUp");
        }}
        title="Don't have an account? Sign up."
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    margin: 20,
    justifyContent: "center",
    flex: 1,
    marginBottom: 200
  }
});

export default SignInScreen;
