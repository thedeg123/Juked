import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import AuthForm from "../components/AuthForm";
import colors from "../constants/colors";
import context from "../context/context";
import Logo from "../components/Logo";
import CustomButton from "../components/AuthButton";
import { Input } from "react-native-elements";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const SignInScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [showForgotPasswordView, setShowForgotPasswordView] = useState(false);
  return (
    <View style={styles.containerStyle}>
      <Logo
        subtext={
          showForgotPasswordView
            ? "To reset your password, enter your account email"
            : "Welcome back!"
        }
      ></Logo>
      <KeyboardAvoidingView behavior="position">
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!showForgotPasswordView ? (
          <View>
            <AuthForm
              submitButtonAction={(email, password) =>
                firestore
                  .signin(email, password)
                  .then(error => (error ? setError(error) : null))
              }
              submitButtonTitle="Sign in"
            ></AuthForm>
          </View>
        ) : (
          <View style={{ marginTop: 20 }}>
            <Input
              label="Email"
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
                    res ? setError(res) : setError("Password reset email sent!")
                  );
              }}
            ></Input>
          </View>
        )}
      </KeyboardAvoidingView>
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
        onPress={() => {
          setError(null);
          setShowForgotPasswordView(!showForgotPasswordView);
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
