import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import AuthForm from "../components/AuthForm";
import colors from "../constants/colors";
import context from "../context/context";
import Logo from "../components/Logo";
import Button from "../components/AuthButton";
const SignUpScreen = ({ navigation }) => {
  const firestore = useContext(context);
  let [error, setError] = useState(null);
  return (
    <View style={styles.containerStyle}>
      <Logo subtext={"Welcome to Juked!"}></Logo>
      <KeyboardAvoidingView behavior="position">
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <AuthForm
          confirmPassword={true}
          submitButtonAction={async (email, password, verifyPassword) =>
            await firestore
              .signup(email, password, verifyPassword)
              .then(err => (err ? setError(err) : null))
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
