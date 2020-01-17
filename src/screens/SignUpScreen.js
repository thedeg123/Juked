import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AuthForm from "../components/AuthForm";
import { Context as AuthContext } from "../context/AuthContext";

const SignUpScreen = ({ navigation }) => {
  const { state, signup, remove_error } = useContext(AuthContext);
  return (
    <View style={styles.containerStyle}>
      <AuthForm
        headerText="Welcome to Juked!"
        submitButtonAction={(email, password) =>
          signup(email, password, () => navigation.navigate("Home"))
        }
        submitButtonTitle="Sign up"
      ></AuthForm>
      {state.errorMessage ? <Text>{state.errorMessage}</Text> : null}
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
    marginBottom: 200
  }
});

export default SignUpScreen;
