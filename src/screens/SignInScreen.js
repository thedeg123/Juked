import React, { useContext } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

const SignInScreen = ({ navigation }) => {
  const { state, signin, remove_error } = useContext(AuthContext);

  return (
    <View style={styles.containerStyle}>
      <AuthForm
        headerText="Welcome back!"
        submitButtonAction={(email, password) => signin(email, password)}
        submitButtonTitle="Sign in"
      ></AuthForm>
      {state.errorMessage ? <Text>{state.errorMessage}</Text> : null}
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
