import React, { useContext, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Text, Input } from "react-native-elements";
import AuthForm from "../components/AuthForm";

const SignInScreen = ({ navigation }) => {
  const { state, signin } = useContext(AuthContext);

  return (
    <View style={styles.containerStyle}>
      <AuthForm
        headerText="Welcome back!"
        submitButtonAction={() => signin()}
        submitButtonTitle="Sign in"
      ></AuthForm>
      <Button
        onPress={() => navigation.navigate("SignUp")}
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
