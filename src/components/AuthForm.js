import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import Button from "./AuthButton";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "../components/AuthLoading";

const AuthForm = ({
  submitButtonAction,
  submitButtonTitle,
  confirmPassword
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  return (
    <View>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        label="Email"
        leftIcon={<Ionicons name="ios-mail" style={styles.iconStyle} />}
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType={"next"}
        selectionColor={colors.white}
        labelStyle={{ color: colors.white }}
        inputContainerStyle={{ borderColor: colors.veryVeryTranslucentWhite }}
        autoCorrect={false}
        onSubmitEditing={() => passwordRef.current.focus()}
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        ref={passwordRef}
        value={password}
        selectTextOnFocus
        inputContainerStyle={{ borderColor: colors.veryVeryTranslucentWhite }}
        secureTextEntry={true}
        labelStyle={{ color: colors.white }}
        label={"Password"}
        selectionColor={colors.white}
        leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
        returnKeyType={confirmPassword ? "next" : "done"}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() =>
          confirmPassword ? confirmPasswordRef.current.focus() : null
        }
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      {confirmPassword ? (
        <Input
          ref={confirmPasswordRef}
          value={verifyPassword}
          selectTextOnFocus
          inputContainerStyle={{ borderColor: colors.veryVeryTranslucentWhite }}
          secureTextEntry={true}
          selectionColor={colors.white}
          labelStyle={{ color: colors.white }}
          label={"Confirm Password"}
          leftIcon={<Ionicons name="ios-lock" style={styles.iconStyle} />}
          returnKeyType={"done"}
          onChangeText={setVerifyPassword}
          autoCapitalize="none"
          autoCorrect={false}
        ></Input>
      ) : null}
      {loading ? (
        <AuthLoading></AuthLoading>
      ) : (
        <Button
          onPress={() => {
            setLoading(true);
            confirmPassword
              ? submitButtonAction(email, password, verifyPassword).then(
                  ok => !ok && setLoading(false)
                )
              : submitButtonAction(email, password).then(
                  ok => !ok && setLoading(false)
                );
          }}
          title={submitButtonTitle}
        ></Button>
      )}
    </View>
  );
};

AuthForm.defaultProps = {
  confirmPassword: false
};
const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 64,
    alignSelf: "center",
    marginBottom: 30
  },
  iconStyle: {
    fontSize: 25,
    right: 10,
    alignSelf: "flex-start"
  },
  verticalSpacerStyle: {
    marginVertical: 10
  }
});

export default AuthForm;
